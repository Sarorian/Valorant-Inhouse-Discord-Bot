const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("conclude")
    .setDescription("Use after a match"),
  async execute(interaction, client) {
    const team1Button = new ButtonBuilder()
      .setCustomId("team1")
      .setLabel("Team 1")
      .setStyle(ButtonStyle.Primary);
    const team2Button = new ButtonBuilder()
      .setCustomId("team2")
      .setLabel("Team 2")
      .setStyle(ButtonStyle.Danger);

    await interaction.reply({
      content: "Which team won the most recent match?",
      components: [
        new ActionRowBuilder().addComponents(team1Button, team2Button),
      ],
    });
  },
};
