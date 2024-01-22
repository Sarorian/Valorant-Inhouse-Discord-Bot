const fs = require("fs");
const path = require("path");

module.exports = {
  data: {
    name: "team1",
  },
  async execute(interaction, client) {
    const playersPath = path.join(__dirname, "../../data/players.json");
    const playersData = JSON.parse(fs.readFileSync(playersPath, "utf8"));

    const currentGamePath = path.join(__dirname, "../../data/currentGame.json");
    const currentGameData = JSON.parse(
      fs.readFileSync(currentGamePath, "utf8")
    );

    const admin = "1174163922048266250";
    const hasRequiredRole = interaction.member.roles.cache.has(admin);
    // Calculate the sp value based on the specified formula (integer division)
    const spModifier = 25 + Math.floor(currentGameData.mmrDiff / 50);

    // Iterate through players in team1 and update "w" and "sp" properties in players.json

    if (!hasRequiredRole) {
      return interaction.reply({
        content: "You don't have the required role to use this command.",
        ephemeral: true,
      });
    }
    currentGameData.team1.forEach((player) => {
      const matchingPlayer = playersData.find((p) => p.puuid === player.puuid);
      if (matchingPlayer) {
        matchingPlayer.score.w += 1;
        matchingPlayer.score.sp += spModifier;
      }
    });
    currentGameData.team2.forEach((player) => {
      const matchingPlayer = playersData.find((p) => p.puuid === player.puuid);
      if (matchingPlayer) {
        matchingPlayer.score.l += 1;
        matchingPlayer.score.sp -= spModifier;
      }
    });

    // Save the updated players.json file
    fs.writeFileSync(playersPath, JSON.stringify(playersData, null, 2), "utf8");

    // Now you can use the updated playersData and currentGameData as needed
    await interaction.reply({
      content: "Game Updated",
    });
  },
};
