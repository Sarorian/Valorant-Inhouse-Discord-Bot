const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: {
    name: "register-summoner",
  },
  async execute(interaction, client) {
    const discordId = await interaction.member.user.id;
    const discordDisplayName = await interaction.member.displayName;
    const discordUsername = await interaction.user.username;
    const [user, tagLine] = await interaction.fields
      .getTextInputValue("summonerNameInput")
      .split("#");

    // Make a request to the Riot Games API to get summoner data
    const apiUrl = `https://api.henrikdev.xyz/valorant/v1/account/${user}/${tagLine}?force=true`;

    let puuid = "";

    try {
      const response = await axios.get(apiUrl);
      const summonerData = response.data;
      puuid = summonerData.data.puuid;
    } catch (err) {
      console.error("Error retrieving Riot ID data:", err);
      await interaction.reply({
        content: "Error retrieving Riot ID data. Please try again later.",
        ephemeral: true,
      });
      return;
    }

    // Construct the player object
    const player = {
      discordDisplayName,
      discordUsername,
      discordId,
      puuid,
      user: user,
      tag: tagLine,
      score: {
        sp: 500,
        w: 0,
        l: 0,
      },
    };

    // Read the existing players data from the file
    const playersPath = path.join(__dirname, "../../data/players.json");
    let players = [];
    try {
      const data = fs.readFileSync(playersPath, "utf8");
      players = JSON.parse(data);
    } catch (err) {
      console.error("Error reading players data:", err);
    }

    // Check if the PUUID is already registered or if the user has already registered a summoner name
    const isPuuidRegistered = players.some((player) => player.puuid === puuid);
    const isUserRegistered = players.some(
      (player) => player.discordId === discordId
    );

    if (isPuuidRegistered) {
      await interaction.reply({
        content: "This Riot ID is already registered.",
        ephemeral: true,
      });
      return;
    }

    if (isUserRegistered) {
      await interaction.reply({
        content: "You have already registered a Riot ID.",
        ephemeral: true,
      });
      return;
    }

    // Add the new player to the list
    players.push(player);

    // Write the updated players data back to the file
    try {
      fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
      console.log(`${discordDisplayName}'s data written to players.json file.`);
    } catch (err) {
      console.error("Error writing players data:", err);
    }

    await interaction.reply({
      content: `${discordDisplayName} has successfully registered their Riot ID.`,
      ephemeral: true,
    });
  },
};
