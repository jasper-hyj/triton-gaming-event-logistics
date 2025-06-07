import "dotenv/config"; // Load .env variables
import { Client, GatewayIntentBits, Events, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";

const TOKEN = process.env.BOT_TOKEN;
const API_BASE = "https://triton-gaming-event-logistics.vercel.app/api/items";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "item") {
    const itemId = interaction.options.getString("itemid");

    await interaction.deferReply(); // Acknowledge the command and give more time

    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(itemId)}`);
      if (!res.ok) {
        await interaction.editReply(
          `Error fetching item: ${res.status} ${res.statusText}`,
        );
        return;
      }
      const json = await res.json();

      if (json.error) {
        await interaction.editReply(`API error: ${json.error}`);
        return;
      }

      const item = json.item;
      if (!item) {
        await interaction.editReply("Item not found.");
        return;
      }

      const formatArray = (arr) =>
        Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "_None_";

      const embed = new EmbedBuilder()
        .setColor(0x00b0f4)
        .setTitle(`🎮 Item: ${item.name || "Unnamed Item"}`)
        .setDescription(
          `📄 *${item.description || "No description provided."}*`,
        )
        .addFields(
          // ─────── Basic Info ───────
          { name: "🆔 ID", value: `\`${item.id}\``, inline: true },
          {
            name: "🔖 Type",
            value: item.type || "N/A",
            inline: true,
          },
          {
            name: "⚙️ Condition",
            value: item.condition || "Unknown",
            inline: true,
          },

          // ─────── Contents ───────
          { name: "\u200B", value: "**📦 Contents**", inline: false },
          {
            name: "🔌 Ports",
            value: formatArray(item.ports),
            inline: true,
          },
          {
            name: "🧩 Parts Included",
            value: formatArray(item.parts),
            inline: true,
          },
          {
            name: "❌ Missing Parts",
            value: formatArray(item.missings),
            inline: true,
          },

          // ─────── Software ───────
          {
            name: "\u200B",
            value: "**💻 Software / Access**",
            inline: false,
          },
          {
            name: "📂 Installations",
            value: formatArray(item.installations),
            inline: true,
          },
          {
            name: "🔐 Password",
            value: item.password || "_None_",
            inline: true,
          },

          // ─────── Metadata ───────
          { name: "\u200B", value: "**📝 Metadata**", inline: false },
          {
            name: "📦 Source",
            value: item.source || "_Unknown_",
            inline: true,
          },
          {
            name: "🏷️ Provider",
            value: item.provider || "_Unknown_",
            inline: true,
          },
          {
            name: "\u200B 🗒️ Note",
            value: item.note || "_None_",
            inline: false,
          },
        )
        .setFooter({
          text: `📅 Created at ${new Date(item.created_at).toLocaleString()}`,
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.editReply("Failed to fetch item data.");
    }
  }
});

client.login(TOKEN);
