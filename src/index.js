require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { askAI } = require("./ai");
const { isOnCooldown } = require("./store");
for (const key of ["DISCORD_TOKEN", "DISCORD_CLIENT_ID"]) {
  if (!process.env[key]) { console.error(`Missing required environment variable: ${key}`); process.exit(1); }
}
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const app = express();
app.get("/", (_req, res) => res.status(200).send("DENZZSTUDIO AI Discord Bot is running."));
app.get("/health", (_req, res) => res.json({ status: "ok", bot: client.isReady() ? "online" : "connecting" }));
app.listen(Number(process.env.PORT || 3000), "0.0.0.0", () => console.log("Health server started"));
const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Cek koneksi bot."),
  new SlashCommandBuilder().setName("help").setDescription("Lihat daftar perintah bot."),
  new SlashCommandBuilder().setName("ask").setDescription("Tanya DENZZSTUDIO AI.")
    .addStringOption(o => o.setName("prompt").setDescription("Pertanyaan kamu").setRequired(true).setMaxLength(4000)),
  new SlashCommandBuilder().setName("serverinfo").setDescription("Lihat informasi server Discord.")
].map(c => c.toJSON());
async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  const route = process.env.DISCORD_GUILD_ID
    ? Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID)
    : Routes.applicationCommands(process.env.DISCORD_CLIENT_ID);
  await rest.put(route, { body: commands });
  console.log("Slash commands registered.");
}
client.once("ready", () => console.log(`Logged in as ${client.user.tag}`));
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  try {
    if (interaction.commandName === "ping") return interaction.reply({ content: `Pong! ${client.ws.ping}ms`, ephemeral: true });
    if (interaction.commandName === "help") {
      const embed = new EmbedBuilder().setColor(0xD4AF37).setTitle("DENZZSTUDIO AI PRO")
        .setDescription("AI assistant untuk komunitas Discord.")
        .addFields({ name: "/ask", value: "Ajukan pertanyaan ke AI." }, { name: "/ping", value: "Cek latensi bot." }, { name: "/serverinfo", value: "Informasi server." })
        .setFooter({ text: "DENZZSTUDIO • AI All-in-One" });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (interaction.commandName === "serverinfo") {
      if (!interaction.guild) return interaction.reply({ content: "Perintah ini hanya tersedia di server.", ephemeral: true });
      const g = interaction.guild;
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xD4AF37).setTitle(g.name)
        .addFields({ name: "Member", value: String(g.memberCount), inline: true }, { name: "Server ID", value: g.id, inline: true })], ephemeral: true });
    }
    if (interaction.commandName === "ask") {
      const wait = isOnCooldown(interaction.user.id);
      if (wait) return interaction.reply({ content: `Tunggu ${wait} detik sebelum bertanya lagi.`, ephemeral: true });
      await interaction.deferReply();
      const answer = await askAI(interaction.options.getString("prompt", true));
      return interaction.editReply(answer.slice(0, 1900));
    }
  } catch (error) {
    console.error("Interaction error:", error);
    const message = "Terjadi kendala saat memproses perintah. Coba lagi nanti.";
    if (interaction.deferred || interaction.replied) await interaction.followUp({ content: message, ephemeral: true }).catch(() => {});
    else await interaction.reply({ content: message, ephemeral: true }).catch(() => {});
  }
});
(async () => {
  try { await registerCommands(); await client.login(process.env.DISCORD_TOKEN); }
  catch (error) { console.error("Startup failed:", error); process.exit(1); }
})();
