// level: 'A2' | 'B1' | 'B2'

export const SYNONYM_WORDS = [
  // A2
  { word: 'happy',     level: 'A2', synonyms: ['glad', 'joyful', 'cheerful', 'pleased', 'delighted', 'content'] },
  { word: 'sad',       level: 'A2', synonyms: ['unhappy', 'upset', 'gloomy', 'down', 'miserable', 'sorrowful'] },
  { word: 'big',       level: 'A2', synonyms: ['large', 'huge', 'enormous', 'great', 'vast', 'massive'] },
  { word: 'small',     level: 'A2', synonyms: ['tiny', 'little', 'miniature', 'petite', 'slight', 'compact'] },
  { word: 'fast',      level: 'A2', synonyms: ['quick', 'rapid', 'swift', 'speedy', 'hasty', 'brisk'] },
  { word: 'good',      level: 'A2', synonyms: ['great', 'excellent', 'wonderful', 'fantastic', 'superb', 'fine'] },
  { word: 'bad',       level: 'A2', synonyms: ['terrible', 'awful', 'poor', 'dreadful', 'horrible', 'unpleasant'] },
  { word: 'nice',      level: 'A2', synonyms: ['lovely', 'pleasant', 'kind', 'friendly', 'wonderful', 'enjoyable'] },
  { word: 'funny',     level: 'A2', synonyms: ['amusing', 'hilarious', 'entertaining', 'comical', 'humorous', 'witty'] },
  { word: 'scared',    level: 'A2', synonyms: ['afraid', 'frightened', 'terrified', 'fearful', 'anxious', 'nervous'] },
  { word: 'hot',       level: 'A2', synonyms: ['warm', 'boiling', 'burning', 'scorching', 'blazing', 'heated'] },
  { word: 'cold',      level: 'A2', synonyms: ['cool', 'freezing', 'chilly', 'icy', 'frosty', 'bitter'] },
  { word: 'old',       level: 'A2', synonyms: ['aged', 'ancient', 'elderly', 'mature', 'senior', 'antique'] },
  { word: 'new',       level: 'A2', synonyms: ['fresh', 'modern', 'recent', 'latest', 'current', 'novel'] },
  { word: 'walk',      level: 'A2', synonyms: ['stroll', 'march', 'stride', 'wander', 'amble', 'trek'] },
  { word: 'talk',      level: 'A2', synonyms: ['speak', 'chat', 'converse', 'discuss', 'communicate', 'say'] },
  { word: 'look',      level: 'A2', synonyms: ['glance', 'stare', 'gaze', 'peek', 'observe', 'watch'] },
  { word: 'tired',     level: 'A2', synonyms: ['exhausted', 'weary', 'fatigued', 'sleepy', 'drained', 'worn out'] },
  { word: 'angry',     level: 'A2', synonyms: ['furious', 'mad', 'irritated', 'annoyed', 'enraged', 'cross'] },
  { word: 'beautiful', level: 'A2', synonyms: ['pretty', 'gorgeous', 'lovely', 'stunning', 'attractive', 'elegant'] },

  // B1
  { word: 'smart',       level: 'B1', synonyms: ['intelligent', 'clever', 'bright', 'brilliant', 'wise', 'sharp'] },
  { word: 'hard',        level: 'B1', synonyms: ['difficult', 'tough', 'challenging', 'demanding', 'arduous', 'tricky'] },
  { word: 'easy',        level: 'B1', synonyms: ['simple', 'straightforward', 'effortless', 'basic', 'uncomplicated'] },
  { word: 'think',       level: 'B1', synonyms: ['consider', 'believe', 'reflect', 'ponder', 'suppose', 'reckon'] },
  { word: 'start',       level: 'B1', synonyms: ['begin', 'launch', 'initiate', 'commence', 'open', 'kick off'] },
  { word: 'stop',        level: 'B1', synonyms: ['halt', 'end', 'cease', 'quit', 'finish', 'pause'] },
  { word: 'help',        level: 'B1', synonyms: ['assist', 'support', 'aid', 'guide', 'back', 'contribute'] },
  { word: 'want',        level: 'B1', synonyms: ['desire', 'wish', 'crave', 'need', 'hope for', 'long for'] },
  { word: 'improve',     level: 'B1', synonyms: ['enhance', 'develop', 'boost', 'upgrade', 'better', 'progress'] },
  { word: 'achieve',     level: 'B1', synonyms: ['accomplish', 'reach', 'attain', 'complete', 'fulfil', 'succeed in'] },
  { word: 'suggest',     level: 'B1', synonyms: ['propose', 'recommend', 'advise', 'hint', 'put forward'] },
  { word: 'important',   level: 'B1', synonyms: ['significant', 'crucial', 'essential', 'key', 'vital', 'major'] },
  { word: 'change',      level: 'B1', synonyms: ['alter', 'modify', 'adjust', 'transform', 'shift', 'switch'] },
  { word: 'understand',  level: 'B1', synonyms: ['grasp', 'follow', 'realize', 'comprehend', 'figure out', 'get'] },
  { word: 'create',      level: 'B1', synonyms: ['make', 'produce', 'develop', 'build', 'generate', 'design'] },
  { word: 'enjoy',       level: 'B1', synonyms: ['love', 'appreciate', 'relish', 'like', 'savour', 'take pleasure in'] },
  { word: 'explain',     level: 'B1', synonyms: ['describe', 'clarify', 'illustrate', 'outline', 'elaborate', 'outline'] },
  { word: 'find',        level: 'B1', synonyms: ['discover', 'locate', 'come across', 'identify', 'spot', 'uncover'] },
  { word: 'increase',    level: 'B1', synonyms: ['grow', 'rise', 'expand', 'climb', 'go up', 'boost'] },
  { word: 'learn',       level: 'B1', synonyms: ['study', 'discover', 'pick up', 'master', 'acquire', 'grasp'] },
  { word: 'plan',        level: 'B1', synonyms: ['intend', 'aim', 'prepare', 'arrange', 'organize', 'schedule'] },
  { word: 'reduce',      level: 'B1', synonyms: ['cut', 'decrease', 'lower', 'minimize', 'drop', 'limit'] },
  { word: 'show',        level: 'B1', synonyms: ['demonstrate', 'display', 'present', 'reveal', 'indicate', 'prove'] },
  { word: 'try',         level: 'B1', synonyms: ['attempt', 'aim', 'endeavour', 'make an effort', 'have a go'] },
  { word: 'use',         level: 'B1', synonyms: ['employ', 'apply', 'utilize', 'make use of', 'take advantage of'] },
  { word: 'decide',      level: 'B1', synonyms: ['choose', 'determine', 'resolve', 'opt', 'settle on', 'make up your mind'] },
  { word: 'agree',       level: 'B1', synonyms: ['accept', 'approve', 'consent', 'go along with', 'support'] },
  { word: 'avoid',       level: 'B1', synonyms: ['prevent', 'escape', 'dodge', 'skip', 'steer clear of', 'keep away from'] },
  { word: 'describe',    level: 'B1', synonyms: ['explain', 'outline', 'portray', 'define', 'detail', 'illustrate'] },
  { word: 'imagine',     level: 'B1', synonyms: ['picture', 'visualize', 'envision', 'suppose', 'assume', 'dream of'] },
  { word: 'trust',       level: 'B1', synonyms: ['believe in', 'rely on', 'depend on', 'have faith in', 'count on'] },
  { word: 'succeed',     level: 'B1', synonyms: ['achieve', 'manage', 'accomplish', 'make it', 'pull off', 'do well'] },
  { word: 'support',     level: 'B1', synonyms: ['back', 'help', 'assist', 'encourage', 'stand by', 'defend'] },
  { word: 'communicate', level: 'B1', synonyms: ['talk', 'speak', 'express', 'convey', 'share', 'interact'] },
  { word: 'organize',    level: 'B1', synonyms: ['arrange', 'plan', 'coordinate', 'manage', 'set up', 'structure'] },

  // B2
  { word: 'remarkable',  level: 'B2', synonyms: ['extraordinary', 'impressive', 'outstanding', 'exceptional', 'noteworthy'] },
  { word: 'hesitate',    level: 'B2', synonyms: ['pause', 'delay', 'waver', 'hold back', 'be reluctant', 'think twice'] },
  { word: 'maintain',    level: 'B2', synonyms: ['keep', 'preserve', 'sustain', 'uphold', 'retain', 'continue'] },
  { word: 'influence',   level: 'B2', synonyms: ['affect', 'impact', 'shape', 'guide', 'inspire', 'sway'] },
  { word: 'evaluate',    level: 'B2', synonyms: ['assess', 'judge', 'examine', 'review', 'analyze', 'measure'] },
  { word: 'elaborate',   level: 'B2', synonyms: ['expand', 'develop', 'explain further', 'go into detail', 'clarify'] },
  { word: 'acknowledge', level: 'B2', synonyms: ['admit', 'recognize', 'accept', 'appreciate', 'confirm', 'concede'] },
  { word: 'anticipate',  level: 'B2', synonyms: ['expect', 'foresee', 'predict', 'prepare for', 'look forward to'] },
  { word: 'persist',     level: 'B2', synonyms: ['continue', 'keep going', 'carry on', 'endure', 'stick with it'] },
  { word: 'negotiate',   level: 'B2', synonyms: ['discuss', 'bargain', 'arrange', 'work out', 'reach a deal'] },
  { word: 'perceive',    level: 'B2', synonyms: ['notice', 'sense', 'observe', 'detect', 'recognize', 'identify'] },
  { word: 'implement',   level: 'B2', synonyms: ['carry out', 'apply', 'execute', 'put into practice', 'introduce'] },
  { word: 'facilitate',  level: 'B2', synonyms: ['help', 'assist', 'enable', 'make easier', 'support', 'promote'] },
  { word: 'precise',     level: 'B2', synonyms: ['exact', 'accurate', 'specific', 'detailed', 'correct', 'definite'] },
  { word: 'inevitable',  level: 'B2', synonyms: ['certain', 'unavoidable', 'bound to happen', 'inescapable', 'sure'] },
]

