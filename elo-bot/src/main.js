import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

const TOKEN = 'YOUR_DISCORD_BOT_TOKEN';
const GOOGLE_API_URL = '';

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('/lookup')) {
    const args = message.content.split(' ');
    const deviceId = args[1];
    const url = `${GOOGLE_API_URL}?id=${deviceId}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      message.reply(`❌ Device ${deviceId} not found.`);
    } else {
      message.reply(`📦 **${data.Name}** (ID: ${data.ID})\nStatus: ${data.Condition}\nAvailable: ${data.Available}\n[Setup Guide](${data['Guide Link']})`);
    }
  }
});

client.login(TOKEN);
