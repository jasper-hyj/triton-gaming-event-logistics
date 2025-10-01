import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID; // your bot's application ID

const commands = [
  {
    name: 'qrcode',
    description: 'Generate a styled QR code',
    options: [
      {
        name: 'url',
        description: 'The URL or text for the QR code',
        type: 3, // STRING
        required: true,
      },
      {
        name: 'bgcolor',
        description: 'Background color (default: #ffffff)',
        type: 3,
        required: false,
      },
      {
        name: 'size',
        description: 'Size of the QR code in pixels',
        type: 4, // INTEGER
        required: false,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