export const PREPOSITION_PHRASES = [
  // A2
  { phrase: "She's interested ___ learning English.",        level: 'A2', answer: ['in'],      hint: 'interested in = zaujímať sa o' },
  { phrase: "He takes care ___ his younger brother.",        level: 'A2', answer: ['of'],      hint: 'take care of = starať sa o' },
  { phrase: "They're really good ___ solving problems.",     level: 'A2', answer: ['at'],      hint: 'good at = byť dobrý v niečom' },
  { phrase: "She's afraid ___ spiders.",                     level: 'A2', answer: ['of'],      hint: 'afraid of = báť sa niečoho' },
  { phrase: "I'm really proud ___ you.",                     level: 'A2', answer: ['of'],      hint: 'proud of = hrdý na' },
  { phrase: "She's excited ___ the trip.",                   level: 'A2', answer: ['about'],   hint: 'excited about = tešiť sa na' },
  { phrase: "I agree ___ you on this.",                      level: 'A2', answer: ['with'],    hint: 'agree with = súhlasiť s niekým' },
  { phrase: "I'm looking ___ a new job.",                    level: 'A2', answer: ['for'],     hint: 'look for = hľadať niečo' },
  { phrase: "I'm very fond ___ Italian food.",               level: 'A2', answer: ['of'],      hint: 'fond of = mať rád niečo' },
  { phrase: "I'm looking forward ___ the holiday.",          level: 'A2', answer: ['to'],      hint: 'look forward to = tešiť sa na' },
  { phrase: "She's married ___ a doctor.",                   level: 'A2', answer: ['to'],      hint: 'married to = vydatá/ženatý za' },
  { phrase: "He's worried ___ his exams.",                   level: 'A2', answer: ['about'],   hint: 'worried about = mať starosti o' },
  { phrase: "She's thinking ___ moving to London.",          level: 'A2', answer: ['about', 'of'], hint: 'thinking about/of = uvažovať o niečom' },
  { phrase: "We're waiting ___ the results.",                level: 'A2', answer: ['for'],     hint: 'wait for = čakať na niečo' },
  { phrase: "I need to apologize ___ my behaviour.",        level: 'A2', answer: ['for'],     hint: 'apologize for = ospravedlniť sa za' },

  // B1
  { phrase: "I can't cope ___ all this stress.",             level: 'B1', answer: ['with'],    hint: 'cope with = zvládnuť, vyrovnať sa s niečím' },
  { phrase: "She's struggling ___ the new grammar rules.",   level: 'B1', answer: ['with'],    hint: 'struggle with = mať problémy s niečím' },
  { phrase: "He succeeded ___ passing the exam.",            level: 'B1', answer: ['in'],      hint: 'succeed in = uspieť v niečom' },
  { phrase: "She complained ___ the noise all night.",       level: 'B1', answer: ['about'],   hint: 'complain about = sťažovať sa na niečo' },
  { phrase: "This bag belongs ___ my sister.",               level: 'B1', answer: ['to'],      hint: 'belong to = patriť niekomu' },
  { phrase: "She reacted ___ the news very calmly.",         level: 'B1', answer: ['to'],      hint: 'react to = reagovať na niečo' },
  { phrase: "I applied ___ the job last week.",              level: 'B1', answer: ['for'],     hint: 'apply for = uchádzať sa o (prácu)' },
  { phrase: "You can benefit ___ regular exercise.",         level: 'B1', answer: ['from'],    hint: 'benefit from = mať prospech z niečoho' },
  { phrase: "She suffers ___ back pain every day.",          level: 'B1', answer: ['from'],    hint: 'suffer from = trpieť niečím' },
  { phrase: "He specializes ___ English literature.",        level: 'B1', answer: ['in'],      hint: 'specialize in = špecializovať sa na' },
  { phrase: "I'm concentrating ___ my studies this week.",   level: 'B1', answer: ['on'],      hint: 'concentrate on = sústrediť sa na' },
  { phrase: "She relies ___ her gut feeling.",               level: 'B1', answer: ['on'],      hint: 'rely on = spoliehať sa na' },
  { phrase: "This report consists ___ three parts.",         level: 'B1', answer: ['of'],      hint: 'consist of = skladať sa z' },
  { phrase: "He's known ___ his great sense of humour.",     level: 'B1', answer: ['for'],     hint: 'known for = byť známy niečím' },
  { phrase: "I'm curious ___ your opinion on this.",         level: 'B1', answer: ['about'],   hint: 'curious about = byť zvedavý na niečo' },
  { phrase: "He's keen ___ learning new languages.",         level: 'B1', answer: ['on'],      hint: 'keen on = byť nadšený z niečoho' },
  { phrase: "She's tired ___ making excuses.",               level: 'B1', answer: ['of'],      hint: 'tired of = mať dosť niečoho' },
  { phrase: "He's aware ___ the risks involved.",            level: 'B1', answer: ['of'],      hint: 'aware of = byť si vedomý niečoho' },
  { phrase: "She's capable ___ doing so much more.",         level: 'B1', answer: ['of'],      hint: 'capable of = byť schopný niečoho' },
  { phrase: "He's addicted ___ social media.",               level: 'B1', answer: ['to'],      hint: 'addicted to = byť závislý na niečom' },
  { phrase: "I'm not used ___ waking up this early.",        level: 'B1', answer: ['to'],      hint: 'used to = byť zvyknutý na niečo' },
  { phrase: "She takes pride ___ her work.",                 level: 'B1', answer: ['in'],      hint: 'take pride in = byť hrdý na niečo' },
  { phrase: "He's dealing ___ a very difficult situation.",  level: 'B1', answer: ['with'],    hint: 'deal with = riešiť, vyrovnávať sa s niečím' },
  { phrase: "She's planning ___ studying abroad next year.", level: 'B1', answer: ['on'],      hint: 'plan on = mať v pláne niečo urobiť' },
  { phrase: "I'm working ___ improving my pronunciation.",   level: 'B1', answer: ['on'],      hint: 'work on = pracovať na niečom, zlepšovať niečo' },
  { phrase: "He came up ___ a brilliant idea.",              level: 'B1', answer: ['with'],    hint: 'come up with = prísť s nápadom' },
  { phrase: "She gave ___ trying to quit smoking.",          level: 'B1', answer: ['up'],      hint: 'give up = vzdať to, prestať s niečím' },
  { phrase: "He pointed ___ several mistakes in my essay.",  level: 'B1', answer: ['out'],     hint: 'point out = poukázať na niečo' },
  { phrase: "She turned ___ the job offer.",                 level: 'B1', answer: ['down'],    hint: 'turn down = odmietnuť niečo/niekoho' },
  { phrase: "I need to catch ___ on sleep this weekend.",    level: 'B1', answer: ['up'],      hint: 'catch up on = dohnať zameškaný čas' },

  // B2
  { phrase: "He's responsible ___ the whole project.",       level: 'B2', answer: ['for'],     hint: 'responsible for = zodpovedný za niečo' },
  { phrase: "She insisted ___ paying the bill herself.",     level: 'B2', answer: ['on'],      hint: 'insist on = trvať na niečom' },
  { phrase: "His mistake resulted ___ a big financial loss.",level: 'B2', answer: ['in'],      hint: 'result in = mať za následok' },
  { phrase: "Hard work invariably leads ___ success.",       level: 'B2', answer: ['to'],      hint: 'lead to = viesť k niečomu' },
  { phrase: "She objected ___ the proposed new rules.",      level: 'B2', answer: ['to'],      hint: 'object to = namietať voči niečomu' },
  { phrase: "I'm not familiar ___ this particular topic.",   level: 'B2', answer: ['with'],    hint: 'familiar with = oboznámený s niečím' },
  { phrase: "She's satisfied ___ her overall progress.",     level: 'B2', answer: ['with'],    hint: 'satisfied with = byť spokojný s niečím' },
  { phrase: "I'm committed ___ finishing this project.",     level: 'B2', answer: ['to'],      hint: 'committed to = byť odhodlaný k niečomu' },
  { phrase: "She's been putting ___ this task for weeks.",   level: 'B2', answer: ['off'],     hint: 'put off = odkladať niečo' },
  { phrase: "He's missing ___ on so many opportunities.",    level: 'B2', answer: ['out'],     hint: 'miss out on = prísť o niečo, ujsť príležitosť' },
  { phrase: "She looks ___ to her older sister.",            level: 'B2', answer: ['up'],      hint: 'look up to = obdivovať niekoho' },
  { phrase: "He contributed significantly ___ the project.", level: 'B2', answer: ['to'],      hint: 'contribute to = prispieť k niečomu' },
  { phrase: "I'm impressed ___ your attention to detail.",   level: 'B2', answer: ['by', 'with'], hint: 'impressed by/with = byť ohromený niečím' },
  { phrase: "She's confident ___ her ability to succeed.",   level: 'B2', answer: ['in', 'about'], hint: 'confident in/about = byť sebavedomý v niečom' },
  { phrase: "He's been fed up ___ the constant changes.",    level: 'B2', answer: ['with'],    hint: 'fed up with = mať dosť niečoho' },
]

