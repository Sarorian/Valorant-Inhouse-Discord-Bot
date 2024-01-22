const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the leaderboard"),
  async execute(interaction, client) {
    const playersPath = path.join(__dirname, "../../data/players.json");
    const playersData = JSON.parse(fs.readFileSync(playersPath, "utf8"));

    // Sort players by sp in descending order
    const sortedPlayers = playersData.sort((a, b) => b.score.sp - a.score.sp);

    // Create an array of embed fields from the sorted player data
    const leaderboardFields = sortedPlayers.map((player, index) => ({
      name: `${index + 1}. ${player.user}`, // Assuming the player object has a "user" property
      value: `SP: ${player.score.sp} | Wins: ${player.score.w} | Losses: ${player.score.l}`,
      inline: false,
    }));

    const embed = new EmbedBuilder()
      .setTitle("Leaderboard")
      .setColor(client.color)
      .addFields(leaderboardFields);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
