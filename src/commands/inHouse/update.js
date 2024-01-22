const { SlashCommandBuilder, Guild } = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Updates the players.json file"),
  async execute(interaction, client) {
    try {
      await interaction.reply({
        content: "Updating players...",
        ephemeral: true,
      });

      const playersPath = path.join(__dirname, "../../data/players.json");
      const playersData = JSON.parse(fs.readFileSync(playersPath, "utf8"));

      for (let i = 0; i < playersData.length; i++) {
        const player = playersData[i];
        const discordUser = await Guild.members.fetch(player.discordId);
        console.log(discordUser);
        const riotUser = await axios(
          `https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${player.puuid}`
        );

        const { tag, name } = riotUser.data.data;

        // Update discordDisplayName, user, and tag
        // player.discordDisplayName = discordUser.member.displayName;
        player.user = name;
        player.tag = tag;

        console.log(player.user, player.tag);
        // You may want to add a delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`Data gathered for ${player.discordDisplayName}`);
      }

      // Save the updated players data back to the file
      fs.writeFileSync(playersPath, JSON.stringify(playersData, null, 2));

      await interaction.editReply({
        content: "Players.json updated successfully.",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "An error occurred while updating players.json.",
        ephemeral: true,
      });
    }
  },
};
