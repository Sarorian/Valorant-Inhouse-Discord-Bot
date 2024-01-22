const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Returns an embed."),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("This is an EMBED!")
      .setDescription("This is a very cool descrpition")
      .setColor(client.color)
      .setImage(client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setAuthor({
        url: `https://youtube.com`,
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag,
      })
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      })
      .setURL("https://wilsonchronicles.com/owen")
      .addFields([
        {
          name: "Name 1",
          value: "Value 2",
          inline: true,
        },
        {
          name: "Name 2",
          value: "Value 2",
          inline: true,
        },
      ]);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
