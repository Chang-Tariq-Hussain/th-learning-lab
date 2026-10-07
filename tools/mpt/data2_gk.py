"""Mock 2 - GK / Current Affairs / Pakistan Affairs (50). Order: science, international, current affairs, Pakistan."""
from helpers2 import *
GK = "GK / Current Affairs / Pakistan Affairs"
N25 = "Appears in the uploaded 2025 reproduction (scanned, third-party, not an official FPSC copy); answer re-derived independently."
N26 = "Appears in the uploaded 2026 reproduction (third-party); answer re-derived independently."
Y_SCI = "Everyday-science items appear in every parsed paper (about 47 by keyword count; 2025 and 2026 heaviest)."
Y_CS = "Computer/AI items appear in 2023, 2025 and 2026 (small but rising)."
Y_ORG = "International organisations / treaties appear in every parsed paper (about 51 by keyword count)."
Y_CA = "Current affairs (awards, sports, summits, office holders) appear in every paper; the 2025/2026 papers carry the previous year's events."
Y_PK = "Pakistan history / constitution / geography appears in all four papers (about 21 constitutional/Pakistan-movement items by keyword count; 2022 heaviest)."
def G(*a, **k): return q(GK, *a, **k)
def CA(topic, diff, stem, opts, ans, expl, verif, yn=Y_CA):
    return q(GK, topic, diff, GP, None, [], stem, opts, ans, expl, yn, "Generated for this mock. Fact checked by web search on 6 Oct 2026.", verif=verif)

