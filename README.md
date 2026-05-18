# ⚡ EnglishSpark

A habit-forming app for daily English practice, built on the **2-minute rule** from James Clear's *Atomic Habits*.

🌐 **Live app:** [myenglishspark.vercel.app](https://myenglishspark.vercel.app/)

---

## The idea

The hardest part of building a habit isn't doing it — it's starting. EnglishSpark removes the friction by asking for just **2 minutes a day**: one for writing, one for speaking. That's it. Small enough to always say yes to, consistent enough to actually work.

Inspired by James Clear's *Atomic Habits* and the principle that a 1% improvement every day leads to remarkable results over time.

---

## What it does

### Daily practice
- ✍️ **Daily writing** — a fresh prompt every day, a countdown timer, a text area to write freely
- 🎤 **Daily speaking** — speak out loud to the prompt, with optional voice recording
- 📝 **AI feedback** — after each session, get corrections and suggestions from Claude
- 💬 **Chat in English** — free conversation with an AI partner; get grammar feedback at any time

### Progress & motivation
- 🔥 **Streak tracking** — daily streak with freeze option (1 per week) to protect your streak
- ⭐ **XP & levels** — earn XP for every session and bonus exercise, level up over time
- 🏆 **Milestones** — unlock achievements at 3, 7, 14, 21, 30, 60, 100 and 365 days
- ⏱️ **Progressive difficulty** — session length grows automatically as you build the habit (2:00 → 4:00)
- 🏅 **Weekly challenge** — a themed writing/speaking challenge that resets every week (+50 XP)

### Extra practice (optional, not required for streak)
- 🔤 **Synonyms** — recall and recognise synonyms, then write a sentence using one (AI checks it)
- 📝 **Prepositions** — fill-in-the-blank exercises, then use the phrase in your own sentence
- 💬 **Idioms** — fill-in-the-blank with common English idioms, then practise using them
- 📚 **Grammar** — 114 exercises across 10 categories (articles, tenses, conditionals, passive voice and more), then write a sentence with the target structure
- 🎧 **Shadowing** — listen to a sentence, repeat it out loud, get word-level pronunciation feedback; tap any missed word to hear it again
- 🔀 **Mixed Practice** — one exercise from every section in a single session, with sentence practice for each

### Spaced repetition
Every bonus exercise feeds a per-item spaced repetition system. Weak items come back sooner; mastered items fade out. Each section has a **daily goal of 5** and awards +20 XP on completion. A **Review** button appears whenever cards are due.

### Connected learning
Sentences you write in exercises are saved. When you open **Chat in English**, the AI is told which phrases you've been practising and naturally steers the conversation so you get a chance to use them for real.

---

## Tech stack

- **React** + **Vite** — frontend SPA
- **localStorage** — all progress stored locally; no account, no backend
- **Anthropic API** (Claude Haiku) — AI feedback, sentence checking, chat
- **Web Speech API** — voice recording and text-to-speech (browser-native)
- **Vercel** — hosting + serverless API routes

---

## AI features setup

AI features (feedback, sentence checking, chat) are optional. To enable them:

1. Get an API key at [console.anthropic.com](https://console.anthropic.com)
2. Open the app → tap ⚙️ in the top right
3. Paste your key and save

Your key is stored only in your browser and never sent anywhere except directly to Anthropic.

---

## Run locally

```bash
git clone https://github.com/Anette23/EnglishSpark.git
cd EnglishSpark
npm install
npm run dev
```

Create a `.env.local` file for AI features:

```
VITE_FEEDBACK_SECRET=your_secret
ANTHROPIC_API_KEY=your_anthropic_key
FEEDBACK_SECRET=your_secret
```

---

*Inspired by [Atomic Habits](https://jamesclear.com/atomic-habits) by James Clear.*
