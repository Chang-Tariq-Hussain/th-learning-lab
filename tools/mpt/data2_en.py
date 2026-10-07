"""Mock 2 - English (50)."""
from helpers2 import *
EN = "English"
N23 = "Appears in the uploaded 2023 Special reproduction (third-party, not an official FPSC copy); answer re-derived independently."
N25 = "Appears in the uploaded 2025 reproduction (scanned, third-party); answer re-derived independently."
N22 = "Appears in the uploaded 2022 reproduction (third-party, not an official FPSC copy); answer re-derived independently."
N26 = "Appears in the uploaded 2026 reproduction (third-party); options tidied or completed where the text was truncated; answer re-derived independently."
Y_VOC = "Synonym/antonym/vocabulary items appear in every parsed paper (2022-2026; about 34 by keyword count)."
Y_PREP = "Prepositions and fill-in-the-blank items appear in 2022, 2023, 2025 and 2026 (about 61 by keyword count, 2023 heaviest)."
Y_GRAM = "Sentence-correction / grammar-identification items appear in every parsed paper (about 30 by keyword count; 2026 has 13)."
Y_IDIOM = "Idiom / meaning items appear in 2022, 2023, 2025 and 2026 (about 17)."
Y_COMP = "Comprehension passages appear in 2022, 2025 and 2026 (about 22 passage-linked items)."
Y_AN = "Analogies appear in 2022, 2023 and 2025; one-word substitution is a standard FPSC English pattern."
def E(*a, **k): return q(EN, *a, **k)

PASSAGE = ("Water has quietly become one of the most pressing challenges facing Pakistan. The country draws nearly all of its irrigation "
 "from the Indus river system, which sustains one of the largest contiguous canal networks in the world and feeds farms that employ a "
 "large share of the population. Yet storage capacity is small, holding only a few weeks of river flow. Population growth, wasteful flood "
 "irrigation and the rapid fall of groundwater levels in cities have deepened the problem. Experts argue that no single dam can solve it. "
 "Instead, they recommend a combination of measures: lining leaking canals, pricing water more sensibly, adopting drip irrigation, "
 "recharging aquifers and recycling urban wastewater. Without such reforms, they warn, water scarcity will become a drag on economic "
 "growth and a source of conflict between provinces.")
GN = "Generated for this mock (original passage and questions); no past-paper claim."

