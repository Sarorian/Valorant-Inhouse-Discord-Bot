module.exports = {
  data: {
    name: "top",
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: "https://www.youtube.com/channel/UC-ssS-gHUCUQ6TA3poLtUyA",
    });
  },
};
