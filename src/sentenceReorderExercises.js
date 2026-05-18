// Sentence reordering exercises — B1/B2 level
// Each sentence is split into tokens; the user arranges them in correct order.

export const REORDER_EXERCISES = [
  // B1
  { id: 'ro-1',  level: 'B1', tokens: ['She', 'has', 'been', 'learning', 'English', 'for', 'five', 'years'], hint: 'Present perfect continuous' },
  { id: 'ro-2',  level: 'B1', tokens: ['By', 'the', 'time', 'I', 'arrived,', 'the', 'film', 'had', 'already', 'started'], hint: 'Past perfect + by the time' },
  { id: 'ro-3',  level: 'B1', tokens: ['If', 'it', 'rains', 'tomorrow,', 'we', 'will', 'stay', 'at', 'home'], hint: 'First conditional' },
  { id: 'ro-4',  level: 'B1', tokens: ['He', 'was', 'cooking', 'dinner', 'when', 'the', 'phone', 'rang'], hint: 'Past continuous + simple' },
  { id: 'ro-5',  level: 'B1', tokens: ["I", "haven't", 'seen', 'that', 'film', 'yet,', 'but', 'I', 'want', 'to'], hint: 'Present perfect with yet' },
  { id: 'ro-6',  level: 'B1', tokens: ['She', 'told', 'me', 'that', 'she', 'would', 'call', 'me', 'the', 'next', 'day'], hint: 'Reported speech' },
  { id: 'ro-7',  level: 'B1', tokens: ['The', 'book', 'was', 'written', 'by', 'a', 'famous', 'author'], hint: 'Passive voice' },
  { id: 'ro-8',  level: 'B1', tokens: ['You', 'should', 'see', 'a', 'doctor', 'about', 'that', 'cough'], hint: 'Modal verb: advice' },
  { id: 'ro-9',  level: 'B1', tokens: ['They', 'have', 'been', 'friends', 'since', 'they', 'were', 'children'], hint: 'Present perfect since' },
  { id: 'ro-10', level: 'B1', tokens: ["I", 'wish', 'I', 'could', 'speak', 'Spanish', 'as', 'well', 'as', 'you'], hint: 'Wish + could' },
  { id: 'ro-11', level: 'B1', tokens: ['How', 'long', 'have', 'you', 'been', 'waiting', 'here?'], hint: 'Present perfect continuous question' },
  { id: 'ro-12', level: 'B1', tokens: ['Could', 'you', 'tell', 'me', 'where', 'the', 'nearest', 'bank', 'is?'], hint: 'Indirect question — statement word order' },
  { id: 'ro-13', level: 'B1', tokens: ['She', "didn't", 'use', 'to', 'enjoy', 'reading,', 'but', 'now', 'she', 'loves', 'it'], hint: 'Used to — past habit' },
  { id: 'ro-14', level: 'B1', tokens: ['There', 'is', 'no', 'point', 'in', 'worrying', 'about', 'things', 'you', "can't", 'change'], hint: 'There is no point in + -ing' },
  { id: 'ro-15', level: 'B1', tokens: ["I'm", 'looking', 'forward', 'to', 'seeing', 'you', 'at', 'the', 'weekend'], hint: 'Look forward to + -ing' },

  // B2
  { id: 'ro-16', level: 'B2', tokens: ['Had', 'I', 'known', 'about', 'the', 'problem,', 'I', 'would', 'have', 'helped'], hint: 'Third conditional — inverted form' },
  { id: 'ro-17', level: 'B2', tokens: ['Not', 'only', 'did', 'she', 'win', 'the', 'race,', 'but', 'she', 'also', 'broke', 'the', 'record'], hint: 'Not only … but also — inversion' },
  { id: 'ro-18', level: 'B2', tokens: ['Despite', 'the', 'rain,', 'they', 'decided', 'to', 'go', 'for', 'a', 'walk'], hint: 'Despite + noun phrase' },
  { id: 'ro-19', level: 'B2', tokens: ['The', 'more', 'you', 'practise,', 'the', 'more', 'confident', 'you', 'will', 'become'], hint: 'The more … the more …' },
  { id: 'ro-20', level: 'B2', tokens: ['Having', 'finished', 'the', 'report,', 'she', 'sent', 'it', 'to', 'her', 'manager'], hint: 'Participle clause — having + past participle' },
  { id: 'ro-21', level: 'B2', tokens: ['It', 'is', 'essential', 'that', 'everyone', 'arrive', 'on', 'time'], hint: 'It is essential that + subjunctive' },
  { id: 'ro-22', level: 'B2', tokens: ['She', 'is', 'said', 'to', 'have', 'worked', 'in', 'three', 'different', 'countries'], hint: 'Passive reporting structure' },
  { id: 'ro-23', level: 'B2', tokens: ['The', 'project', 'will', 'have', 'been', 'completed', 'by', 'the', 'end', 'of', 'the', 'month'], hint: 'Future perfect passive' },
  { id: 'ro-24', level: 'B2', tokens: ['No', 'sooner', 'had', 'he', 'arrived', 'than', 'the', 'problems', 'started'], hint: 'No sooner … than — inversion' },
  { id: 'ro-25', level: 'B2', tokens: ['Were', 'I', 'in', 'your', 'position,', 'I', 'would', 'think', 'very', 'carefully'], hint: 'Second conditional — inverted form' },
  { id: 'ro-26', level: 'B2', tokens: ['The', 'suspect', 'was', 'being', 'questioned', 'by', 'police', 'for', 'several', 'hours'], hint: 'Past continuous passive' },
  { id: 'ro-27', level: 'B2', tokens: ['It', "wasn't", 'until', 'she', 'left', 'that', 'he', 'realised', 'how', 'much', 'she', 'meant'], hint: 'It wasn\'t until … that …' },
  { id: 'ro-28', level: 'B2', tokens: ['The', 'longer', 'you', 'wait,', 'the', 'harder', 'it', 'will', 'be', 'to', 'change'], hint: 'The longer … the harder …' },
  { id: 'ro-29', level: 'B2', tokens: ['Rarely', 'have', 'I', 'seen', 'such', 'dedication', 'in', 'a', 'student'], hint: 'Rarely + inversion' },
  { id: 'ro-30', level: 'B2', tokens: ['She', 'must', 'have', 'left', 'early', '—', 'her', 'coat', 'is', 'gone'], hint: 'Must have + past participle — deduction' },
]
