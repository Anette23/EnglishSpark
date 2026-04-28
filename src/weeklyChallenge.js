export const WEEKLY_CHALLENGES = [
  {
    title: 'Perfect Weekend',
    prompt: 'Describe your perfect weekend in detail. Where would you go, who would you be with, and what would you do? Use at least 3 different tenses.',
    type: 'writing',
  },
  {
    title: 'Hometown Hero',
    prompt: 'Describe your hometown or city to someone who has never been there. What makes it special? What would you recommend they visit?',
    type: 'writing',
  },
  {
    title: 'Lost Phone Story',
    prompt: 'Write a short story (5–8 sentences) about someone who loses their phone on a busy day. What happens? How does it end?',
    type: 'writing',
  },
  {
    title: 'Social Media Opinion',
    prompt: 'Do you think social media has made people more connected or more isolated? Write your opinion and give at least two reasons.',
    type: 'writing',
  },
  {
    title: 'Dream Job',
    prompt: 'If money were no object, what would your dream job be? Describe a typical day in that job and explain why you would love it.',
    type: 'writing',
  },
  {
    title: 'Friendly Email',
    prompt: 'Write an email to a friend you haven\'t spoken to in 6 months. Tell them what\'s new in your life and ask about theirs. Aim for 80–120 words.',
    type: 'writing',
  },
  {
    title: 'Unexpected Adventure',
    prompt: 'Write a story that starts with: "I never expected that day to change everything, but when I opened the door, I saw..." Continue the story for at least 6 sentences.',
    type: 'writing',
  },
  {
    title: 'Future Tech',
    prompt: 'Imagine the world in 2050. What will everyday life look like? Think about transport, work, homes, and free time. Write your vision.',
    type: 'writing',
  },
  {
    title: 'Best Advice',
    prompt: 'What is the best piece of advice you have ever received? Who gave it to you, and how has it influenced your life?',
    type: 'writing',
  },
  {
    title: 'Debate: City vs. Village',
    prompt: 'Is it better to live in a city or in the countryside? Write arguments for BOTH sides, then give your own opinion.',
    type: 'writing',
  },
  {
    title: 'Speak Your Mind',
    prompt: 'Talk for at least 60 seconds about something you feel strongly about — a hobby, a belief, a cause. Try to use linking words: firstly, furthermore, on the other hand, in conclusion.',
    type: 'speaking',
  },
  {
    title: 'Favourite Film',
    prompt: 'Describe your favourite film or TV show to a friend who hasn\'t seen it. Explain the plot briefly, say who stars in it, and tell them why they should watch it. Speak naturally for at least 60 seconds.',
    type: 'speaking',
  },
  {
    title: 'Travel Talk',
    prompt: 'Describe a place you have visited (or would love to visit). Talk about what it looks like, what you can do there, and why it\'s memorable. Aim for at least 60 seconds.',
    type: 'speaking',
  },
  {
    title: 'Problem Solver',
    prompt: 'Think of a problem in your daily life (e.g. too much screen time, not enough sleep). Speak about the problem, its causes, and at least two possible solutions. Speak for at least 60 seconds.',
    type: 'speaking',
  },
  {
    title: 'Compliment Letter',
    prompt: 'Write a short letter (80–100 words) to someone who has had a positive impact on your life — a teacher, friend, family member. Be specific about what they did and how it affected you.',
    type: 'writing',
  },
  {
    title: 'News Story',
    prompt: 'Write a short news article (80–120 words) about an imaginary (but realistic) event in your town. Include: what happened, where, when, who was involved, and why it matters.',
    type: 'writing',
  },
  {
    title: 'Morning Routine',
    prompt: 'Describe your ideal morning routine in detail — from waking up to leaving the house. Use time expressions like: first, then, after that, finally. Try to make it sound enjoyable!',
    type: 'writing',
  },
  {
    title: 'Agree or Disagree',
    prompt: '"People learn more from failure than from success." Do you agree or disagree? Write your opinion with at least two examples from real life or your own experience.',
    type: 'writing',
  },
  {
    title: 'Monologue: A Difficult Decision',
    prompt: 'Talk about a difficult decision you have faced (or imagine one). What were the options? What did you decide? Would you decide the same way now? Speak for at least 60 seconds.',
    type: 'speaking',
  },
  {
    title: 'Product Review',
    prompt: 'Write a review (80–100 words) of something you use every day — an app, a coffee maker, a bag. Give it a star rating, describe what you like and dislike, and say who you would recommend it to.',
    type: 'writing',
  },
]

export function getCurrentWeekNumber() {
  const d = new Date()
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  return Math.floor((d - startOfYear) / 86400000 / 7)
}

export function getCurrentChallenge() {
  const week = getCurrentWeekNumber()
  return { ...WEEKLY_CHALLENGES[week % WEEKLY_CHALLENGES.length], week }
}

export function isWeeklyChallengeComplete(state) {
  const week = getCurrentWeekNumber()
  return (state.weeklyDone || []).includes(week)
}
