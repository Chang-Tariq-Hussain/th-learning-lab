from helpers import q, qf
E = "English"
rows = [
# ---- Tenses
q("PJ",E,"Tenses","e","She ___ to school every day.","goes",["go","going","gone"],"A singular third-person subject takes -s in the simple present: she goes."),
q("PJ",E,"Tenses","e","They ___ football when it started to rain.","were playing",["are playing","have played","play"],"A past continuous action was in progress when another past action interrupted it."),
q("P",E,"Tenses","e","I ___ my homework yesterday.","finished",["finish","will finish","am finishing"],"'Yesterday' signals the simple past: finished."),
q("PJ",E,"Tenses","m","By the time we reached the station, the train ___.","had left",["has left","leaves","was leaving"],"The train left before we arrived, so the earlier past action takes the past perfect."),
q("PJ",E,"Tenses","m","He ___ in this city since 2015.","has lived",["lived","is living","lives"],"'Since 2015' with an action continuing to now needs the present perfect: has lived."),
q("J",E,"Tenses","m","This time next week, we ___ on the beach.","will be lying",["will lie","are lying","have lain"],"An action in progress at a future time uses the future continuous."),
q("JS",E,"Tenses","d","By next June, she ___ here for ten years.","will have worked",["will work","has worked","would work"],"A period completed by a future time uses the future perfect: will have worked."),
q("JS",E,"Tenses","d","If I ___ the answer, I would tell you.","knew",["know","had known","will know"],"A second-conditional sentence (unreal present) uses the simple past in the if-clause."),
# ---- Articles
q("PJ",E,"Articles","e","She is ___ honest girl.","an",["a","the","no article"],"'Honest' begins with a vowel sound (the h is silent), so 'an' is used."),
q("PJ",E,"Articles","e","He bought ___ umbrella.","an",["a","the","no article"],"'Umbrella' begins with a vowel sound, so we use 'an'."),
q("P",E,"Articles","e","___ sun rises in the east.","The",["A","An","No article"],"There is only one sun, so we use 'the'."),
q("PJ",E,"Articles","m","He is ___ European tourist.","a",["an","the","no article"],"'European' begins with a /j/ sound, so 'a' is used."),
q("J",E,"Articles","m","Fill the blanks: '___ Quetta is ___ capital of Balochistan.'","no article ... the",["the ... a","a ... the","the ... the"],"The name of a city takes no article, while 'the capital' is a specific, unique one."),
q("JS",E,"Articles","d","He is one of ___ most respected teachers in ___ town.","the ... the",["a ... the","the ... a","an ... a"],"A superlative takes 'the', and 'the town' refers to a particular town known to both speakers."),
# ---- Prepositions
q("PJ",E,"Prepositions","e","The book is ___ the table.","on",["in","at","by"],"A book resting on a surface is 'on' the table."),
q("PJ",E,"Prepositions","e","She is afraid ___ dogs.","of",["from","at","with"],"'Afraid of' is the correct collocation."),
q("P",E,"Prepositions","e","We will meet ___ Monday.","on",["at","in","by"],"Days of the week take 'on'."),
q("PJ",E,"Prepositions","m","He has been waiting ___ two hours.","for",["since","from","during"],"'For' is used with a length of time; 'since' needs a starting point."),
q("PJ",E,"Prepositions","m","The thief was caught ___ the police.","by",["from","with","to"],"The agent of a passive action is introduced by 'by'."),
q("J",E,"Prepositions","m","She is good ___ mathematics.","at",["in","on","for"],"We say 'good at' a subject or skill."),
q("JS",E,"Prepositions","d","The teacher insisted ___ punctuality.","on",["at","for","with"],"'Insist on' is the correct collocation."),
# ---- Pronouns
q("PJ",E,"Pronouns","e","Ali and ___ went to the market.","I",["me","my","mine"],"'Ali and I' is the subject of the sentence, so the subject pronoun is used."),
q("P",E,"Pronouns","e","This pen belongs to me. It is ___ .","mine",["my","me","I"],"A possessive pronoun that stands alone is 'mine'."),
q("PJ",E,"Pronouns","m","The teacher gave the prize to Sara and ___.","her",["she","hers","herself"],"After a preposition ('to Sara and ...') the object pronoun 'her' is used."),
q("J",E,"Pronouns","m","The dog wagged ___ tail happily.","its",["it's","his","their"],"'Its' (no apostrophe) is the possessive of 'it'; 'it's' means 'it is'."),
q("JS",E,"Pronouns","d","He blamed ___ for the failure.","himself",["him","his","he"],"The subject and object are the same person, so the reflexive 'himself' is used."),
# ---- Adjectives / Adverbs
q("PJ",E,"Adjectives","e","Choose the comparative form: 'This box is ___ than that one.'","heavier",["heavy","heaviest","more heavy"],"One-syllable-like adjectives ending in -y form the comparative with -ier: heavier."),
q("PJ",E,"Adjectives","m","Choose the correct sentence.","She is the tallest girl in the class.",["She is the taller girl in the class.","She is most tall girl in the class.","She is tallest girl of the class."],"A superlative needs 'the' and the -est form: the tallest."),
q("J",E,"Adjectives","d","Choose the correct sentence.","Of the two brothers, Hamza is the elder.",["Of the two brothers, Hamza is the eldest.","Of the two brothers, Hamza is more elder.","Of the two brothers, Hamza is the oldest one."],"For comparing two people, the comparative 'elder' is used."),
q("PJ",E,"Adverbs","e","He runs very ___.","fast",["fastly","faster than","more fastly"],"'Fast' is both an adjective and an adverb; 'fastly' is not a word."),
q("PJ",E,"Adverbs","m","She sings ___.","beautifully",["beautiful","beauty","beautify"],"An adverb is needed to describe the verb 'sings'."),
q("J",E,"Adverbs","d","Choose the correct sentence.","He hardly ever eats sweets.",["He hardly never eats sweets.","He hardly eats never sweets.","He eats hardly never sweets."],"'Hardly' already has a negative sense, so it cannot be combined with 'never'."),
# ---- Subject-verb agreement
q("PJ",E,"Subject-Verb Agreement","e","The boys ___ playing in the garden.","are",["is","was","has"],"A plural subject takes 'are'."),
q("PJ",E,"Subject-Verb Agreement","m","Neither Ali nor his friends ___ present.","were",["was","is","has been"],"With 'neither ... nor' the verb agrees with the nearer subject (friends, plural)."),
q("PJ",E,"Subject-Verb Agreement","m","The news ___ good today.","is",["are","were","have been"],"'News' is an uncountable noun and takes a singular verb."),
q("J",E,"Subject-Verb Agreement","m","One of my cousins ___ a doctor.","is",["are","were","have been"],"The subject is 'one', which is singular."),
q("JS",E,"Subject-Verb Agreement","d","The number of students ___ increasing every year.","is",["are","have been","were"],"'The number of' takes a singular verb, unlike 'a number of'."),
q("JS",E,"Subject-Verb Agreement","d","A number of students ___ absent today.","are",["is","was","has been"],"'A number of' means 'several' and takes a plural verb."),
# ---- Sentence correction / error detection
q("PJ",E,"Sentence Correction","e","Choose the correct sentence.","She doesn't like tea.",["She don't like tea.","She not like tea.","She doesn't likes tea."],"With a singular subject the auxiliary is 'doesn't', followed by the base verb."),
q("PJ",E,"Sentence Correction","m","Choose the correct sentence.","He has gone to the market.",["He have gone to the market.","He is gone to the market yesterday.","He has went to the market."],"The present perfect is 'has' plus the past participle 'gone'."),
q("J",E,"Sentence Correction","m","Choose the correct sentence.","Each of the students has finished the test.",["Each of the students have finished the test.","Each of the students are finishing the test.","Each of students has finish the test."],"'Each' is singular and needs 'has' plus a past participle."),
q("JS",E,"Sentence Correction","d","Choose the sentence that is grammatically correct.","Having finished his work, he went home.",["Having finished his work, the bell rang.","Finished his work, he went home.","Having finish his work, he went home."],"The participle phrase must describe the subject of the main clause ('he'); in the first option the bell did not finish the work."),
qf("J",E,"Error Detection","m","Find the part with an error: 'He is | one of the best player | in the school.'",["He is","one of the best player","in the","school"],1,"After 'one of the' the noun must be plural: 'one of the best players'."),
qf("JS",E,"Error Detection","d","Find the part with an error: 'The furniture | in the room | were | very old.'",["The furniture","in the room","were","very old"],2,"'Furniture' is an uncountable noun and takes a singular verb: 'was'."),
# ---- Voice / narration
q("PJ",E,"Active and Passive Voice","e","Change to passive: 'Ali wrote a letter.'","A letter was written by Ali.",["A letter is written by Ali.","A letter has written by Ali.","A letter wrote by Ali."],"Simple past active becomes 'was/were + past participle' in the passive."),
q("PJ",E,"Active and Passive Voice","m","Change to passive: 'They are building a bridge.'","A bridge is being built by them.",["A bridge is built by them.","A bridge was being built by them.","A bridge has been built by them."],"Present continuous active becomes 'is/are being + past participle'."),
q("J",E,"Active and Passive Voice","d","Change to active: 'The window was broken by the boy.'","The boy broke the window.",["The boy has broken the window.","The boy breaks the window.","The boy was breaking the window."],"The past simple passive 'was broken' corresponds to the past simple active 'broke'."),
q("PJ",E,"Direct and Indirect Speech","e","Change to indirect speech: He said, \"I am happy.\"","He said that he was happy.",["He said that he is happy.","He said that I was happy.","He says that he was happy."],"In reported speech the present tense moves back to the past and the pronoun changes to match."),
q("PJ",E,"Direct and Indirect Speech","m","Change to indirect speech: She said, \"I will come tomorrow.\"","She said that she would come the next day.",["She said that she will come tomorrow.","She said that I would come the next day.","She said that she would come tomorrow."],"'Will' becomes 'would' and 'tomorrow' becomes 'the next day' in reported speech."),
q("J",E,"Narration","d","Change to indirect speech: He said to me, \"Where do you live?\"","He asked me where I lived.",["He told me where do I live.","He asked me where did I live.","He asked me that where I lived."],"A reported question uses 'asked', normal word order and a back-shifted tense, with no question mark."),
# ---- Parts of speech
q("PJ",E,"Parts of Speech","e","In the sentence 'The quick fox jumps', the word 'quick' is a(n):","adjective",["noun","verb","adverb"],"'Quick' describes the noun 'fox'."),
q("PJ",E,"Parts of Speech","e","Which word is a conjunction?","but",["slowly","table","under"],"'But' joins words or clauses."),
q("P",E,"Parts of Speech","e","Which word is a noun?","happiness",["happy","happily","happier"],"'Happiness' names a feeling, so it is a noun."),
q("PJ",E,"Parts of Speech","m","In 'She sings sweetly', the word 'sweetly' is a(n):","adverb",["adjective","noun","preposition"],"It describes how she sings, so it is an adverb of manner."),
q("J",E,"Parts of Speech","m","In the sentence 'Wow! That was a great match', 'Wow' is a(n):","interjection",["conjunction","pronoun","adverb"],"An interjection expresses sudden emotion."),
# ---- Sentence completion
q("PJ",E,"Sentence Completion","e","We were late ___ the heavy traffic.","because of",["because","although","so that"],"'Because of' is followed by a noun phrase (the heavy traffic)."),
q("PJ",E,"Sentence Completion","m","___ he was tired, he finished the work.","Although",["Because","Unless","Since"],"The two ideas contrast, so 'although' is needed."),
q("J",E,"Sentence Completion","m","You will fail ___ you work harder.","unless",["if","although","because"],"'Unless' means 'if ... not': you will fail if you do not work harder."),
q("JS",E,"Sentence Completion","d","The speaker was so ___ that the audience understood every word.","articulate",["inaudible","hesitant","evasive"],"Articulate means expressing ideas clearly, which suits the result described."),
]