items = [
 # ---------- science (16)
 G("Biology","Easy",VP,2025,[2026],"Why is the mitochondrion called the 'powerhouse' of the cell?",
   ["It stores genetic material","It synthesizes proteins","It generates energy in the form of ATP","It helps in cell division"],"C","Mitochondria carry out aerobic respiration and release most of the cell's ATP.",Y_SCI,N25),
 G("Astronomy","Easy",VP,2025,[],"The estimated age of the universe is:",["4.5 billion years","10 billion years","13.8 billion years","20 billion years"],"C","Measurements of the cosmic microwave background give about 13.8 billion years; 4.5 billion years is the age of the Earth.",Y_SCI,N25),
 G("Physics","Moderate",VP,2025,[],"Which of the following is used for measuring distance?",["Coulomb","Light year","Farad","Curie"],"B","A light year is the distance light travels in a year. Coulomb is charge, farad capacitance, curie radioactivity.",Y_SCI,N25),
 G("Earth Science","Moderate",VP,2025,[],"Monsoon winds are caused by:",["Changes in ocean currents","The tilt of the Earth's axis","Differences in temperature between land and sea","Volcanic eruptions"],"C","Land heats and cools faster than the sea, so seasonal pressure differences reverse the wind direction.",Y_SCI,N25),
 G("Chemistry","Moderate",VP,2025,[],"Which of the following contains the greatest number of carbon atoms in one mole of the compound?",["Chloroform (CHCl3)","Methanol (CH3OH)","Water (H2O)","Ethanol (C2H5OH)"],"D","One mole always has the same number of molecules; ethanol has 2 C per molecule, chloroform and methanol 1, water 0.",Y_SCI,N25),
 G("Computer Science","Easy",VP,2025,[],"Which component connects a computer to external peripherals such as printers and keyboards?",["CPU","Motherboard","I/O ports","Power supply"],"C","I/O ports (USB, HDMI, etc.) are the interfaces for peripherals.",Y_CS,N25),
 G("Environment","Easy",VP,2025,[],"Which of the following is an example of sustainable energy?",["Coal","Natural gas","Solar power","Petroleum"],"C","Solar power is renewable; the others are finite fossil fuels.",Y_SCI,N25+" Option D replaced (source option was nuclear power, which is arguable)."),
 G("Chemistry","Moderate",VP,2026,[],"Nanocomposite materials are useful in the food industry because they protect packaged food from damage due to:",["Oxygen","Carbon dioxide","Moisture","All of these"],"D","Nanocomposite barrier films reduce the passage of oxygen, carbon dioxide and moisture.",Y_SCI,N26),
 G("Physics","Easy",GP,None,[],"The SI unit of electrical resistance is:",["Volt","Ampere","Ohm","Watt"],"C","Resistance is measured in ohms (symbol Omega).",Y_SCI),
 G("Biology","Moderate",GP,None,[],"Which blood group is called the universal donor for red blood cells?",["AB positive","O negative","A positive","B negative"],"B","O negative red cells have no A, B or Rh antigens, so almost any patient can receive them.",Y_SCI),
 G("Astronomy","Difficult",GP,None,[],"The Chandrasekhar limit, above which a white dwarf cannot remain stable, is about:",["0.5 solar masses","1.4 solar masses","3 solar masses","8 solar masses"],"B","A non-rotating white dwarf above roughly 1.4 solar masses collapses further, becoming a neutron star or supernova remnant.",Y_SCI),
 G("Biology","Difficult",GP,None,[],"Pernicious anaemia is caused by a deficiency of vitamin:",["B1","B6","B12","C"],"C","Lack of vitamin B12 (or of the intrinsic factor needed to absorb it) causes pernicious anaemia.",Y_SCI),
 G("Computer Science","Easy",GP,None,[],"In artificial intelligence, 'LLM' stands for:",["Large Language Model","Linear Logic Machine","Low Level Memory","Learned Logic Module"],"A","An LLM is a Large Language Model, a neural network trained on large text datasets.",Y_CS),
 G("Physics","Difficult",GP,None,[],"The SI unit of luminous intensity is:",["Lumen","Lux","Candela","Watt per steradian"],"C","The candela is the SI base unit of luminous intensity; lumen is luminous flux and lux is illuminance.",Y_SCI),
 G("Physics","Difficult",GP,None,[],"The SI unit of magnetic flux density is:",["Weber","Henry","Tesla","Gauss"],"C","Tesla is the SI unit of magnetic flux density; weber is flux, henry inductance, gauss a non-SI unit.",Y_SCI),
 G("Biology","Easy",GP,None,[],"Which vitamin is synthesised in the skin on exposure to sunlight?",["Vitamin A","Vitamin C","Vitamin D","Vitamin K"],"C","Ultraviolet B converts 7-dehydrocholesterol in the skin into vitamin D3.",Y_SCI),
 # ---------- international (8)
 G("International Organizations","Easy",VP,2025,[],"Where is the headquarters of the Shanghai Cooperation Organisation (SCO) located?",["Beijing","New Delhi","Moscow","Astana"],"A","The SCO Secretariat is in Beijing; its Regional Anti-Terrorist Structure is in Tashkent.",Y_ORG,N25),
 G("Environment","Difficult",VP,2025,[],"The theme of World Environment Day 2024 was:",
   ["Climate change awareness","Ocean conservation","Land restoration, desertification and drought resilience","Renewable energy adoption"],"C",
   "World Environment Day 2024 (hosted by Saudi Arabia) focused on land restoration, desertification and drought resilience.",Y_SCI,N25),
 G("Awards","Moderate",VP,2025,[],"Who won the Nobel Prize in Literature in 2024?",["Han Kang","Haruki Murakami","Salman Rushdie","Margaret Atwood"],"A","The 2024 prize went to the South Korean writer Han Kang.",Y_CA,N25),
 G("International Organizations","Easy",GP,None,[],"The headquarters of the World Trade Organization (WTO) is in:",["Geneva","New York","Brussels","Paris"],"A","The WTO is based in Geneva, Switzerland.",Y_ORG),
 G("International Organizations","Easy",GP,None,[],"The International Court of Justice (ICJ), the principal judicial organ of the UN, sits in:",["Geneva","The Hague","Vienna","Brussels"],"B","The ICJ sits in the Peace Palace in The Hague.",Y_ORG),
 G("International Organizations","Easy",GP,None,[],"The Secretariat of the Organisation of Islamic Cooperation (OIC) is located in:",["Riyadh","Jeddah","Cairo","Istanbul"],"B","The OIC General Secretariat is in Jeddah, Saudi Arabia.",Y_ORG),
 G("World History","Easy",GP,None,[],"The Treaty of Versailles (1919) formally ended which war?",["World War I","World War II","Franco-Prussian War","Crimean War"],"A","It ended the state of war between Germany and the Allies after World War I.",Y_ORG),
 G("International Organizations","Easy",GP,None,[],"Which of the following is a permanent member of the UN Security Council?",["India","Germany","Japan","France"],"D","The five permanent members are the US, UK, France, Russia and China.",Y_ORG),
 # ---------- current affairs (14)
 CA("Awards","Difficult","The 2025 Nobel Prize in Chemistry was awarded for the development of:",["Lithium-ion batteries","Metal-organic frameworks","Quantum dots","CRISPR gene editing"],"B",
    "Susumu Kitagawa, Richard Robson and Omar Yaghi won for metal-organic frameworks. Quantum dots (2023) and CRISPR (2020) were earlier prizes.",
    "Checked 6 Oct 2026 against a laureate list (Nobel Prize 2025 summary pages)."),
 CA("Awards","Difficult","The 2025 Nobel Prize in Physiology or Medicine was awarded for discoveries concerning:",["mRNA vaccines","Peripheral immune tolerance","The gut microbiome","Telomeres"],"B",
    "Mary Brunkow, Fred Ramsdell and Shimon Sakaguchi were honoured for discoveries on peripheral immune tolerance (regulatory T cells).",
    "Checked 6 Oct 2026 against a laureate list."),
 CA("Awards","Difficult","The 2025 Nobel Prize in Economic Sciences recognised work on:",["Behavioural finance","Innovation-driven economic growth","Auction theory","Microfinance"],"B",
    "Joel Mokyr, Philippe Aghion and Peter Howitt were honoured for explaining growth through technological progress and creative destruction.",
    "Checked 6 Oct 2026 against a laureate list."),
 CA("Awards","Moderate","The 2025 Booker Prize was won by David Szalay for the novel:",["Orbital","Flesh","The Safekeep","Hamnet"],"B",
    "David Szalay won the 2025 Booker Prize for 'Flesh'. 'Orbital' (Samantha Harvey) won in 2024.",
    "Checked 6 Oct 2026 by web search (Booker Prize announcement coverage)."),
 CA("Sports","Easy","Which team won the 2025 Asia Cup (T20 format) final played in Dubai?",["Pakistan","India","Sri Lanka","Bangladesh"],"B",
    "India beat Pakistan by 5 wickets in the final in Dubai in September 2025.",
    "Checked 6 Oct 2026 by web search (final report, Gulf News / Aaj)."),
 CA("Sports","Easy","The 2025 ICC Women's Cricket World Cup final at Navi Mumbai was won by:",["Australia","England","South Africa","India"],"D",
    "India beat South Africa by 52 runs on 2 November 2025 to win their first Women's World Cup.",
    "Checked 6 Oct 2026 by web search (final report)."),
 CA("Sports","Moderate","Which club won the 2026 UEFA Champions League final in Budapest?",["Arsenal","Paris Saint-Germain","Bayern Munich","Barcelona"],"B",
    "PSG drew 1-1 with Arsenal and won 4-3 on penalties on 30 May 2026, retaining the title.",
    "Checked 6 Oct 2026 by web search (match report)."),
 CA("Space","Moderate","NASA's Artemis II mission, flown in April 2026, was:",["The first crewed landing on the Moon since Apollo 17","A crewed flight around the Moon that returned to Earth","An uncrewed test of the Orion capsule","A crewed mission to Mars orbit"],"B",
    "Artemis II launched on 1 April 2026 and the four-person crew flew around the Moon and splashed down in the Pacific on 10 April.",
    "Checked 6 Oct 2026 by web search (launch and splashdown reports)."),
 CA("Climate Diplomacy","Moderate","COP31, the UN climate conference due in November 2026, will be held in:",["Antalya, Turkiye","Sydney, Australia","Baku, Azerbaijan","Bonn, Germany"],"A",
    "Turkiye hosts COP31 in Antalya (9-20 Nov 2026) while Australia serves as President of Negotiations under a compromise reached at COP30.",
    "Checked 6 Oct 2026 by web search (conference pages)."),
 CA("International Organizations","Moderate","Rafael Grossi, a declared candidate to succeed Antonio Guterres as UN Secretary-General, currently heads which agency?",["IAEA","WHO","UNESCO","World Food Programme"],"A",
    "Grossi of Argentina is Director General of the International Atomic Energy Agency; the next Secretary-General takes office in January 2027.",
    "Checked 6 Oct 2026 by web search (candidate list on IISD SDG Knowledge Hub). Selection is still open, so the question names no winner."),
 CA("International Summits","Moderate","The 18th BRICS Summit (September 2026) was hosted by:",["Russia","Brazil","India","China"],"C",
    "India hosted the 18th BRICS Summit at Bharat Mandapam, New Delhi on 12-13 September 2026; China chairs in 2027.",
    "Checked 6 Oct 2026 by web search (summit reports)."),
 CA("Pakistan-SCO","Moderate","Which Pakistani city was named the SCO 'Tourism and Cultural Capital' for 2026-27 after Pakistan took over the SCO chairmanship at the Bishkek summit?",["Islamabad","Lahore","Karachi","Peshawar"],"B",
    "At the 26th SCO summit in Bishkek the chair passed to Pakistan and Lahore was named the organisation's Tourism and Cultural Capital for 2026-27.",
    "Checked 6 Oct 2026 against several reports (Tribune India, ETV Bharat, GKToday)."),
 CA("Office Holders","Moderate","Who became Japan's first female Prime Minister in October 2025?",["Yuriko Koike","Sanae Takaichi","Seiko Hashimoto","Tomomi Inada"],"B",
    "Sanae Takaichi of the LDP took office on 21 October 2025 and remains Prime Minister after the February 2026 election.",
    "Checked 6 Oct 2026 by web search (Premiership of Sanae Takaichi)."),
 CA("Office Holders","Moderate","Who became Prime Minister of the United Kingdom on 20 July 2026, succeeding Keir Starmer?",["Rishi Sunak","Andy Burnham","Wes Streeting","Boris Johnson"],"B",
    "Andy Burnham succeeded Keir Starmer as Labour leader and Prime Minister on 20 July 2026.",
    "Checked 6 Oct 2026 by web search (NPR/ABC reports). Office holders can change; re-check just before the exam."),
 # ---------- Pakistan (12)
 G("Pakistan Geography","Moderate",VP,2025,[],"The Pakistan Naval War College is situated in:",["Karachi","Lahore","Islamabad","Quetta"],"B","The Pakistan Navy War College is in Lahore.",Y_PK,N25),
 G("Pakistan Geography","Easy",VP,2025,[],"The 'Princess of Hope' rock formation is located in:",["Punjab","Khyber Pakhtunkhwa","Balochistan","Sindh"],"C","It lies in the Hingol National Park area on the Makran Coastal Highway in Balochistan.",Y_PK,N25),
 G("Pakistan Movement","Moderate",VP,2025,[],"Who joined the All India Muslim League in 1913?",["Muhammad Ali Jinnah","Allama Iqbal","Liaquat Ali Khan","Khawaja Nazimuddin"],"A","Jinnah joined the Muslim League in 1913 at Maulana Muhammad Ali Jauhar's urging.",Y_PK,N25),
 G("Pakistan Geography","Moderate",VP,2025,[],"Which is the largest gas field of Pakistan?",["Sui","Qadirpur","Kunnar","Makori"],"A","Sui (Balochistan), discovered in 1952, is Pakistan's largest gas field though its output has fallen.",Y_PK,N25),
 G("Mughal History","Easy",VP,2025,[],"Which Mughal Emperor died after falling from a staircase?",["Akbar","Shah Jahan","Aurangzeb","Humayun"],"D","Humayun fell down the steps of his library, Sher Mandal, in 1556.",Y_PK,N25),
 G("Subcontinent History","Easy",VP,2025,[],"The Indian National Congress was founded in:",["1885","1886","1887","1888"],"A","Founded in December 1885 with A. O. Hume's help.",Y_PK,N25),
 G("Pakistan Agriculture","Moderate",VP,2025,[],"Which of the following is NOT a Kharif crop?",["Rice","Wheat","Maize","Cotton"],"B","Wheat is a Rabi crop sown in winter; rice, maize and cotton are Kharif crops.",Y_PK,N25),
 G("Pakistan Geography","Difficult",GP,None,[],"The Reko Diq copper-gold deposit is located in which district of Balochistan?",["Chagai","Kharan","Khuzdar","Gwadar"],"A","Reko Diq lies in the Chagai district near the Iran-Afghanistan border.",Y_PK),
 G("Constitutional History","Moderate",GP,None,[],"Which amendment (2010) abolished the Concurrent Legislative List and devolved subjects to the provinces?",["8th","17th","18th","20th"],"C","The 18th Amendment (April 2010) abolished the Concurrent List and renamed NWFP as Khyber Pakhtunkhwa.",Y_PK),
 G("Military History","Difficult",GP,None,[],"Who was the first Pakistani Commander-in-Chief of the Pakistan Army?",["Ayub Khan","Yahya Khan","Muhammad Musa","Sir Douglas Gracey"],"A","Muhammad Ayub Khan took over from the British General Sir Douglas Gracey in January 1951 as the first Pakistani C-in-C.",Y_PK),
 G("Pakistan Affairs","Moderate",GP,None,[],"In 2026 the Court of Arbitration at The Hague issued rulings concerning India's hydropower projects under which treaty?",["Simla Agreement","Indus Waters Treaty","Tashkent Declaration","Lahore Declaration"],"B",
   "The Court ruled in May and August 2026 on India's projects such as Ratle and Kishenganga under the 1960 Indus Waters Treaty; India, which holds the treaty in abeyance, rejects the rulings.",Y_PK,"Generated for this mock. Fact checked by web search on 6 Oct 2026 (The Week, Aug 2026).",verif="Checked 6 Oct 2026 by web search; the dispute is ongoing, so the stem names no outcome beyond the rulings."),
 G("Pakistan Economy","Moderate",GP,None,[],"Pakistan's federal budget for FY2026-27 set a GDP growth target of about:",["2%","4%","6%","8%"],"B",
   "The budget (about Rs18.77 trillion outlay) targeted 4% growth against about 3.7% in the outgoing year.",Y_PK,"Generated for this mock. Fact checked by web search on 6 Oct 2026 (Aaj News, Arab News).",verif="Checked 6 Oct 2026; figure is the budget target, not an outcome."),
]
assert len(items)==50,len(items)
