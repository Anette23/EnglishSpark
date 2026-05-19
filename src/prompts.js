const TAGGED_WRITING_PROMPTS = [
  { text: "Describe what you did today in 3 sentences.", tags: ['tenses'] },
  { text: "What's one thing you're looking forward to this week?", tags: ['tenses'] },
  { text: "Write about your favourite meal and why you love it.", tags: ['articles', 'vocabulary'] },
  { text: "Describe your ideal weekend.", tags: ['articles'] },
  { text: "What skill do you most want to improve and why?", tags: ['vocabulary'] },
  { text: "Write about a place you'd love to visit.", tags: ['articles', 'prepositions'] },
  { text: "What makes you happy? List 5 things.", tags: ['vocabulary'] },
  { text: "Describe your morning routine.", tags: ['articles', 'prepositions'] },
  { text: "Write about a challenge you overcame recently.", tags: ['tenses'] },
  { text: "What's a hobby you enjoy? Explain it simply.", tags: ['vocabulary'] },
  { text: "If you could change one thing about your daily routine, what would it be?", tags: ['conditionals'] },
  { text: "Write about your favourite season and why.", tags: ['articles'] },
  { text: "Describe a person who inspires you.", tags: ['articles', 'vocabulary'] },
  { text: "What are your goals for this month?", tags: ['tenses'] },
  { text: "Write about a book, film, or show you enjoyed recently.", tags: ['tenses', 'articles'] },
  { text: "Describe your city or town to someone who's never been there.", tags: ['articles', 'prepositions'] },
  { text: "What's something new you learned this week?", tags: ['tenses'] },
  { text: "Write about your perfect day.", tags: ['articles'] },
  { text: "If you could have any superpower, what would it be?", tags: ['conditionals'] },
  { text: "Describe a memory from your childhood.", tags: ['tenses', 'prepositions'] },
  { text: "What are three things you're grateful for today?", tags: ['vocabulary'] },
  { text: "Write about your favourite way to relax.", tags: ['articles'] },
  { text: "If you won the lottery, what would you do first?", tags: ['conditionals', 'tenses'] },
  { text: "Describe your workspace or study space.", tags: ['articles', 'prepositions'] },
  { text: "What's your biggest dream?", tags: ['vocabulary'] },
  { text: "Write about an animal you find fascinating.", tags: ['articles', 'vocabulary'] },
  { text: "What tradition do you love in your family or culture?", tags: ['articles'] },
  { text: "Describe a time when you felt really proud of yourself.", tags: ['tenses'] },
  { text: "What's one habit you want to build and why?", tags: ['vocabulary'] },
  { text: "Write about something that made you smile today.", tags: ['tenses'] },
]

const TAGGED_SPEAKING_PROMPTS = [
  { text: "Talk about what you plan to do this weekend.", tags: ['tenses'] },
  { text: "Describe your favourite food and how it's made.", tags: ['articles', 'vocabulary'] },
  { text: "Talk about a film you watched recently — the plot and your opinion.", tags: ['tenses', 'articles'] },
  { text: "Describe your hometown to a foreigner.", tags: ['articles', 'prepositions'] },
  { text: "Talk about a person you admire and why.", tags: ['vocabulary'] },
  { text: "Introduce yourself as if meeting someone new.", tags: ['vocabulary'] },
  { text: "Talk about your job or studies — what do you do day to day?", tags: ['vocabulary', 'tenses'] },
  { text: "Describe your perfect holiday destination.", tags: ['articles', 'prepositions'] },
  { text: "Talk about a goal you have for this year.", tags: ['tenses'] },
  { text: "What did you do yesterday? Tell the story out loud.", tags: ['tenses'] },
  { text: "Talk about a skill you're learning. How's it going?", tags: ['tenses'] },
  { text: "Describe the last book or podcast you enjoyed.", tags: ['articles', 'tenses'] },
  { text: "Talk about your morning — from waking up until now.", tags: ['tenses', 'prepositions'] },
  { text: "What's your opinion on social media?", tags: ['vocabulary'] },
  { text: "Talk about a sport or activity you enjoy watching or doing.", tags: ['articles', 'vocabulary'] },
  { text: "Describe your family briefly.", tags: ['articles'] },
  { text: "What are you most proud of in your life so far?", tags: ['tenses'] },
  { text: "Talk about the last time you laughed really hard.", tags: ['tenses'] },
  { text: "Describe a challenge you're facing and how you plan to handle it.", tags: ['vocabulary', 'tenses'] },
  { text: "What does success mean to you? Explain out loud.", tags: ['vocabulary'] },
  { text: "Talk about your favourite music or artist.", tags: ['articles'] },
  { text: "Describe a typical Sunday for you.", tags: ['articles', 'prepositions'] },
  { text: "What would you tell your 10-year-old self?", tags: ['conditionals', 'tenses'] },
  { text: "Talk about something you wish you had learned earlier.", tags: ['tenses', 'vocabulary'] },
  { text: "Describe your style — how do you like to dress?", tags: ['vocabulary'] },
  { text: "Talk about the best advice you ever received.", tags: ['tenses'] },
  { text: "What's one thing you'd like to change in the world?", tags: ['conditionals'] },
  { text: "Describe a dish you can cook well.", tags: ['vocabulary', 'prepositions'] },
  { text: "Talk about your favourite time of day and why.", tags: ['articles'] },
  { text: "What's something people might not know about you?", tags: ['vocabulary'] },
]

export const WRITING_PROMPTS = TAGGED_WRITING_PROMPTS.map(p => p.text)
export const SPEAKING_PROMPTS = TAGGED_SPEAKING_PROMPTS.map(p => p.text)

export function getDailyPrompt(prompts) {
  const dayIndex = Math.floor(Date.now() / 86400000) % prompts.length
  return prompts[dayIndex]
}

const CATEGORY_TAG = {
  'Articles': 'articles',
  'Tenses': 'tenses',
  'Prepositions': 'prepositions',
  'Conditionals': 'conditionals',
  'Vocabulary': 'vocabulary',
}

export function getAdaptivePrompt(type, topWeakSpotCategory) {
  const dayIdx = Math.floor(Date.now() / 86400000)
  const tagged = type === 'writing' ? TAGGED_WRITING_PROMPTS : TAGGED_SPEAKING_PROMPTS

  const tag = CATEGORY_TAG[topWeakSpotCategory]
  if (tag && (dayIdx % 5) < 3) {
    const matching = tagged.filter(p => p.tags.includes(tag))
    if (matching.length > 0) {
      return { text: matching[dayIdx % matching.length].text, targetedAt: topWeakSpotCategory }
    }
  }

  return { text: tagged[dayIdx % tagged.length].text, targetedAt: null }
}