items = [
 # ---------------- from uploaded past papers (16)
 E("Phrasal Verbs","Easy",VP,2023,[],"When the meeting had finished, they went ______ the plan once again.",["Down","On","Up","Over"],"D",
   "'Go over' means to review or examine; the other phrasal verbs do not fit with 'the plan'.",Y_PREP,N23),
 E("Prepositions","Moderate",VP,2023,[],"We have been able to obtain no information ______ his whereabouts.",["That of","According to","In which","As to"],"D",
   "'As to' means 'concerning'; 'information as to his whereabouts' is correct.",Y_PREP,N23),
 E("Grammar","Moderate",VP,2023,[],"Some compound adjectives contain hyphens. Which of the following sentences is correct?",
   ["He's a decent-judge of character","She submitted a 190-page document supporting her position","We're adopting a two year old parakeet","We're reading Sanskrit dialect"],"B",
   "A number-plus-noun compound before a noun takes a hyphen ('190-page document'). The sentence about the parakeet should read 'two-year-old parakeet'.",Y_GRAM,N23),
 E("Sentence Completion","Easy",VP,2023,[],"The children were ______ by the seemingly nonsensical clues until Kinan pointed out that the messages were in code.",
   ["Censured","Pondered","Feigned","Perplexed"],"D","'Perplexed' means confused, which fits clues that seemed nonsensical.",Y_VOC,N23),
 E("Sentence Completion","Easy",VP,2023,[],"For a ______ fee, it is possible to upgrade from regular gasoline to premium.",
   ["Nominal","Substantive","Exorbitant","Bountiful"],"A","A 'nominal' fee is a very small one; the other words suggest a large fee.",Y_VOC,N23),
 E("Vocabulary","Moderate",VP,2023,[],"'Fastidious' means:",
   ["A person hard to please","A person hard to convince","A person hard to anger","A person who hurries"],"A",
   "Fastidious means very attentive to detail and hard to please. Option D is a distractor added to replace the garbled source option.",Y_VOC,N23+" Fourth option replaced (source option unclear)."),
 E("Prepositions","Easy",VP,2023,[],"I know both of them are short ______ money because of their extravagant nature.",["On","Of","In","With"],"B",
   "The idiom is 'short of money'.",Y_PREP,N23),
 E("Vocabulary","Easy",VP,2025,[],"What is the meaning of the word 'Morbid'?",
   ["Cheerful and lively","Related to death or disease","Full of energy and vitality","Pure and innocent"],"B","Morbid means related to disease or death, or having an unhealthy interest in them.",Y_VOC,N25),
 E("Synonyms","Difficult",VP,2025,[],"Synonym of 'Moiety':",["Whole","Portion","Complete","Entirety"],"B",
   "A moiety is a part or share, originally a half; 'portion' is the closest. 'Whole', 'complete' and 'entirety' are opposites.",Y_VOC,N25),
 E("Vocabulary","Moderate",VP,2025,[],"Meaning of 'Zany':",
   ["Intelligent","Crazy or foolish","Strong and powerful","Peaceful and calm"],"B","Zany means amusingly unconventional or foolish.",Y_VOC,N25),
 E("Parts of Speech","Easy",VP,2022,[],"Choose the sentence with an adverb of time.",
   ["He has spoken to him already","He is a good boy","The horse is running away","The boy works hard"],"A",
   "'Already' tells when the action happened, so it is an adverb of time. 'Away' is an adverb of place and 'hard' an adverb of manner.",Y_GRAM,N22+" Option B replaced because the source option was ambiguous."),
 E("Parts of Speech","Moderate",VP,2022,[],"In the sentence 'Ambition urges me forward', the word 'forward' is:",
   ["An adjective of time","An adjective of place","An adverb of time","An adverb of place"],"D",
   "'Forward' modifies the verb 'urges' and tells where/in which direction, so it is an adverb of place.",Y_GRAM,N22),
 E("Synonyms","Moderate",VP,2022,[],"SACROSANCT",["Secret","Sanctuary","Pious","Sacred"],"D",
   "Sacrosanct means too sacred or important to be interfered with; 'sacred' is the nearest.",Y_VOC,N22),
 E("Grammar","Moderate",VP,2026,[],"Identify the sentence with incorrect use of a hyphen.",
   ["The company's well-known CEO spoke at the conference.","The self-portrait was painted by a famous-artist.","The co-pilot navigated the plane through turbulent weather.","The full-time employee received benefits."],"B",
   "'Famous artist' is an adjective plus a noun and takes no hyphen; the others are correct.",Y_GRAM,N26),
 E("Punctuation","Moderate",VP,2026,[],"Identify the sentence with the correct use of the colon.",
   ["I have three goals for the year, lose weight, save money and travel more.","The ingredients for the cake are: flour, sugar, eggs, and vanilla.","She had one question: when is the deadline?","He enjoys various outdoor activities: such as hiking, camping and fishing."],"C",
   "A colon follows a complete clause and introduces an explanation or list: 'She had one question: when is the deadline?' The goals sentence uses a comma where a colon is needed, the cake sentence puts a colon straight after the verb 'are', and the activities sentence adds 'such as' after the colon.",Y_GRAM,N26),
 E("Grammar","Moderate",VP,2026,[],"Identify the sentence with a grammatical error.",
   ["The physicist, along with her team, are conducting groundbreaking research.","Despite the challenging conditions, he persevered in his quest.","The book, which has been read by millions, remains a classic.","Their commitment to excellence is evident in all that they do."],"A",
   "With 'along with', the verb agrees with the main subject 'the physicist' (singular): 'is conducting'. The other sentences are correct.",Y_GRAM,N26),
 # ---------------- generated (34)
 E("Synonyms","Moderate",GP,None,[],"Ubiquitous:",["Scarce","Omnipresent","Transient","Obscure"],"B","Ubiquitous means found everywhere, i.e. omnipresent.",Y_VOC),
 E("Synonyms","Difficult",GP,None,[],"Recalcitrant:",["Obstinate","Compliant","Weary","Hesitant"],"A","Recalcitrant means stubbornly resisting authority or control; obstinate is the closest.",Y_VOC),
 E("Synonyms","Difficult",GP,None,[],"Truculent:",["Belligerent","Docile","Timid","Jovial"],"A","Truculent means eager to fight or defiantly aggressive; belligerent is the synonym.",Y_VOC),
 E("Synonyms","Difficult",GP,None,[],"Obsequious:",["Servile","Arrogant","Obvious","Hostile"],"A","Obsequious means excessively eager to please or obey; 'servile' is the closest.",Y_VOC),
 E("Synonyms","Moderate",GP,None,[],"Pernicious:",["Harmful","Beneficial","Fussy","Ancient"],"A","Pernicious means having a harmful effect, often gradually.",Y_VOC),
 E("Synonyms","Difficult",GP,None,[],"Perfidy:",["Loyalty","Treachery","Perfection","Bravery"],"B","Perfidy is deliberate breach of faith; treachery is the synonym.",Y_VOC),
 E("Antonyms","Easy",GP,None,[],"Antonym of 'Benevolent':",["Malevolent","Generous","Kind","Charitable"],"A","Benevolent means well-meaning and kind; malevolent means wishing harm.",Y_VOC),
 E("Antonyms","Difficult",GP,None,[],"Antonym of 'Munificent':",["Parsimonious","Generous","Lavish","Bountiful"],"A","Munificent means very generous; parsimonious (extremely stingy) is the opposite.",Y_VOC),
 E("Antonyms","Difficult",GP,None,[],"Antonym of 'Sagacious':",["Foolish","Wise","Shrewd","Astute"],"A","Sagacious means wise and discerning; foolish is the opposite, while shrewd and astute are near-synonyms.",Y_VOC),
 E("Antonyms","Difficult",GP,None,[],"Antonym of 'Garrulous':",["Talkative","Taciturn","Cheerful","Rude"],"B","Garrulous means excessively talkative; taciturn means habitually silent.",Y_VOC),
 E("Analogies","Moderate",GP,None,[],"SCULPTOR : STATUE ::",["Chef : Recipe","Author : Novel","Doctor : Patient","Pilot : Aircraft"],"B","A sculptor creates a statue as an author creates a novel (creator : creation).",Y_AN),
 E("Analogies","Moderate",GP,None,[],"HOT : SCORCHING ::",["Cold : Freezing","Big : Small","Fast : Slow","Happy : Sad"],"A","Scorching is an extreme degree of hot, as freezing is of cold.",Y_AN),
 E("Analogies","Easy",GP,None,[],"PAGE : BOOK ::",["Tile : Floor","Word : Letter","Wheel : Road","Sun : Moon"],"A","A page is a part of a book as a tile is a part of a floor (part : whole).",Y_AN),
 E("Sentence Completion","Moderate",GP,None,[],"Despite the minister's ______ promises, nothing changed in the district.",["Hollow","Sincere","Practical","Reluctant"],"A","'Despite ... nothing changed' signals empty promises; 'hollow' fits.",Y_VOC),
 E("Sentence Completion","Easy",GP,None,[],"Her ______ remarks during the meeting offended several colleagues.",["Tactless","Tactful","Gracious","Prudent"],"A","Remarks that offend are tactless.",Y_VOC),
 E("Sentence Completion","Easy",GP,None,[],"The committee's decision was ______; no member voted against it.",["Unanimous","Contentious","Ambiguous","Tentative"],"A","Unanimous means agreed by all.",Y_VOC),
 E("Idioms","Moderate",GP,None,[],"'To bite the bullet' means:",
   ["To face something unpleasant with courage","To eat very quickly","To speak harshly","To lose a bet"],"A","The idiom means to endure a painful or difficult situation bravely.",Y_IDIOM),
 E("Idioms","Easy",GP,None,[],"'A blessing in disguise' means:",
   ["A misfortune that turns out to be beneficial","A hidden curse","A prayer said in secret","A costume party"],"A","It describes something that seems bad at first but proves good.",Y_IDIOM),
 E("Idioms","Easy",GP,None,[],"'Once in a blue moon' means:",["Very rarely","Every month","Only at night","Very frequently"],"A","The idiom means something that happens very rarely.",Y_IDIOM),
 E("Prepositions","Easy",GP,None,[],"She has been absent ______ school for three days.",["from","of","to","at"],"A","'Absent from' is the correct collocation.",Y_PREP),
 E("Prepositions","Moderate",GP,None,[],"The minister insisted ______ an immediate inquiry.",["on","for","to","at"],"A","'Insist on' is the correct collocation.",Y_PREP),
 E("Prepositions","Moderate",GP,None,[],"He is senior ______ me by two years.",["to","than","from","over"],"A","'Senior to' (not 'than') is used with comparatives of Latin origin such as senior, junior, superior, inferior.",Y_PREP),
 E("One-word Substitution","Moderate",GP,None,[],"A person who hates mankind is called:",["A misogynist","A philanthropist","A misanthrope","A pessimist"],"C","Misanthrope = hater of mankind; misogynist = hater of women; philanthropist = lover of mankind.",Y_AN),
 E("One-word Substitution","Moderate",GP,None,[],"Government by a small group of powerful people is called:",["Democracy","Oligarchy","Autocracy","Theocracy"],"B","Oligarchy = rule by a few. Autocracy = rule by one; theocracy = rule by religious authority.",Y_AN),
 E("One-word Substitution","Easy",GP,None,[],"A person who knows everything is called:",["Omniscient","Omnipotent","Omnivorous","Omnipresent"],"A","Omniscient = all-knowing; omnipotent = all-powerful; omnipresent = present everywhere.",Y_AN),
 E("Grammar","Moderate",GP,None,[],"Choose the grammatically correct sentence.",
   ["Each of the students have submitted their assignment.","Each of the students has submitted his or her assignment.","Each of the student has submitted his assignment.","Each of the students are submitting his assignment."],"B",
   "'Each' takes a singular verb and pronoun: 'has submitted his or her assignment'.",Y_GRAM),
 E("Conditionals","Moderate",GP,None,[],"If I had known about the delay, I ______ earlier.",["will leave","would have left","would leave","had left"],"B","Third conditional: 'if + past perfect, would have + past participle'.",Y_GRAM),
 E("Subject-Verb Agreement","Moderate",GP,None,[],"Neither the manager nor the employees ______ aware of the change.",["was","were","is","has been"],"B","With 'neither ... nor' the verb agrees with the nearer subject, 'employees' (plural).",Y_GRAM),
 E("Voice","Moderate",GP,None,[],"Choose the correct passive form of 'They are building a new bridge.'",
   ["A new bridge is being built by them.","A new bridge was being built by them.","A new bridge has been built by them.","A new bridge is built by them."],"A","Present continuous passive: 'is/are being + past participle'.",Y_GRAM),
 # comprehension (5)
 E("Comprehension","Moderate",GP,None,[],"The main idea of the passage is that:",
   ["Pakistan's water scarcity calls for a package of reforms rather than a single solution","Dams are the only remedy for water shortage","Population growth is the sole cause of water scarcity","The provinces are already in open conflict over water"],"A",
   "The passage says no single dam can solve the problem and lists several combined measures.",Y_COMP,GN,PASSAGE),
 E("Comprehension","Moderate",GP,None,[],"According to the passage, which of the following is NOT one of the measures experts recommend?",
   ["Lining leaking canals","Adopting drip irrigation","Recycling urban wastewater","Building one large dam as the sole remedy"],"D",
   "The passage rejects the idea that a single dam can solve the problem; the other three are listed as recommended.",Y_COMP,GN,PASSAGE),
 E("Comprehension","Moderate",GP,None,[],"The word 'contiguous' as used in the passage most nearly means:",
   ["Connected","Ancient","Temporary","Costly"],"A","'Contiguous canal network' means a network whose parts are connected or touching.",Y_COMP,GN,PASSAGE),
 E("Comprehension","Moderate",GP,None,[],"The author's tone in the passage is best described as:",
   ["Hostile","Concerned but constructive","Indifferent","Humorous"],"B","The author warns about the problem and also lists practical remedies.",Y_COMP,GN,PASSAGE),
 E("Comprehension","Easy",GP,None,[],"The passage suggests that unchecked water scarcity could:",
   ["Slow economic growth and cause disputes between provinces","Improve harvests","End the need for irrigation","Reduce the population quickly"],"A","The last sentence says scarcity will become a drag on growth and a source of conflict between provinces.",Y_COMP,GN,PASSAGE),
]
assert len(items) == 50, len(items)
