const BASE_URL = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
const MODEL = process.env.AI_MODEL || "gpt-4o-mini";
async function askAI(prompt) {
  if (!process.env.AI_API_KEY) return "Fitur AI belum dikonfigurasi. Owner perlu mengisi AI_API_KEY pada Environment Variables hosting.";
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.AI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages: [
      { role: "system", content: "You are DENZZSTUDIO AI, a helpful, respectful Discord assistant. Keep replies concise and safe." },
      { role: "user", content: prompt.slice(0, 4000) }
    ], temperature: 0.7, max_tokens: 700 }),
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Belum ada jawaban dari AI.";
}
module.exports = { askAI };
