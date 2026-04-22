# 👑 KingFarhan MD

WhatsApp Multi-Device Bot with web pairing site.

---

## 🚀 Deploy to Render (Step by Step)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "KingFarhan MD initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kingfarhan-md.git
git push -u origin main
```

### Step 2 — Create Render Web Service
1. Go to https://render.com and sign in
2. Click **New → Web Service**
3. Connect your GitHub repo: `kingfarhan-md`
4. Fill in these settings:
   - **Name:** kingfarhan-md
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** Free

### Step 3 — Add Environment Variables
In Render → your service → **Environment**, add:

| Key | Value |
|-----|-------|
| `OWNER_NUMBER` | Your WhatsApp number e.g. `254712345678` |
| `PREFIX` | `.` |

### Step 4 — Deploy
Click **Create Web Service**. Render will build and deploy.
Your pairing site will be live at:
```
https://kingfarhan-md.onrender.com
```

### Step 5 — Pair WhatsApp
1. Open your Render URL
2. Enter your WhatsApp number
3. Click **Get Pairing Code**
4. Open WhatsApp → ⋮ → Linked Devices → Link a Device
5. Tap **"Link with phone number instead"**
6. Enter the 8-digit code shown

---

## 📋 Commands

| Command | Description |
|---------|-------------|
| `.menu` | All commands |
| `.ping` | Bot speed |
| `.uptime` | Uptime |
| `.info` | Bot info |
| `.calc` | Calculator |
| `.weather` | Weather |
| `.translate` | Translate |
| `.shorten` | Shorten URL |
| `.time` | Current time |
| `.joke` | Random joke |
| `.quote` | Quote |
| `.fact` | Fun fact |
| `.flip` | Coin flip |
| `.dice` | Roll dice |
| `.8ball` | Magic 8-ball |
| `.roast` | Roast someone |
| `.compliment` | Compliment |
| `.dare` | Truth or dare |
| `.pickup` | Pickup line |
| `.riddle` | Riddle |
| `.ai` | Ask AI |
| `.gpt` | GPT chat |
| `.kick` | Kick member |
| `.add` | Add member |
| `.promote` | Make admin |
| `.demote` | Remove admin |
| `.mute` | Mute group |
| `.unmute` | Unmute group |
| `.groupinfo` | Group info |
| `.tagall` | Tag all |
| `.hidetag` | Silent tag |
| `.link` | Invite link |
| `.resetlink` | Reset link |
| `.setname` | Set group name |
| `.setdesc` | Set group desc |
| `.broadcast` | Broadcast (owner) |
| `.block` | Block user (owner) |
| `.unblock` | Unblock (owner) |
| `.restart` | Restart (owner) |
| `.shutdown` | Shutdown (owner) |

---

👑 Made by KingFarhan
