const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Returns a select menu"),
  async execute(interaction, client) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId("sub-menu")
      .setMinValues(1)
      .setMaxValues(1)
      .setOptions(
        new StringSelectMenuOptionBuilder({
          label: `YouTube`,
          value: "https://www.youtube.com/channel/UC-ssS-gHUCUQ6TA3poLtUyA",
        }),
        new StringSelectMenuOptionBuilder({
          label: "PornHub",
          value: "https://pornhub.com",
        })
      );
    await interaction.reply({
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },
};
