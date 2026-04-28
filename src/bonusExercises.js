export const SYNONYM_WORDS = [
  { word: 'happy',     synonyms: ['glad', 'joyful', 'cheerful', 'content', 'pleased', 'delighted', 'elated'] },
  { word: 'sad',       synonyms: ['unhappy', 'upset', 'gloomy', 'miserable', 'sorrowful', 'melancholy', 'down'] },
  { word: 'big',       synonyms: ['large', 'huge', 'enormous', 'vast', 'massive', 'great', 'immense'] },
  { word: 'fast',      synonyms: ['quick', 'rapid', 'swift', 'speedy', 'hasty', 'brisk'] },
  { word: 'beautiful', synonyms: ['pretty', 'gorgeous', 'lovely', 'stunning', 'attractive', 'elegant'] },
  { word: 'smart',     synonyms: ['intelligent', 'clever', 'bright', 'brilliant', 'wise', 'sharp'] },
  { word: 'angry',     synonyms: ['furious', 'mad', 'irritated', 'annoyed', 'enraged', 'cross'] },
  { word: 'tired',     synonyms: ['exhausted', 'weary', 'fatigued', 'sleepy', 'drained', 'worn out'] },
  { word: 'good',      synonyms: ['great', 'excellent', 'wonderful', 'fantastic', 'superb', 'fine'] },
  { word: 'small',     synonyms: ['tiny', 'little', 'miniature', 'petite', 'compact', 'slight'] },
  { word: 'hard',      synonyms: ['difficult', 'tough', 'challenging', 'demanding', 'arduous', 'tricky'] },
  { word: 'easy',      synonyms: ['simple', 'straightforward', 'effortless', 'basic', 'uncomplicated'] },
  { word: 'walk',      synonyms: ['stroll', 'march', 'stride', 'wander', 'amble', 'trek', 'pace'] },
  { word: 'talk',      synonyms: ['speak', 'chat', 'converse', 'discuss', 'communicate', 'say'] },
  { word: 'look',      synonyms: ['glance', 'stare', 'gaze', 'peek', 'observe', 'watch'] },
  { word: 'think',     synonyms: ['consider', 'believe', 'reflect', 'ponder', 'suppose', 'reckon'] },
  { word: 'start',     synonyms: ['begin', 'launch', 'initiate', 'commence', 'open', 'kick off'] },
  { word: 'stop',      synonyms: ['halt', 'end', 'cease', 'quit', 'finish', 'pause', 'terminate'] },
  { word: 'help',      synonyms: ['assist', 'support', 'aid', 'guide', 'back', 'contribute'] },
  { word: 'want',      synonyms: ['desire', 'wish', 'crave', 'need', 'hope for', 'long for'] },
]

export const PREPOSITION_PHRASES = [
  { phrase: "I'm looking ___ to seeing you.",              answer: ['forward'], hint: 'look forward to = tešiť sa na niečo' },
  { phrase: "She's interested ___ learning English.",      answer: ['in'],      hint: 'interested in = zaujímať sa o' },
  { phrase: "He takes care ___ his younger brother.",      answer: ['of'],      hint: 'take care of = starať sa o' },
  { phrase: "They're really good ___ solving problems.",   answer: ['at'],      hint: 'good at = byť dobrý v niečom' },
  { phrase: "I'm thinking ___ changing jobs.",             answer: ['about', 'of'], hint: 'thinking about/of = uvažovať o' },
  { phrase: "She's afraid ___ spiders.",                   answer: ['of'],      hint: 'afraid of = báť sa niečoho' },
  { phrase: "He's responsible ___ the whole project.",     answer: ['for'],     hint: 'responsible for = zodpovedný za' },
  { phrase: "I'm really proud ___ you.",                   answer: ['of'],      hint: 'proud of = hrdý na' },
  { phrase: "She's excited ___ the trip.",                 answer: ['about'],   hint: 'excited about = tešiť sa na' },
  { phrase: "He's worried ___ his exams.",                 answer: ['about'],   hint: 'worried about = mať starosti o' },
  { phrase: "I agree ___ you on this.",                    answer: ['with'],    hint: 'agree with = súhlasiť s niekým' },
  { phrase: "She apologized ___ being late.",              answer: ['for'],     hint: 'apologize for = ospravedlniť sa za' },
  { phrase: "I'm looking ___ a new job.",                  answer: ['for'],     hint: 'look for = hľadať' },
  { phrase: "He insisted ___ paying the bill.",            answer: ['on'],      hint: 'insist on = trvať na niečom' },
  { phrase: "She depends ___ her friends for support.",    answer: ['on'],      hint: 'depend on = spoliehať sa na' },
  { phrase: "I'm very fond ___ Italian food.",             answer: ['of'],      hint: 'fond of = mať rád niečo' },
  { phrase: "He's passionate ___ music.",                  answer: ['about'],   hint: 'passionate about = nadšený z niečoho' },
  { phrase: "She's married ___ a doctor.",                 answer: ['to'],      hint: 'married to = vydatá/ženatý za' },
  { phrase: "I'm fed up ___ waiting.",                     answer: ['with'],    hint: 'fed up with = mať dosť niečoho' },
  { phrase: "He's in charge ___ the whole team.",          answer: ['of'],      hint: 'in charge of = viesť, zodpovedať za' },
]

export const SHADOWING_SENTENCES = [
  "I've been really looking forward to this.",
  "Could you please speak a bit more slowly?",
  "I'm not sure what you mean by that.",
  "She asked me if I had finished the report.",
  "We should take advantage of this opportunity.",
  "It's been a while since we last spoke.",
  "I'd really appreciate your help with this.",
  "Let me think about it and get back to you.",
  "I was wondering if you could do me a favour.",
  "That's a really interesting point, actually.",
  "I completely forgot about the meeting today.",
  "Would you mind if I opened the window?",
  "I've never been to London, but I'd love to go.",
  "She told me she was planning to move abroad.",
  "He said he'd been working on it all week.",
  "I'm really sorry, I didn't mean to upset you.",
  "Do you think we could find a compromise?",
  "I've just started learning to play the guitar.",
  "It's getting late — we should probably head home.",
  "By the time I arrived, the film had already started.",
]

function dailyStart(arr) {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''))
  return seed % arr.length
}

export function getDailySynonymWord()    { return SYNONYM_WORDS[dailyStart(SYNONYM_WORDS)] }
export function getDailyPhrase()         { return PREPOSITION_PHRASES[dailyStart(PREPOSITION_PHRASES)] }
export function getDailyShadowSentence() { return SHADOWING_SENTENCES[dailyStart(SHADOWING_SENTENCES)] }
