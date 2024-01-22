module.exports = {
  data: {
    name: "sub-yt",
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: "https://www.youtube.com/channel/UC-ssS-gHUCUQ6TA3poLtUyA",
    });
  },
};
