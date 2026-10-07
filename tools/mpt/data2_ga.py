"""Mock 2 - General Abilities (60). Numbers are fresh (not in Mock 1); every key is re-computed in verify_math2.py."""
import random
from helpers2 import *
GA = "General Abilities"
Y = {
 "pct":"Percentage problems appear in all four parsed papers (2022, 2023, 2025, 2026; about 18 by keyword count).",
 "ratio":"Ratio/proportion items appear in all four parsed papers (2022-2026).",
 "tw":"Time-and-work / pipes appear in 2026; speed-distance in 2023 and 2026 (small counts, standard FPSC arithmetic).",
 "pl":"Profit/loss and interest appear in 2025 (profit) and 2023/2025 (interest).",
 "avg":"Averages appear in all four parsed papers (about 13 by keyword count).",
 "age":"Age problems appear in 2022, 2023, 2025 and 2026.",
 "men":"Mensuration appears in 2022, 2023 and 2026 (about 14 by keyword count).",
 "alg":"Algebra/indices/number theory appear in every parsed paper.",
 "set":"Sets/Venn items appear in 2022, 2023, 2025 and 2026.",
 "prob":"Probability/permutations appear in 2023 and 2026.",
 "ser":"Number/letter series appear in 2022, 2023 and 2026.",
 "cod":"Coding-decoding appears in 2023.",
 "rel":"Blood relations and directions are the most repeated reasoning type (about 35 by keyword count; 2026 has 13).",
 "log":"Syllogism/ranking/calendar/clock reasoning are standard FPSC reasoning patterns.",
}
# (key, topic, difficulty, stem, correct, [3 wrong], explanation)
R = [
 ("pl","Profit & Loss","Moderate","A shopkeeper marks an article 25% above its cost price and then allows a discount of 12%. His gain percent is:","10%",["8%","13%","12%"],"Let CP = 100. Marked price = 125; selling price = 125 × 0.88 = 110. Gain = 10%."),
 ("pct","Percentages","Moderate","The price of sugar rises by 20%. By what percent must a household cut its consumption so that its expenditure stays the same?","16 2/3%",["20%","15%","25%"],"Consumption must become 1/1.2 = 5/6 of the old; reduction = 1/6 = 16 2/3%."),
 ("pct","Percentages","Easy","In an election between two candidates the winner got 58% of the 7,500 valid votes. The winning margin is:","1,200",["1,125","1,350","900"],"Loser has 42%. Margin = 16% of 7,500 = 1,200."),
 ("pct","Percentages","Moderate","If A's salary is 25% more than B's, then B's salary is less than A's by:","20%",["25%","16%","15%"],"B = 100, A = 125. Difference 25 is 25/125 = 20% of A."),
 ("pct","Percentages","Moderate","A town's population grew from 40,000 to 44,100 in two years at the same percentage rate each year. The annual rate is:","5%",["4%","6%","5.5%"],"44,100/40,000 = 1.1025 = (1.05)², so the rate is 5% per year."),
 ('alg', 'Number Theory', 'Difficult', 'Find the remainder when 2^50 is divided by 7.', '4', ['1', '2', '6'], '2³ = 8 ≡ 1 (mod 7). 50 = 3 × 16 + 2, so 2^50 ≡ 2² = 4.'),
 ("ratio","Ratio & Proportion","Easy","Rs 1,260 is divided among A, B and C in the ratio 2 : 3 : 4. B's share is:","Rs 420",["Rs 360","Rs 560","Rs 315"],"One part = 1,260/9 = 140; B gets 3 × 140 = 420."),
 ("ratio","Ratio & Proportion","Moderate","If a : b = 3 : 4 and b : c = 6 : 7, then a : b : c is:","9 : 12 : 14",["3 : 4 : 7","3 : 8 : 7","6 : 8 : 7"],"Make b equal: a : b = 9 : 12 and b : c = 12 : 14, so a : b : c = 9 : 12 : 14."),
 ("ratio","Mixtures","Moderate","A 40-litre mixture contains milk and water in the ratio 3 : 1. How much water must be added to make the ratio 3 : 2?","10 litres",["5 litres","15 litres","20 litres"],"Milk = 30 L, water = 10 L. For 3 : 2 water must be 20 L, so add 10 L."),
 ("ratio","Ratio & Proportion","Easy","The sum of two numbers is 84 and their ratio is 5 : 7. The smaller number is:","35",["30","42","49"],"One part = 84/12 = 7; smaller = 5 × 7 = 35."),
 ("ratio","Variation","Easy","12 men can build a wall in 15 days. How many days will 20 men take to build it?","9",["8","10","25"],"Man-days = 12 × 15 = 180; 180/20 = 9 days."),
 ('tw', 'Time & Work', 'Moderate', 'A can do a piece of work in 15 days and B in 10 days. They work together for 4 days. The fraction of the work still left is:', '1/3', ['1/4', '2/5', '1/6'], 'Together they do 1/15 + 1/10 = 1/6 of the work per day; in 4 days 2/3 is done, so 1/3 is left.'),
 ("tw","Time & Work","Moderate","A and B together can finish a task in 6 days, and A alone can finish it in 10 days. B alone can finish it in:","15 days",["12 days","16 days","4 days"],"B's rate = 1/6 − 1/10 = 1/15, so 15 days."),
 ("tw","Pipes & Cisterns","Moderate","Pipe A fills a tank in 20 minutes and pipe B empties it in 30 minutes. If both are opened together, the empty tank is filled in:","60 minutes",["50 minutes","10 minutes","25 minutes"],"Net rate = 1/20 − 1/30 = 1/60 per minute, so 60 minutes."),
 ('tw', 'Time & Work', 'Difficult', '3 men or 6 women can finish a job in 20 days. How many days will 2 men and 4 women together take?', '15 days', ['12 days', '18 days', '10 days'], '1 man = 2 women, so 2 men + 4 women = 8 women. 6 women take 20 days (120 woman-days), so 8 women take 15 days.'),
 ("tw","Speed & Distance","Easy","A 150-metre-long train passes a pole in 10 seconds. Its speed in km/h is:","54",["45","60","15"],"Speed = 150/10 = 15 m/s = 15 × 3.6 = 54 km/h."),
 ("tw","Speed & Distance","Moderate","A man goes from A to B at 40 km/h and returns at 60 km/h. His average speed for the whole journey is:","48 km/h",["50 km/h","52 km/h","45 km/h"],"Average speed = 2 × 40 × 60/(40 + 60) = 48 km/h."),
 ("tw","Speed & Distance","Difficult","Two trains 120 m and 180 m long run in opposite directions at 54 km/h and 36 km/h. They take how many seconds to cross each other completely?","12",["10","15","20"],"Relative speed = 90 km/h = 25 m/s; distance = 300 m; time = 300/25 = 12 s."),
 ("pl","Profit & Loss","Moderate","An article sold for Rs 1,540 gives a profit of 12%. Its cost price is:","Rs 1,375",["Rs 1,355","Rs 1,400","Rs 1,452"],"CP = 1,540/1.12 = 1,375."),
 ("pl","Simple Interest","Easy","The simple interest on Rs 8,000 at 7.5% per annum for 4 years is:","Rs 2,400",["Rs 2,000","Rs 2,800","Rs 3,000"],"SI = 8,000 × 7.5 × 4/100 = 2,400."),
 ("pl","Compound Interest","Moderate","The compound interest on Rs 10,000 at 10% per annum for 2 years (compounded annually) is:","Rs 2,100",["Rs 2,000","Rs 2,200","Rs 2,310"],"Amount = 10,000 × 1.1² = 12,100; CI = 2,100."),
 ('alg', 'Number Theory', 'Difficult', 'How many integers from 1 to 100 are divisible by 3 or by 5?', '47', ['53', '40', '33'], '33 multiples of 3 + 20 multiples of 5 − 6 multiples of 15 = 47.'),
 ('avg', 'Averages', 'Moderate', 'The average of 11 numbers is 60. The average of the first six is 58 and of the last six is 63. The sixth number is:', '66', ['60', '62', '68'], 'The two groups together count the sixth number twice: 6 × 58 + 6 × 63 = 726. The total of all 11 is 660, so the sixth number = 726 − 660 = 66.'),
 ("avg","Averages","Moderate","The average age of 30 students in a class is 14 years. When the teacher's age is included, the average rises by 1 year. The teacher's age is:","45 years",["40 years","44 years","46 years"],"Total with teacher = 31 × 15 = 465; students = 420; teacher = 45."),
 ('alg', 'Permutations', 'Moderate', "How many different arrangements can be made from all the letters of the word 'LEVEL'?", '30', ['60', '120', '20'], '5!/(2! × 2!) = 120/4 = 30, since L and E each occur twice.'),
 ("age","Ages","Moderate","The present ages of A and B are in the ratio 5 : 7. After 6 years the ratio will be 3 : 4. A's present age is:","30 years",["25 years","35 years","42 years"],"(5x + 6)/(7x + 6) = 3/4 gives 20x + 24 = 21x + 18, x = 6; A = 30."),
 ("age","Ages","Moderate","A father is three times as old as his son. After 12 years he will be twice as old as his son. The son's present age is:","12 years",["10 years","15 years","18 years"],"3x + 12 = 2(x + 12) gives x = 12."),
 ("age","Ages","Moderate","Five years ago a mother was four times as old as her daughter. The sum of their present ages is 55 years. The daughter's present age is:","14 years",["12 years","15 years","10 years"],"(55 − d − 5) = 4(d − 5) gives 70 = 5d, d = 14."),
 ("men","Mensuration","Easy","The perimeter of a rectangle is 56 m and its length is 16 m. Its area is:","192 m²",["224 m²","256 m²","128 m²"],"Width = 28 − 16 = 12 m; area = 16 × 12 = 192 m²."),
 ("men","Mensuration","Moderate","If the radius of a circle is increased by 10%, its area increases by:","21%",["10%","20%","11%"],"Area scales by 1.1² = 1.21, an increase of 21%."),
 ('men', 'Mensuration', 'Difficult', 'The radii of two cylinders are in the ratio 2 : 3 and their heights in the ratio 5 : 3. The ratio of their volumes is:', '20 : 27', ['10 : 9', '5 : 9', '4 : 9'], 'Volume ∝ r²h = (4 × 5) : (9 × 3) = 20 : 27.'),
 ("men","Mensuration","Moderate","The diagonal of a square is 10√2 cm. Its area is:","100 cm²",["50 cm²","200 cm²","400 cm²"],"Side = diagonal/√2 = 10 cm; area = 100 cm²."),
 ("alg","Algebra","Moderate","If x + 1/x = 5, then x² + 1/x² equals:","23",["25","27","21"],"x² + 1/x² = (x + 1/x)² − 2 = 25 − 2 = 23."),
 ("alg","Algebra","Easy","If x = 2 is a root of x² − 5x + k = 0, then k equals:","6",["4","−6","10"],"4 − 10 + k = 0, so k = 6."),
 ('tw', 'Time & Work', 'Difficult', 'A and B together can do a job in 10 days, B and C together in 15 days, and A and C together in 12 days. All three working together will finish it in:', '8 days', ['7.5 days', '9 days', '10 days'], '2(A + B + C) = 1/10 + 1/15 + 1/12 = 15/60 = 1/4, so A + B + C = 1/8 per day: 8 days.'),
 ('pl', 'Compound Interest', 'Moderate', 'Rs 5,000 is invested at 20% per annum compounded half-yearly. The amount after 1 year is:', 'Rs 6,050', ['Rs 6,000', 'Rs 6,200', 'Rs 6,100'], 'Rate per half-year = 10%, 2 periods: 5,000 × 1.1² = 6,050.'),
 ('alg', 'Number Theory', 'Moderate', 'The HCF and LCM of two numbers are 12 and 360. If one of the numbers is 72, the other number is:', '60', ['48', '90', '120'], 'Product of numbers = HCF × LCM = 4,320; 4,320/72 = 60.'),
 ('prob', 'Probability', 'Difficult', 'A bag has 5 red and 3 blue balls. Two balls are drawn at random without replacement. The probability that both are red is:', '5/14', ['25/64', '5/16', '3/14'], 'P = (5/8) × (4/7) = 20/56 = 5/14.'),
 ('log', 'Clock', 'Difficult', 'In 12 hours, how many times do the hour and minute hands of a clock coincide?', '11', ['10', '12', '22'], "The hands coincide every 12/11 hours, so 11 times in 12 hours (the 12 o'clock coincidence is counted once)."),
 ("alg","Number Theory","Moderate","How many prime numbers lie between 20 and 50?","7",["6","8","9"],"23, 29, 31, 37, 41, 43, 47 = 7 primes."),
 ("set","Sets & Venn","Moderate","In a group of 100 students, 60 like tea, 45 like coffee and 15 like both. How many like neither?","10",["5","15","20"],"Either = 60 + 45 − 15 = 90; neither = 100 − 90 = 10."),
 ("set","Sets & Venn","Easy","If n(A) = 25, n(B) = 18 and n(A ∪ B) = 35, then n(A ∩ B) is:","8",["7","10","43"],"n(A ∩ B) = 25 + 18 − 35 = 8."),
 ("prob","Probability","Moderate","A card is drawn at random from a standard pack of 52. The probability that it is a king or a heart is:","4/13",["17/52","1/4","3/13"],"4 kings + 13 hearts − 1 king of hearts = 16; 16/52 = 4/13."),
 ("prob","Probability","Moderate","Two fair dice are rolled. The probability that the sum is 8 is:","5/36",["1/6","7/36","1/9"],"Favourable: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 of 36."),
 ("prob","Permutations","Moderate","How many 3-letter arrangements can be formed from the letters of 'LAHORE' without repetition?","120",["216","60","720"],"All six letters are different: 6P3 = 6 × 5 × 4 = 120."),
 ("ser","Series","Easy","Find the next term: 2, 6, 12, 20, 30, ?","42",["40","36","44"],"Terms are n(n+1): 1·2, 2·3, ..., next 6·7 = 42."),
 ('ser', 'Series', 'Moderate', 'Find the next term: 1, 2, 6, 24, 120, ?', '720', ['600', '240', '840'], 'Each term is the previous one multiplied by 2, 3, 4, 5 (factorials 1!, 2!, 3!, 4!, 5!), so the next is 120 × 6 = 720.'),
 ('pl', 'Compound Interest', 'Difficult', 'The difference between the compound interest and the simple interest on Rs 20,000 at 5% per annum for 2 years is:', 'Rs 50', ['Rs 25', 'Rs 100', 'Rs 500'], 'Difference for 2 years = P(r/100)² = 20,000 × 0.0025 = 50.'),
 ("cod","Coding-Decoding","Moderate","If 'PAKISTAN' is coded as 'QBLJTUBO', then 'LAHORE' is coded as:","MBIPSF",["KZGNQD","MBIPRF","MCIPSF"],"Each letter is moved one place forward: L→M, A→B, H→I, O→P, R→S, E→F."),
 ("rel","Blood Relations","Moderate","Pointing to a man, Sara says, 'He is the son of my mother's only brother.' The man is Sara's:","Maternal cousin",["Brother","Paternal uncle","Nephew"],"Her mother's brother is her maternal uncle; his son is her maternal cousin."),
 ("rel","Blood Relations","Moderate","A is B's sister. C is B's mother. D is C's father. How is A related to D?","Granddaughter",["Daughter","Niece","Great-granddaughter"],"A is also C's daughter; D is C's father, so A is D's granddaughter."),
 ("rel","Directions","Easy","Ali walks 5 km north, then 3 km east and then 5 km south. His distance and direction from the starting point are:","3 km east",["3 km west","13 km north","8 km east"],"The north and south legs cancel; only the 3 km east remains."),
 ("rel","Directions","Moderate","A man faces north. He turns 90° to the right, then 180°, and then 90° to the left. He now faces:","South",["North","East","West"],"North → (right) East → (180°) West → (left) South."),
 ("rel","Directions","Difficult","Facing east, Ahmed turns left and walks 4 km, turns left again and walks 6 km, then turns right and walks 4 km. His distance from the starting point is:","10 km",["14 km","8 km","6 km"],"Taking east as +x and north as +y: (0,4), then (−6,4), then (−6,8). Distance = √(36 + 64) = 10 km."),
 ("log","Syllogism","Moderate","Statements: All doctors are graduates. Some graduates are teachers. Conclusions: I. Some doctors are teachers. II. Some teachers are graduates.","Only conclusion II follows",["Only conclusion I follows","Both I and II follow","Neither I nor II follows"],"'Some graduates are teachers' converts to 'some teachers are graduates' (II). The overlap of doctors and teachers is not established, so I does not follow."),
 ('men', 'Mensuration', 'Difficult', 'A cube of side 6 cm is painted on all faces and then cut into 1 cm cubes. How many small cubes have exactly two faces painted?', '48', ['24', '36', '64'], 'Each of the 12 edges has 6 − 2 = 4 such cubes: 12 × 4 = 48.'),
 ("log","Calendar","Moderate","If 5 March 2026 was a Thursday, then 5 April 2026 was a:","Sunday",["Saturday","Friday","Monday"],"March has 31 days, so 31 days later: 31 mod 7 = 3, Thursday + 3 = Sunday."),
 ("log","Clock","Moderate","The angle between the hands of a clock at 3:40 is:","130°",["120°","140°","150°"],"Hour hand = 3 × 30 + 40 × 0.5 = 110°; minute hand = 40 × 6 = 240°; difference = 130°."),
 ("ratio","Unitary Method","Easy","If 2.5 kg of rice costs Rs 900, the cost of 4 kg is:","Rs 1,440",["Rs 1,350","Rs 1,500","Rs 1,260"],"Price per kg = 360; 4 × 360 = 1,440."),
]
assert len(R)==59, len(R)
rng = random.Random(2027)
letters = list("ABCD"*15)[:59]; rng.shuffle(letters)
items = []
for n,(key,topic,diff,stem,correct,wrongs,expl) in enumerate(R):
    L = letters[n]; none = (n % 4 == 0)   # about a quarter of items use FPSC-style 'None of these'
    if none:
        if L == "D":
            opts = wrongs[:3] + ["None of these"]; expl2 = expl + " The correct value is not listed, so the answer is 'None of these'."
            stem2 = stem; ans = "D"
            assert correct not in wrongs
        else:
            idx = "ABC".index(L); lst = wrongs[:2]; lst.insert(idx, correct); opts = lst + ["None of these"]; ans = L; expl2 = expl; stem2 = stem
    else:
        idx = "ABCD".index(L); lst = list(wrongs); lst.insert(idx, correct); opts = lst; ans = L; expl2 = expl; stem2 = stem
    items.append(q(GA, topic, diff, GP, None, [], stem2, opts, ans, expl2, Y[key], "Generated for this mock; fresh numbers.", verif="Generated; answer re-computed in verify_math2.py."))
# past-paper coding item (2023), fixed order as printed
items.insert(48, q(GA,"Coding-Decoding","Moderate",VP,2023,[],
  "If BAT is coded as 283, CAT is coded as 383 and ARE is coded as 801, then the code for BETTER is:",
  ["213303","213310","123301","012331"],"B",
  "From the codes: B = 2, A = 8, T = 3, C = 3, R = 0, E = 1. So BETTER = 2 1 3 3 1 0 = 213310.",
  Y["cod"],"Appears in the uploaded 2023 Special reproduction (third-party); answer independently re-derived.",
  verif="Appears in an uploaded third-party reproduction; code re-derived and re-computed in verify_math2.py."))
assert len(items)==60
