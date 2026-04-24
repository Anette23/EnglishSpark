# ⚡ EnglishSpark

A habit-forming app for daily English practice, built on the **2-minute rule** from James Clear's *Atomic Habits*.

🌐 **Live app:** [myenglishspark.vercel.app](https://myenglishspark.vercel.app)

---

## The idea

The hardest part of building a habit isn't doing it — it's starting. EnglishSpark removes the friction by asking for just **2 minutes a day**: one for writing, one for speaking. That's it. Small enough to always say yes to, consistent enough to actually work.

Inspired by James Clear's *Atomic Habits* and the principle that a 1% improvement every day leads to remarkable results over time.

---

## What it does

- ✍️ **Daily writing** — a fresh prompt every day, a countdown timer, a text area to write freely
- 🎤 **Daily speaking** — speak out loud to the prompt, no recording needed
- 📝 **AI feedback** — after each session, get corrections and suggestions from Claude (optional, requires Anthropic API key)
- 🔥 **Streak tracking** — see your daily streak and longest streak
- ⭐ **XP & levels** — earn experience points, level up over time
- 🏆 **Milestones** — unlock achievements at 3, 7, 14, 21, 30, 60, 100 and 365 days
- ⏱️ **Progressive difficulty** — session length grows automatically as you build the habit (2:00 → 2:30 → 3:00 → 3:30 → 4:00)

---

## Tech stack

- **React** + **Vite** — frontend
- **localStorage** — all data stored locally in the browser, no backend, no account needed
- **Anthropic API** (Claude Haiku) — optional AI feedback on your English
- **Vercel** — hosting

---

## AI feedback setup

Feedback is optional. To enable it:

1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. Open the app → tap ⚙️ in the top right
3. Paste your key and save

Your key is stored only in your browser and never shared.

---

## Run locally

```bash
git clone https://github.com/Anette23/EnglishSpark.git
cd EnglishSpark
npm install
npm run dev
```

---

*Inspired by [Atomic Habits](https://jamesclear.com/atomic-habits) by James Clear.*
