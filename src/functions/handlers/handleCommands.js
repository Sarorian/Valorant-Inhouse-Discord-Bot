const { REST, Routes } = require("discord.js");
const fs = require("fs");

module.exports = (client) => {
  const { commands, commandArray } = client;
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(
          `Command: ${command.data.name} has been passed through the handler`
        );
      }
    }

    const clientId = "1110103864755093554";
    const guildId = "971111639174746132";
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });

      console.log("Sucesfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  };
};
