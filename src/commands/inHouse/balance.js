const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function getRank(player) {
  try {
    const response = await axios(
      `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/na/${player.puuid}`
    );

    const { currenttierpatched, elo } = response.data.data;

    return { currenttierpatched, elo };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function balanceTeams(players) {
  const maxMmrDiff = 300;

  // Add MMR to each player
  for (const player of players) {
    const { currenttierpatched, elo } = await getRank(player);

    if (currenttierpatched && elo) {
      player.rank = currenttierpatched;
      player.mmr = elo;
      console.log(player);
    } else {
      console.error(`Failed to retrieve rank information for ${player.user}`);
    }
  }

  // Sort players by MMR
  const sortedPlayers = players.sort((a, b) => b.mmr - a.mmr);

  // Divide players into teams
  let team1 = [];
  let team2 = [];
  let totalMmrTeam1 = 0;
  let totalMmrTeam2 = 0;
  for (const player of sortedPlayers) {
    const shouldAddToTeam1 = Math.random() >= 0.5 && team1.length < 5;
    if (shouldAddToTeam1) {
      if (totalMmrTeam1 + player.mmr - totalMmrTeam2 <= maxMmrDiff) {
        team1.push(player);
        totalMmrTeam1 += player.mmr;
      } else {
        team2.push(player);
        totalMmrTeam2 += player.mmr;
      }
    } else {
      if (totalMmrTeam2 + player.mmr - totalMmrTeam1 <= maxMmrDiff) {
        team2.push(player);
        totalMmrTeam2 += player.mmr;
      } else {
        team1.push(player);
        totalMmrTeam1 += player.mmr;
      }
    }
  }

  // If the teams don't have exactly 5 players each, redistribute the players
  while (team1.length !== 5 || team2.length !== 5) {
    const playersToRedistribute = team1.concat(team2);
    team1 = [];
    team2 = [];
    totalMmrTeam1 = 0;
    totalMmrTeam2 = 0;
    for (const player of playersToRedistribute) {
      const shouldAddToTeam1 = Math.random() >= 0.5 && team1.length < 5;
      if (shouldAddToTeam1) {
        if (totalMmrTeam1 + player.mmr - totalMmrTeam2 <= maxMmrDiff) {
          team1.push(player);
          totalMmrTeam1 += player.mmr;
        } else {
          team2.push(player);
          totalMmrTeam2 += player.mmr;
        }
      } else {
        if (totalMmrTeam2 + player.mmr - totalMmrTeam1 <= maxMmrDiff) {
          team2.push(player);
          totalMmrTeam2 += player.mmr;
        } else {
          team1.push(player);
          totalMmrTeam1 += player.mmr;
        }
      }
    }
  }

  team1.sort((a, b) => b.mmr - a.mmr);
  team2.sort((a, b) => b.mmr - a.mmr);

  return [team1, team2];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Balances 10 players")
    .addUserOption((option) =>
      option.setName("player1").setDescription("Please mention player 1")
    )
    .addUserOption((option) =>
      option.setName("player2").setDescription("Please mention player 2")
    )
    .addUserOption((option) =>
      option.setName("player3").setDescription("Please mention player 3")
    )
    .addUserOption((option) =>
      option.setName("player4").setDescription("Please mention player 4")
    )
    .addUserOption((option) =>
      option.setName("player5").setDescription("Please mention player 5")
    )
    .addUserOption((option) =>
      option.setName("player6").setDescription("Please mention player 6")
    )
    .addUserOption((option) =>
      option.setName("player7").setDescription("Please mention player 7")
    )
    .addUserOption((option) =>
      option.setName("player8").setDescription("Please mention player 8")
    )
    .addUserOption((option) =>
      option.setName("player9").setDescription("Please mention player 9")
    )
    .addUserOption((option) =>
      option.setName("player10").setDescription("Please mention player 10")
    ),
  async execute(interaction, client) {
    const playersPath = path.join(__dirname, "../../data/players.json");
    const playersData = JSON.parse(fs.readFileSync(playersPath, "utf8"));

    const players = [];

    for (let i = 1; i <= 10; i++) {
      const playerOption = interaction.options.get(`player${i}`);
      console.log(playerOption);
      if (playerOption) {
        const playerUsername = playerOption.user.username;

        // Find the player in the playersData array based on the username
        const player = playersData.find(
          (playerData) => playerData.discordUsername === playerUsername
        );

        if (player) {
          players.push(player);
        }
      }
    }

    if (players.length !== 10) {
      return interaction.reply({
        content: "Please mention 10 registered players",
        ephemeral: true,
      });
    }

    await interaction.reply("Calculating team balance...");

    try {
      const balancedTeams = await balanceTeams(players);
      const totalMmrTeam1 = balancedTeams[0].reduce(
        (total, player) => total + player.mmr,
        0
      );
      const totalMmrTeam2 = balancedTeams[1].reduce(
        (total, player) => total + player.mmr,
        0
      );
      const team1Message = balancedTeams[0]
        .map((player) => `${player.user} (${player.rank})`)
        .join("\n");
      const team2Message = balancedTeams[1]
        .map((player) => `${player.user} (${player.rank})`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle("Teams")
        .setColor(client.color)
        .setTimestamp(Date.now())
        .addFields([
          {
            name: "Attack",
            value: `${team1Message}\n\nTotal MMR: ${totalMmrTeam1}`,
            inline: true,
          },
          {
            name: "Defence",
            value: `${team2Message}\n\nTotal MMR: ${totalMmrTeam2}`,
            inline: true,
          },
        ]);

      const currentGamePath = path.join(
        __dirname,
        "../../data/currentGame.json"
      );
      const teamsData = {
        team1: balancedTeams[0],
        team2: balancedTeams[1],
        mmrDiff: totalMmrTeam1 - totalMmrTeam2,
      };
      fs.writeFileSync(currentGamePath, JSON.stringify(teamsData, null, 2));

      await interaction.followUp({
        embeds: [embed],
      });
    } catch (error) {
      // Handle errors and send an error message
      console.error(error);
      await interaction.followUp(
        "An error occurred while calculating team balance."
      );
    }
  },
};
