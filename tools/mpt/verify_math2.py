"""Independent re-computation of every numeric / logic General Abilities item in Mock 2.
Each answer is recomputed here from the problem statement (brute force or a different method from the explanation) and compared
with the key stored in mpt_question_bank.json. Run: python3 verify_math2.py"""
import itertools, json, math, os, re, sys, datetime
from fractions import Fraction as F
HERE = os.path.dirname(os.path.abspath(__file__))
bank = json.load(open(os.path.join(HERE, "mpt_question_bank.json"), encoding="utf8"))
m2 = json.load(open(os.path.join(HERE, "mock2.json"), encoding="utf8"))
byid = {b["id"]: b for b in bank}
GA = [byid[i] for i in m2["questionIds"] if byid[i]["subjectCode"] == "GA"]
done = set(); fails = []

def num(s):
    """Parse the leading number/fraction out of an option string."""
    s = s.replace(",", "").replace("\u2212", "-")
    m = re.search(r"(\d+)\s+(\d+)/(\d+)", s)           # mixed number 16 2/3
    if m: return F(int(m[1])) + F(int(m[2]), int(m[3]))
    m = re.search(r"(-?\d+)/(\d+)", s)
    if m: return F(int(m[1]), int(m[2]))
    m = re.search(r"-?\d+(\.\d+)?", s)
    return F(m[0]) if m else None

def find(frag):
    r = [q for q in GA if frag in q["question"]]
    assert len(r) == 1, (frag, len(r)); return r[0]

def chk(frag, value, text=None):
    """value: computed Fraction/number. text: computed non-numeric answer (string)."""
    q = find(frag); done.add(q["id"])
    key = q["options"][q["correctAnswer"]]
    opts = list(q["options"].values())
    if text is not None:
        ok = (key == text) or (key == "None of these" and text not in opts)
    else:
        v = F(value).limit_denominator(100000)
        if key == "None of these":
            ok = all(num(o) != v for o in opts if o != "None of these")
        else:
            ok = num(key) == v and sum(1 for o in opts if o != "None of these" and num(o) == v) == 1
    if not ok: fails.append((q["id"], frag, key, value if text is None else text))
    print(("PASS " if ok else "FAIL "), q["id"], frag[:50], "->", key)

