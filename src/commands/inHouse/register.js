const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Registers a Riot ID to your Discord account"),
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("register-summoner")
      .setTitle("Riot ID");

    const textInput = new TextInputBuilder()
      .setCustomId("summonerNameInput")
      .setLabel("What is your Riot ID (ie. Sarorian#NA1)")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));

    await interaction.showModal(modal);
  },
};