export const IDIOM_PHRASES = [
  // B1
  { phrase: "It's raining ___ and dogs outside.",             level: 'B1', answer: ['cats'],     hint: '"raining cats and dogs" = prší ako z krhly' },
  { phrase: "Let's not beat around the ___.",                 level: 'B1', answer: ['bush'],     hint: '"beat around the bush" = chodiť okolo horúcej kaše' },
  { phrase: "She always hits the nail on the ___.",           level: 'B1', answer: ['head'],     hint: '"hit the nail on the head" = trafiť klinec po hlavičke' },
  { phrase: "He let the cat out of the ___.",                 level: 'B1', answer: ['bag'],      hint: '"let the cat out of the bag" = prezradiť tajomstvo' },
  { phrase: "I'm feeling a bit under the ___.",               level: 'B1', answer: ['weather'],  hint: '"under the weather" = nie vo svojej koži, trochu chorý' },
  { phrase: "We're all in the same ___.",                     level: 'B1', answer: ['boat'],     hint: '"in the same boat" = byť v rovnakej situácii' },
  { phrase: "That's not my cup of ___.",                      level: 'B1', answer: ['tea'],      hint: '"not my cup of tea" = nie je to pre mňa' },
  { phrase: "She spilled the ___ about the surprise party.",  level: 'B1', answer: ['beans'],    hint: '"spill the beans" = prezradiť tajomstvo' },
  { phrase: "He's the black ___ of the family.",              level: 'B1', answer: ['sheep'],    hint: '"black sheep" = čierna ovca rodiny' },
  { phrase: "Don't judge a ___ by its cover.",                level: 'B1', answer: ['book'],     hint: '"don\'t judge a book by its cover" = nesúď podľa zdania' },
  { phrase: "It's a piece of ___.",                           level: 'B1', answer: ['cake'],     hint: '"piece of cake" = hračka, veľmi ľahká vec' },
  { phrase: "We need to think outside the ___.",              level: 'B1', answer: ['box'],      hint: '"think outside the box" = myslieť kreatívne, nekonvenčne' },
  { phrase: "I'm keeping my fingers ___.",                    level: 'B1', answer: ['crossed'],  hint: '"keep fingers crossed" = držať palce' },
  { phrase: "She's on the ___ of her seat.",                  level: 'B1', answer: ['edge'],     hint: '"on the edge of your seat" = v napätom očakávaní' },
  { phrase: "He's been burning the midnight ___.",            level: 'B1', answer: ['oil'],      hint: '"burn the midnight oil" = pracovať/učiť sa do noci' },
  { phrase: "She has a heart of ___.",                        level: 'B1', answer: ['gold'],     hint: '"heart of gold" = zlaté srdce' },
  { phrase: "It costs an arm and a ___.",                     level: 'B1', answer: ['leg'],      hint: '"cost an arm and a leg" = stáť balík, byť veľmi drahé' },
  { phrase: "He's pulling your ___.",                         level: 'B1', answer: ['leg'],      hint: '"pull someone\'s leg" = ťahať niekoho za nos, žartovať' },
  { phrase: "She went the extra ___ for her team.",           level: 'B1', answer: ['mile'],     hint: '"go the extra mile" = urobiť viac ako sa očakáva' },
  { phrase: "She's got a lot on her ___.",                    level: 'B1', answer: ['plate'],    hint: '"have a lot on your plate" = mať veľa práce, byť zavalený' },
  { phrase: "He got cold ___ before the presentation.",      level: 'B1', answer: ['feet'],     hint: '"get cold feet" = dostať strach, zľaknúť sa' },
  { phrase: "I bit off more than I could ___.",               level: 'B1', answer: ['chew'],     hint: '"bite off more than you can chew" = zobrať na seba viac ako zvládneš' },
  { phrase: "She gave him the cold ___.",                     level: 'B1', answer: ['shoulder'], hint: '"cold shoulder" = ignorovať niekoho' },
  { phrase: "I need to keep an ___ on the budget.",           level: 'B1', answer: ['eye'],      hint: '"keep an eye on" = sledovať, dávať pozor na niečo' },
  { phrase: "Break a ___! You'll do great.",                  level: 'B1', answer: ['leg'],      hint: '"break a leg" = veľa šťastia! (v divadle/pred vystúpením)' },

  // B2
  { phrase: "I'll cross that ___ when I come to it.",         level: 'B2', answer: ['bridge'],   hint: '"cross that bridge when you come to it" = riešiť problémy keď nastanú' },
  { phrase: "He's sitting on the ___.",                       level: 'B2', answer: ['fence'],    hint: '"sit on the fence" = nevedieť sa rozhodnúť, sedieť na dvoch stoličkách' },
  { phrase: "She bit the ___ and went to the dentist.",       level: 'B2', answer: ['bullet'],   hint: '"bite the bullet" = prekonať sa a urobiť niečo ťažké' },
  { phrase: "He called a ___ a spade.",                       level: 'B2', answer: ['spade'],    hint: '"call a spade a spade" = hovoriť veci na rovinu' },
  { phrase: "Let things ___ off your back.",                  level: 'B2', answer: ['roll'],     hint: '"let things roll off your back" = nebrať si veci osobne' },
  { phrase: "She ran ___ an old friend at the supermarket.",  level: 'B2', answer: ['into'],     hint: '"run into" = stretnúť niekoho náhodou' },
  { phrase: "He always puts his ___ in his mouth.",           level: 'B2', answer: ['foot'],     hint: '"put your foot in your mouth" = povedať niečo nevhodné, taknúť do toho' },
  { phrase: "She hit the ___ running on her first day.",      level: 'B2', answer: ['ground'],   hint: '"hit the ground running" = začať niečo rýchlo a efektívne' },
  { phrase: "They're cutting ___ on unnecessary expenses.",   level: 'B2', answer: ['down'],     hint: '"cut down on" = obmedzovať niečo' },
  { phrase: "He took the ___ by the horns.",                  level: 'B2', answer: ['bull'],     hint: '"take the bull by the horns" = chytiť problém za roh, konať rozhodne' },
]

