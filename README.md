# 🤖 SGuard Bot

---

<p align="center">
  <b>Global Project Name:</b> <code>SGuard</code> <br>
  <b>This Project Name:</b> <code>SGuard Bot</code> <br>
  <b>Global Description:</b> <i>SGuard is a security Discord bot built with TypeScript. This prototype aims to be a free and improved alternative to the former D-Safe bot.</i> <br>
  <b>Specific Description:</b> <i>SGuard Bot is the component that interacts directly with Discord servers, providing advanced moderation commands, anti-raid protection, and secure connection to the API and database.</i>
</p>

<p align="center">
  <b>Stack:</b> <code>TypeScript</code> · <code>MongoDB</code> · <code>discordx</code> · <code>discord.js</code> <br>
  <b>Hosts:</b> <code>Vercel</code> · <code>Railway</code> <br>
  <b>Paths:</b> <code>sguard-bot</code> · <code>sguard-api</code> · <code>sguard-frontend</code>
</p>

---

## 🌍 Global Features

- 🤖 Discord Bot
- 🔗 API Integration
- 🖥️ Frontend Dashboard
- 🗄️ Database Integration
- ☁️ Cloud Deployment

## 🎯 Bot Features

- 🛡️ Advanced moderation commands (ban, kick, mute, warn, etc.)
- 🚨 Anti-raid and anti-spam system
- 📊 Real-time logs and analytics
- ⚙️ Per-server custom configuration (prefix, log channels, roles, etc.)
- 🔒 Secure communication with API and MongoDB
- 🖼️ Interactive panel in the web dashboard
- 🚀 Automated deployment on Railway

---

> **SGuard Bot** is the core of security and moderation for your Discord server, integrating with the API and dashboard for a complete and customizable experience.

---

## 🏗️ Architecture

**Model:** Modular, event- and command-oriented with discordx.

---

## 📌 Key Information

- **🔗 API Endpoint:** Secure connection to `https://sguard-api.up.railway.app`
- **🔒 Authentication:** OAuth2 with Discord for admin/configuration commands.
- **🗃️ Database:** MongoDB Atlas for data and configuration persistence.
- **⚡ Commands:** Slash commands and custom prefix.
- **🧩 Structure:** Separation of commands, events, utilities, and services.

---

## ✨ Main Features

- **🛠️ Moderation:** Commands to manage users and roles, with configurable security levels.
- **🚨 Protection:** Detection and blocking of raids, spam, and malicious behavior.
- **📊 Logs:** Action and event logging in configurable channels.
- **🔗 Integration:** Direct communication with the API to sync configurations and logs.
- **🖼️ Dashboard:** Web panel to manage the bot and view statistics.

---

## 🚀 Main Commands

### 🛡️ Moderation
- `/ban`, `/kick`, `/mute`, `/warn`, `/unmute`, `/clear`
- Server-customizable commands

### ⚙️ Configuration
- `/config prefix` — Change the bot prefix
- `/config logs` — Set the log channel
- `/config moderation` — Adjust moderation level

### 📊 Information
- `/stats` — Show server and bot statistics
- `/ping` — Latency test

---

## ⚠️ Error Handling

> Errors and responses follow the format:
```json
{ "error": "Action not allowed", "code": 403 }
```
**Common codes:** `400`, `401`, `403`, `404`, `500`  
All errors are logged and notified in the configured log channel.

---

## 🛠️ Development & Deployment

- **Development:** TypeScript + discordx, modularization of commands and events.
- **Deployment:** Railway, with environment variables for tokens and keys.
- **Integration:** Connection to MongoDB Atlas and the RESTful API.
- **Documentation:** Commands and events documented in the dashboard and repository.

---

> **SGuard Bot** is the perfect complement for advanced security and management of your Discord community.  
> Contribute, customize, and take your server to the next level!