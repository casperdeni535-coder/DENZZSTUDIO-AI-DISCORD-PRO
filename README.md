# DENZZSTUDIO AI DISCORD PRO

Discord bot AI All-in-One dengan slash commands dan health-check endpoint.

## Fitur versi pertama
- `/ask` — bertanya kepada AI melalui API kompatibel OpenAI Chat Completions.
- `/ping` — cek latensi bot.
- `/help` — daftar perintah.
- `/serverinfo` — informasi server.
- `/health` — endpoint pemeriksaan hosting.

## Menjalankan
1. Gunakan Node.js 20 atau lebih baru.
2. Jalankan `npm install`.
3. Salin `.env.example` menjadi `.env`.
4. Isi `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, dan `AI_API_KEY` di environment.
5. Undang bot menggunakan scope `bot` dan `applications.commands`.
6. Jalankan `npm start`.

Untuk command instan pada satu server, isi `DISCORD_GUILD_ID`. Kosongkan untuk command global; propagasinya dapat memerlukan waktu.

## Keamanan
Jangan commit file `.env` atau membagikan Discord token/API key. Simpan rahasia di Environment Variables/Secrets hosting.

## Hosting
Gunakan layanan yang mendukung proses Node.js persisten atau Docker. Paket gratis dapat memiliki batas pemakaian, tidur otomatis, atau restart; tidak menjamin online 24/7.

Fitur lanjutan seperti moderasi, musik, dashboard, dan database akan ditambahkan bertahap.