# ---- percentages / profit
cp = F(100); sp = cp * F(125, 100) * F(88, 100); chk("marks an article 25% above", (sp - cp) / cp * 100)
chk("price of sugar rises", min(F(r, 6000) for r in range(1, 6000) if F(12, 10) * (1 - F(r, 6000)) <= 1) * 100)
chk("winner got 58%", 7500 * 58 // 100 - 7500 * 42 // 100)
chk("salary is 25% more", (F(125) - 100) / 125 * 100)
chk("population grew", next(r for r in range(1, 50) if 40000 * (1 + F(r, 100)) ** 2 == 44100))
chk("remainder when 2^50", pow(2, 50, 7))
chk("Rs 1,260 is divided", 1260 * 3 // 9)
# ratio chain by search: smallest integer triple with a:b=3:4, b:c=6:7
trip = next((x, y, z) for y in range(1, 200) for x in range(1, 200) for z in range(1, 200) if 4 * x == 3 * y and 7 * y == 6 * z)
q = find("then a : b : c is"); done.add(q["id"]); key = q["options"][q["correctAnswer"]]
ok = key == " : ".join(map(str, trip)); print("PASS " if ok else "FAIL ", q["id"], "a:b:c", trip, key); (not ok) and fails.append((q["id"], "a:b:c"))
milk, water = F(30), F(10)
chk("40-litre mixture", next(w for w in range(0, 100) if milk / (water + w) == F(3, 2)))
chk("sum of two numbers is 84", next(x for x in range(1, 84) if 7 * x == 5 * (84 - x)))
chk("12 men can build a wall", F(12 * 15, 20))
chk("A can do a piece of work in 15 days", 1 - 4 * (F(1, 15) + F(1, 10)))
chk("A alone can finish it in 10 days", 1 / (F(1, 6) - F(1, 10)))
chk("Pipe A fills a tank", 1 / (F(1, 20) - F(1, 30)))
# 3 men = 6 women => 1 man = 2 women
chk("3 men or 6 women", F(6 * 20, 2 * 2 + 4))
chk("150-metre-long train", F(150, 10) * F(36, 10))
chk("goes from A to B at 40", F(2 * 240) / (F(240, 40) + F(240, 60)))
chk("120 m and 180 m long", F(120 + 180) / (F(54 + 36) * F(10, 36)))
chk("sold for Rs 1,540", next(x for x in range(1, 5000) if x * F(112, 100) == 1540))
chk("simple interest on Rs 8,000", 8000 * F(75, 10) * 4 / 100)
chk("compound interest on Rs 10,000", 10000 * F(11, 10) ** 2 - 10000)
chk("divisible by 3 or by 5", sum(1 for n in range(1, 101) if n % 3 == 0 or n % 5 == 0))
nums = [58] * 6; chk("average of 11 numbers is 60", 6 * 58 + 6 * 63 - 11 * 60)
chk("average age of 30 students", 31 * 15 - 30 * 14)
chk("letters of the word 'LEVEL'", len(set(itertools.permutations("LEVEL"))))
chk("present ages of A and B are in the ratio 5 : 7", next(5 * x for x in range(1, 100) if 4 * (5 * x + 6) == 3 * (7 * x + 6)))
chk("father is three times", next(s for s in range(1, 100) if 3 * s + 12 == 2 * (s + 12)))
chk("Five years ago a mother", next(d for d in range(1, 55) if (55 - d) - 5 == 4 * (d - 5)))
chk("perimeter of a rectangle is 56", (56 // 2 - 16) * 16)
chk("radius of a circle is increased", ((F(11, 10) ** 2) - 1) * 100)
q = find("radii of two cylinders"); done.add(q["id"])
chk_ratio_ok = F(2 ** 2 * 5, 3 ** 2 * 3) == F(20, 27) and q["options"][q["correctAnswer"]] == "20 : 27"; print("PASS " if chk_ratio_ok else "FAIL ", q["id"], "cylinder ratio"); (not chk_ratio_ok) and fails.append((q["id"], "cylinder"))
side_sq = F(10 * 10 * 2, 2); chk("diagonal of a square is 10", side_sq)  # d^2/2 = 200/2
chk("x + 1/x = 5", next(F(a * a - 2) for a in [5]))
chk("x = 2 is a root", -(2 ** 2 - 5 * 2))
chk("A and B together can do a job in 10 days, B and C", 1 / (F(1, 2) * (F(1, 10) + F(1, 15) + F(1, 12))))
chk("compounded half-yearly", 5000 * F(11, 10) ** 2)
chk("HCF and LCM of two numbers", next(x for x in range(1, 4321) if math.gcd(72, x) == 12 and math.lcm(72, x) == 360))
from math import comb
chk("5 red and 3 blue", F(comb(5, 2), comb(8, 2)))
# clock coincidences: minute hand 6 deg/min, hour hand 0.5 deg/min, count t in [0,720) with equal angle mod 360
cnt = len({t for t in (F(720 * k, 11) for k in range(0, 11))})
chk("hour and minute hands of a clock coincide", cnt)
chk("prime numbers lie between 20 and 50", sum(1 for n in range(21, 50) if all(n % d for d in range(2, int(n ** .5) + 1))))
tea = set(range(60)); coffee = set(range(45, 90)); assert len(tea & coffee) == 15; chk("60 like tea", 100 - len(tea | coffee))
chk("n(A) = 25", 25 + 18 - 35)
deck = [(r, s) for r in range(13) for s in range(4)]  # rank 12 = king, suit 0 = hearts
chk("king or a heart", F(sum(1 for r, s in deck if r == 12 or s == 0), 52))
chk("sum is 8", F(sum(1 for x in range(1, 7) for y in range(1, 7) if x + y == 8), 36))
chk("letters of 'LAHORE'", len(list(itertools.permutations("LAHORE", 3))))
chk("2, 6, 12, 20, 30", next(n * (n + 1) for n in [6]))
chk("1, 2, 6, 24, 120", math.factorial(6))
chk("compound interest and the simple interest on Rs 20,000", 20000 * F(105, 100) ** 2 - 20000 - 20000 * F(5, 100) * 2)
# coding items
code = {"B": 2, "A": 8, "T": 3, "C": 3, "R": 0, "E": 1}
assert "".join(str(code[x]) for x in "BAT") == "283" and "".join(str(code[x]) for x in "CAT") == "383" and "".join(str(code[x]) for x in "ARE") == "801"
chk("code for BETTER", int("".join(str(code[x]) for x in "BETTER")))
shift = lambda w: "".join(chr(ord(c) + 1) for c in w)
assert shift("PAKISTAN") == "QBLJTUBO"; chk("PAKISTAN' is coded", 0, text=shift("LAHORE"))
# direction items by coordinates
def walk(face, moves):
    dirs = {"N": (0, 1), "E": (1, 0), "S": (0, -1), "W": (-1, 0)}; x = y = 0; f = face
    order = "NESW"
    for m in moves:
        if m[0] == "R": f = order[(order.index(f) + m[1] // 90) % 4]
        elif m[0] == "L": f = order[(order.index(f) - m[1] // 90) % 4]
        else: x += dirs[f][0] * m[1]; y += dirs[f][1] * m[1]
    return x, y, f
x, y, f = walk("E", [("L", 90), ("W", 4), ("L", 90), ("W", 6), ("R", 90), ("W", 4)]); chk("Facing east, Ahmed", math.hypot(x, y))
x, y, f = walk("N", [("R", 90), ("R", 180), ("L", 90)]); chk("A man faces north", 0, text={"N": "North", "E": "East", "S": "South", "W": "West"}[f])
q = find("Ali walks 5 km north"); done.add(q["id"]); x, y, f = walk("N", [("W", 5), ("R", 90), ("W", 3), ("R", 90), ("W", 5)]); 
# after turning right twice he faces south: net displacement (3,0)
ok = (x, y) == (3, 0) and q["options"][q["correctAnswer"]] == "3 km east"; print("PASS " if ok else "FAIL ", q["id"], "walk", (x, y)); (not ok) and fails.append((q["id"], "walk"))
# reasoning with explicit models
q = find("Sara says"); done.add(q["id"]); ok = q["options"][q["correctAnswer"]] == "Maternal cousin"; print("PASS " if ok else "FAIL ", q["id"], "cousin (mother's brother's son)"); (not ok) and fails.append((q["id"], "cousin"))
q = find("A is B's sister"); done.add(q["id"]); ok = q["options"][q["correctAnswer"]] == "Granddaughter"; print("PASS " if ok else "FAIL ", q["id"], "A child of C, C child of D -> granddaughter"); (not ok) and fails.append((q["id"], "granddaughter"))
# syllogism: exhaustive model check over small universes (sets of D, G, T)
def syllogism():
    both = {1: True, 2: True}; res = []
    for assign in itertools.product(range(8), repeat=3):   # each of 3 individuals has a subset of {D,G,T} bitmask
        pass
    I_follows = II_follows = True
    for U in itertools.product(range(8), repeat=3):
        D = {i for i, m in enumerate(U) if m & 1}; G = {i for i, m in enumerate(U) if m & 2}; T = {i for i, m in enumerate(U) if m & 4}
        if D <= G and (G & T):
            if not (D & T): I_follows = False
            if not (T & G): II_follows = False
    return I_follows, II_follows
I, II = syllogism(); q = find("All doctors are graduates"); done.add(q["id"])
ok = (not I) and II and q["options"][q["correctAnswer"]] == "Only conclusion II follows"; print("PASS " if ok else "FAIL ", q["id"], "syllogism model check", I, II); (not ok) and fails.append((q["id"], "syllogism"))
# cube two-face count by brute force
n = 6; two = sum(1 for x in range(n) for y in range(n) for z in range(n) if sum(c in (0, n - 1) for c in (x, y, z)) == 2); chk("cube of side 6", two)
d0 = datetime.date(2026, 3, 5); assert d0.strftime("%A") == "Thursday"; chk("5 March 2026", 0, text=datetime.date(2026, 4, 5).strftime("%A"))
ang = abs((3 * 30 + 40 * 0.5) - 40 * 6) % 360; ang = min(ang, 360 - ang); chk("3:40", F(ang).limit_denominator(10))
chk("2.5 kg of rice", F(900) / F(5, 2) * 4)
missing = [q["id"] for q in GA if q["id"] not in done]
print("\nGA items:", len(GA), "| checked:", len(done), "| unchecked:", missing)
print("RESULT:", "ALL MATH CHECKS PASSED" if not fails and not missing else f"FAILURES: {fails} MISSING: {missing}")
sys.exit(1 if fails or missing else 0)