export const SHADOWING_SENTENCES = [
  { sentence: "I've been really looking forward to this.",             level: 'A2' },
  { sentence: "Could you please speak a bit more slowly?",            level: 'A2' },
  { sentence: "I'm not sure what you mean by that.",                  level: 'A2' },
  { sentence: "It's been a while since we last spoke.",               level: 'A2' },
  { sentence: "I completely forgot about the meeting today.",         level: 'A2' },
  { sentence: "Would you mind if I opened the window?",               level: 'A2' },
  { sentence: "I'm really sorry, I didn't mean to upset you.",        level: 'A2' },
  { sentence: "She asked me if I had finished the report.",           level: 'B1' },
  { sentence: "We should take advantage of this opportunity.",        level: 'B1' },
  { sentence: "I'd really appreciate your help with this.",           level: 'B1' },
  { sentence: "Let me think about it and get back to you.",           level: 'B1' },
  { sentence: "I was wondering if you could do me a favour.",         level: 'B1' },
  { sentence: "That's a really interesting point, actually.",         level: 'B1' },
  { sentence: "I've never been to London, but I'd love to go.",       level: 'B1' },
  { sentence: "She told me she was planning to move abroad.",         level: 'B1' },
  { sentence: "Do you think we could find a compromise?",             level: 'B1' },
  { sentence: "I've just started learning to play the guitar.",       level: 'B1' },
  { sentence: "It's getting late — we should probably head home.",    level: 'B1' },
  { sentence: "By the time I arrived, the film had already started.", level: 'B2' },
  { sentence: "He said he'd been working on it all week.",            level: 'B2' },
  { sentence: "Had I known about this earlier, I would have helped.", level: 'B2' },
  { sentence: "Not only did she finish on time, she exceeded expectations.", level: 'B2' },
  { sentence: "It's worth bearing in mind that the deadline is approaching.", level: 'B2' },
  { sentence: "The more you practise, the more confident you'll become.", level: 'B2' },
]

function dailyStart(arr) {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''))
  return seed % arr.length
}

export function getListForLevel(fullList, level) {
  const filtered = fullList.filter(item => item.level === level)
  return filtered.length > 0 ? filtered : fullList
}

export function getDailySynonymWord(level)    {
  const list = getListForLevel(SYNONYM_WORDS, level)
  return list[dailyStart(list)]
}
export function getDailyPhrase(level) {
  const list = getListForLevel(PREPOSITION_PHRASES, level)
  return list[dailyStart(list)]
}
export function getDailyIdiom(level) {
  const list = getListForLevel(IDIOM_PHRASES, level)
  return list[dailyStart(list)]
}
export function getDailyShadowSentence(level) {
  const list = getListForLevel(SHADOWING_SENTENCES, level)
  return list[dailyStart(list)]
}
