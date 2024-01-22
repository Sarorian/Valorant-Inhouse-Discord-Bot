const axios = require("axios");
const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getsummonername")
    .setDescription("Gets the summoner name of a registered user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The Discord user")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    // Read the existing players data from the file
    const playersPath = path.join(__dirname, "../../data/players.json");
    let players = [];
    try {
      const data = fs.readFileSync(playersPath, "utf8");
      players = JSON.parse(data);
    } catch (err) {
      console.error("Error reading players data:", err);
      await interaction.reply({
        content: "An error occurred while retrieving player data.",
        ephemeral: true,
      });
      return;
    }

    // Get the mentioned user from the interaction
    const mentionedUser = interaction.options.getUser("user");

    // Find the player with a matching discord username in the players data
    const player = players.find(
      (player) => player.discordUsername === mentionedUser.username
    );

    // If the player is not found, send an error message
    if (!player) {
      await interaction.reply({
        content: "The specified user is not a registered player.",
        ephemeral: true,
      });
      return;
    }

    // Make a request to the Riot Games API to get summoner data
    const apiKey = process.env.API_KEY;
    const puuid = player.puuid;
    const apiUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const summonerData = response.data;
      const summonerName = summonerData.name;

      await interaction.reply({
        content: `The summoner name of ${mentionedUser.username} is ${summonerName}`,
        ephemeral: true,
      });
    } catch (err) {
      console.error("Error retrieving summoner data:", err);
      await interaction.reply({
        content: "An error occurred while retrieving summoner data.",
        ephemeral: true,
      });
    }
  },
};
