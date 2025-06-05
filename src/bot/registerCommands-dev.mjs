// registerCommands.mjs
import 'dotenv/config'; // Load .env variables
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;    // Your bot application's client ID
const GUILD_ID = process.env.GUILD_ID;   // your server ID

const commands = [
  new SlashCommandBuilder()
    .setName('item')
    .setDescription('Fetch item info by ID')
    .addStringOption(option =>
      option.setName('itemid')
        .setDescription('ID of the item')
        .setRequired(true))
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function registerCommands() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );


    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

registerCommands();
