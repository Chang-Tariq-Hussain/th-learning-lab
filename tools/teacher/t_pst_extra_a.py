from math import gcd, lcm
from fractions import Fraction as F
from helpers import q, qf
E, M = "English", "Mathematics"
P1 = ("Honey bees live together in a hive. Each hive has one queen, hundreds of male drones and thousands of female workers. "
      "The workers collect nectar from flowers and carry it back to the hive, where it is turned into honey. "
      "While moving from flower to flower, bees also carry pollen, which helps plants to produce fruits and seeds. "
      "Without bees, many of the crops we eat every day would become scarce.")
P2 = ("Farida lived in a small village near the river Indus. Every morning she walked two kilometres to school with her younger brother. "
      "One day the road was flooded, so they could not cross. Instead of going back home, they climbed a nearby hill and read their books under a tree. "
      "When the water went down, their teacher praised them for their love of learning.")
rows = [
# ---- English: reading comprehension
q("PJ",E,"Reading Comprehension","e","According to the passage, where do honey bees live?","in a hive",["under a tree","in a river","in a field"],"The first sentence says honey bees live together in a hive.",passage=P1),
q("PJ",E,"Reading Comprehension","m","Which bees collect nectar from flowers?","the workers",["the queen","the drones","all male bees"],"The passage says the workers collect nectar.",passage=P1),
q("PJ",E,"Reading Comprehension","m","How do bees help plants?","by carrying pollen between flowers",["by eating insects","by watering them","by cutting dead leaves"],"Moving pollen from flower to flower helps plants make fruits and seeds.",passage=P1),
q("PJ",E,"Reading Comprehension","d","What does the passage suggest would happen without bees?","some crops would become hard to find",["honey would be cheaper","flowers would grow faster","hives would be larger"],"The last sentence says many crops would become scarce.",passage=P1),
q("PJ",E,"Reading Comprehension","e","How far did Farida walk to school?","two kilometres",["one kilometre","ten kilometres","two hundred metres"],"The passage says she walked two kilometres each morning.",passage=P2),
q("PJ",E,"Reading Comprehension","m","Why could the children not reach school one day?","the road was flooded",["the school was closed","they were ill","they lost their books"],"The passage says the road was flooded so they could not cross.",passage=P2),
q("PJ",E,"Reading Comprehension","d","Which word best describes Farida and her brother?","determined",["careless","fearful","lazy"],"They chose to read on the hill instead of going home, showing determination.",passage=P2),
q("PJ",E,"Reading Comprehension","m","In the passage, the word 'scarce' (about crops) means:","hard to find",["very cheap","very large","tasty"],"Scarce means in short supply.",passage=P1),
# ---- English: harder grammar / usage at PST level
q("PJ",E,"Grammar","d","Choose the correct word: 'They left ___ books on the bus.'","their",["there","they're","thier"],"'Their' is the possessive of 'they'; 'there' is a place and 'they're' means 'they are'."),
q("PJ",E,"Grammar","d","Choose the correct word: 'He tried to ___ to the new school quickly.'","adapt",["adopt","adept","adapts"],"Adapt means to adjust; adopt means to take as one's own."),
q("PJ",E,"Grammar","d","'The sun ___ in the east' (a general truth). Choose the correct verb.","rises",["rose","has risen","will rise"],"A permanent fact uses the simple present."),
q("PJ",E,"Parts of Speech","d","In 'She ran quickly because she was late', the word 'because' is a:","conjunction",["preposition","adverb","pronoun"],"'Because' joins two clauses, so it is a conjunction."),
q("PJ",E,"Parts of Speech","d","Which sentence contains an adverb?","The tortoise walked slowly.",["The tortoise is slow.","The slow tortoise won.","A tortoise is an animal."],"'Slowly' tells how the tortoise walked, so it is an adverb; 'slow' is an adjective."),
q("PJ",E,"Prepositions","d","Choose the correct preposition: 'The teacher divided the sweets ___ the four children.'","among",["between","into","over"],"'Among' is used for more than two; 'between' is used for two."),
q("PJ",E,"Prepositions","d","Choose the correct preposition: 'The cat jumped ___ the wall.'","over",["at","by","for"],"'Over' shows movement from one side to the other."),
q("PJ",E,"Pronouns","d","Choose the correct pronoun: 'This is the boy ___ won the prize.'","who",["whom","whose","which"],"'Who' refers to a person and is the subject of 'won'."),
q("PJ",E,"Tenses","d","Choose the correct sentence.","I have been waiting for an hour.",["I am waiting for an hour.","I waited since an hour.","I have wait for an hour."],"An action that began in the past and continues now uses the present perfect continuous."),
q("PJ",E,"Active and Passive Voice","d","Change to passive: 'The farmer sells vegetables.'","Vegetables are sold by the farmer.",["Vegetables is sold by the farmer.","Vegetables were sold by the farmer.","Vegetables are selling by the farmer."],"Simple present passive: 'are' + past participle, matching the plural 'vegetables'."),
q("PJ",E,"Direct and Indirect Speech","d","Change to indirect speech: He said, \"I am reading a book.\"","He said that he was reading a book.",["He said that he is reading a book.","He said that I was reading a book.","He said that he reads a book."],"The present continuous becomes the past continuous in reported speech."),
q("PJ",E,"Sentence Correction","d","Choose the correct sentence.","Neither of the boys was late.",["Neither of the boys were late.","Neither of the boys are late.","Neither of boys was late."],"'Neither' takes a singular verb: 'was'."),
q("PJ",E,"Subject-Verb Agreement","d","Choose the correct verb: 'The teacher, along with her students, ___ going on a trip.'","is",["are","were","have been"],"The subject is the singular 'teacher'; 'along with her students' does not make it plural."),
q("PJ",E,"Idioms","d","'To pull someone's leg' means:","to tease someone playfully",["to injure someone","to help someone walk","to run away"],"It means to joke with or tease someone."),
q("PJ",E,"Synonyms","d","Choose the word closest in meaning to 'enormous'.","gigantic",["tiny","gentle","clever"],"Enormous means very large, like gigantic."),
q("PJ",E,"Antonyms","d","Choose the antonym of 'fragile'.","sturdy",["delicate","weak","thin"],"Fragile things break easily; sturdy things are strong."),
q("PJ",E,"One-Word Substitution","d","A person who has no money or home:","destitute",["generous","literate","diligent"],"Destitute means extremely poor."),
q("P",E,"Literature Basics","m","Who wrote the play 'Romeo and Juliet'?","William Shakespeare",["Charles Dickens","Jane Austen","Mark Twain"],"Shakespeare wrote Romeo and Juliet."),
q("P",E,"Literature Basics","m","The novel 'Robinson Crusoe' was written by:","Daniel Defoe",["Jonathan Swift","Charles Dickens","Lewis Carroll"],"Daniel Defoe published it in 1719."),
q("P",E,"Literature Basics","d","'Alice's Adventures in Wonderland' was written by:","Lewis Carroll",["J. M. Barrie","Roald Dahl","Rudyard Kipling"],"Lewis Carroll (Charles Dodgson) wrote it in 1865."),
q("P",E,"Sentence Completion","d","He worked hard ___ he could pass the examination.","so that",["although","unless","because of"],"'So that' expresses purpose."),
# ---- Mathematics: PST difficult / extra
q("PJ",M,"Basic Arithmetic","d","What is 25 x 16 divided by 8?","50",["40","32","80"],"25 x 16 = 400 and 400 / 8 = 50.",chk=25*16//8),
q("PJ",M,"Basic Arithmetic","d","The sum of three consecutive whole numbers is 87. The smallest of them is:","28",["27","29","30"],"The numbers are 28, 29 and 30; their sum is 87.",chk=(87-3)//3),
q("PJ",M,"Number Systems","d","What is the smallest number which when divided by 4, 5 and 6 leaves remainder 1 each time?","61",["31","121","41"],"LCM(4, 5, 6) = 60, and 60 + 1 = 61.",chk=lcm(4,5,6)+1),
q("PJ",M,"Factors and Multiples","d","What is the HCF of 36, 48 and 60?","12",["6","24","4"],"36 = 2^2 x 3^2, 48 = 2^4 x 3 and 60 = 2^2 x 3 x 5; the HCF is 2^2 x 3 = 12.",chk=gcd(gcd(36,48),60)),
q("PJ",M,"Fractions","d","What is 3/4 + 2/3 - 1/6?","5/4",["7/12","4/3","1"],"Common denominator 12: 9/12 + 8/12 - 2/12 = 15/12 = 5/4.",chk=str(F(3,4)+F(2,3)-F(1,6))),
q("PJ",M,"Fractions","d","Ali reads 1/4 of a book on Monday and 1/3 on Tuesday. What fraction is still unread?","5/12",["7/12","1/2","2/7"],"Read = 1/4 + 1/3 = 7/12, so 5/12 is left.",chk=str(1-(F(1,4)+F(1,3)))),
q("PJ",M,"Decimals","d","What is 7.5 x 0.04?","0.3",["3","0.03","0.75"],"75 x 4 = 300 and there are three decimal places: 0.300 = 0.3.",chk=round(7.5*0.04,2)),
q("PJ",M,"Percentages","d","A student scored 36 out of 60. What is his percentage?","60%",["36%","40%","66%"],"36/60 x 100 = 60%.",chk="60%"),
q("PJ",M,"Percentages","d","The price of a book is reduced from Rs 400 to Rs 340. The percentage decrease is:","15%",["12%","20%","60%"],"The decrease is 60 on 400, which is 15%.",chk="15%"),
q("PJ",M,"Ratio and Proportion","d","A rope 72 m long is cut into two pieces in the ratio 5 : 3. The longer piece is:","45 m",["27 m","40 m","48 m"],"One part = 72/8 = 9 m, so the longer piece is 5 x 9 = 45 m.",chk="45 m"),
q("PJ",M,"Average","d","The average weight of 4 boys is 40 kg. A fifth boy weighing 50 kg joins them. The new average is:","42 kg",["45 kg","41 kg","44 kg"],"New total = 160 + 50 = 210, and 210/5 = 42 kg.",chk="42 kg"),
q("PJ",M,"Profit and Loss","d","A fruit seller buys 20 mangoes for Rs 400 and sells them at Rs 24 each. His profit is:","Rs 80",["Rs 20","Rs 40","Rs 120"],"Sale = 20 x 24 = 480; profit = 480 - 400 = Rs 80.",chk="Rs 80"),
q("PJ",M,"Simple Interest","d","Rs 5,000 is invested at 8% simple interest per year. The amount after 3 years is:","Rs 6,200",["Rs 1,200","Rs 5,400","Rs 6,500"],"Interest = 5000 x 8 x 3/100 = 1,200; amount = 6,200.",chk="Rs {:,}".format(5000+5000*8*3//100)),
q("PJ",M,"Time and Work","d","If 8 men can dig a trench in 6 days, how many days will 12 men take?","4 days",["9 days","3 days","5 days"],"8 x 6 = 48 man-days; 48/12 = 4 days.",chk="4 days"),
q("PJ",M,"Time, Speed and Distance","d","A bus travels 150 km at 50 km/h and then 120 km at 60 km/h. The total time taken is:","5 hours",["4 hours","6 hours","4.5 hours"],"3 hours + 2 hours = 5 hours.",chk="5 hours"),
q("PJ",M,"Basic Algebra","d","If 2x + 3 = 4x - 7, then x = ?","5",["2","-5","10"],"3 + 7 = 4x - 2x, so 10 = 2x and x = 5.",chk=5),
q("PJ",M,"Basic Algebra","d","Simplify: 3(x + 4) - 2(x - 1)","x + 14",["x + 10","5x + 14","x + 2"],"3x + 12 - 2x + 2 = x + 14."),
q("PJ",M,"Geometry","d","The angles of a triangle are in the ratio 2 : 3 : 4. The largest angle is:","80 degrees",["60 degrees","90 degrees","40 degrees"],"One part = 180/9 = 20 degrees; the largest = 4 x 20 = 80.",chk="80 degrees"),
q("PJ",M,"Mensuration","d","A room is 6 m long, 5 m wide and 3 m high. The area of its four walls is:","66 square m",["90 square m","33 square m","96 square m"],"Walls = 2(l + b) x h = 2 x 11 x 3 = 66.",chk="66 square m"),
q("PJ",M,"Mensuration","d","How many square tiles of side 50 cm are needed to cover a floor 10 m by 5 m?","200",["100","250","400"],"Floor = 50 square m; each tile = 0.25 square m; 50/0.25 = 200.",chk=int(50/0.25)),
q("PJ",M,"Data Handling","d","The mean of five numbers is 12. Four of them are 8, 10, 14 and 16. The fifth number is:","12",["10","14","8"],"Total = 60 and 8 + 10 + 14 + 16 = 48, so the fifth is 12.",chk=60-48),
q("PJ",M,"Word Problems","d","A tank holds 240 litres. It is 3/8 full. How many more litres are needed to fill it?","150 litres",["90 litres","120 litres","100 litres"],"Present amount = 90 litres, so 150 litres more are needed.",chk="150 litres"),
q("PJ",M,"Word Problems","d","Sara has twice as many marbles as Ayesha. Together they have 54. How many does Sara have?","36",["18","27","24"],"Ayesha has 18 and Sara has 36.",chk=36),
q("PJ",M,"Mathematical Reasoning","d","What comes next: 5, 10, 20, 40, ...?","80",["60","70","100"],"Each number is double the previous one."),
q("PJ",M,"Mathematical Reasoning","d","What comes next: 2, 6, 12, 20, 30, ...?","42",["36","40","44"],"The differences are 4, 6, 8, 10, so next is +12: 30 + 12 = 42."),
]
