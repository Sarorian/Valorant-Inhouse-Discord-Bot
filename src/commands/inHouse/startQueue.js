const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  Embed,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Starts the Inhouse Queue"),
  async execute(interaction, client) {
    const ROLES = {
      inQueue: "1174460337949524028",
      inGame: "1174460684168347759",
    };

    const embed = new EmbedBuilder()
      .setTitle("Inhouse: 10 More Needed")
      .setColor(client.color)
      .setTimestamp(Date.now())
      .addFields([
        {
          name: "Players",
          value: "LIST TEMP",
          inline: true,
        },
      ]);
    const joinButton = new ButtonBuilder()
      .setLabel("Join")
      .setStyle(ButtonStyle.Success)
      .setCustomId("join");

    const leaveButton = new ButtonBuilder()
      .setLabel("Leave")
      .setStyle(ButtonStyle.Danger)
      .setCustomId("leave");

    const buttonRow = new ActionRowBuilder().addComponents(
      joinButton,
      leaveButton
    );

    const reply = await interaction.reply({
      embeds: [embed],
      components: [buttonRow],
    });

    console.log(reply);

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    collector.on("collect", (interaction) => {
      const queuePath = path.join(__dirname, "../../data/currentQueue.json");
      const queueData = JSON.parse(fs.readFileSync(queuePath, "utf8"));
      let queue = [];
      const playersPath = path.join(__dirname, "../../data/players.json");
      const playersData = JSON.parse(fs.readFileSync(playersPath, "utf8"));

      const user = interaction.user.username;

      const isPlayerInQueue = queueData.some(
        (queuedPlayer) => queuedPlayer.discordUsername === user
      );

      const registeredPlayer = playersData.find(
        (playerData) => playerData.discordUsername === user
      );

      if (!registeredPlayer) {
        interaction.reply({
          content: "You are not a registered player. Please use /register",
          ephemeral: true,
        });
        return;
      }

      if (interaction.customId === "join") {
        if (!isPlayerInQueue) {
          queue.push(registeredPlayer);
          fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
          interaction.member.roles.add(ROLES.inQueue);
          interaction.reply({
            content: `${registeredPlayer.discordUsername} joined the queue`,
            ephemeral: true,
          });
          let playersInQueue = queue.length;
          const receivedEmbed = reply.embeds[0];
          console.log(receivedEmbed);
          const newEmbed = EmbedBuilder.from(receivedEmbed).setTitle(
            `Inhouse: ${10 - playersInQueue} More Needed`
          );
          reply.edit({ embeds: [newEmbed] });
        } else {
          interaction.reply({
            content: `${registeredPlayer.discordUsername} is already in the queue`,
            ephemeral: true,
          });
        }
      }
      if (interaction.customId === "leave") {
        if (isPlayerInQueue) {
          queue = queueData.filter(
            (queuedPlayer) => queuedPlayer.discordUsername !== user
          );
          fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
          interaction.member.roles.remove(ROLES.inQueue);
          interaction.reply({
            content: `${registeredPlayer.discordUsername} left the queue`,
            ephemeral: true,
          });
          let playersInQueue = queue.length;
          const receivedEmbed = reply.embeds[0];
          const newEmbed = EmbedBuilder.from(receivedEmbed).setTitle(
            `Inhouse: ${10 - playersInQueue} More Needed`
          );
          reply.edit({ embeds: [newEmbed] });
        } else {
          interaction.reply({
            content: `${registeredPlayer.discordUsername} is not in the queue`,
            ephemeral: true,
          });
        }
      }
    });
  },
};
