"""Teaching and Learning Pedagogies (JEST Part III, JST 20%). Ten questions for each of the ten official topics.
Written from the topic list in the STS specification; none is taken from a past paper."""
from helpers import q

VARK = "Learning Styles (VARK)"
DIF = "Cognitive, Physical and Social Differences"
LP = "Lesson Planning and SLOs"
TS = "Teaching Skills"
TM = "Teaching Methodology"
ICT = "Use of ICT in the Classroom"
AS = "Assessment and Evaluation"
RP = "Reflective Practice and Feedback"
CM = "Classroom Management"
ST = "STEAM/STREAM and Project-Based Learning"
CLS = "Teacher professional knowledge"


def p(topic, d, stem, ok, bad, why):
    return q("JS", "Pedagogy", topic, d, stem, ok, bad, why, cls=CLS)


rows = [
    # ---------------- Learning styles (VARK)
    p(VARK, "e", "In the VARK model, the letters stand for:", "Visual, Aural, Read/Write, Kinesthetic", ["Verbal, Auditory, Reading, Knowledge", "Visual, Active, Reflective, Kinesthetic", "Vocal, Aural, Recall, Kinesthetic"], "VARK describes four preferred ways of taking in information: visual, aural, read/write and kinesthetic."),
    p(VARK, "e", "A student who understands best from diagrams, charts and maps is mainly a:", "visual learner", ["aural learner", "read/write learner", "kinesthetic learner"], "Visual learners prefer information shown as pictures, diagrams and graphs."),
    p(VARK, "e", "A student who learns best by listening to explanations and joining discussions is mainly an:", "aural learner", ["visual learner", "read/write learner", "kinesthetic learner"], "Aural learners prefer to hear information and talk it through."),
    p(VARK, "e", "A student who learns best by performing experiments and handling real objects is mainly a:", "kinesthetic learner", ["aural learner", "visual learner", "read/write learner"], "Kinesthetic learners learn through movement, practice and hands-on experience."),
    p(VARK, "m", "A student who prefers taking notes, reading textbooks and writing lists is mainly a:", "read/write learner", ["visual learner", "aural learner", "kinesthetic learner"], "Read/write learners prefer information in the form of printed words."),
    p(VARK, "m", "The VARK questionnaire was developed by:", "Neil Fleming", ["Howard Gardner", "Jean Piaget", "Lev Vygotsky"], "Neil Fleming created the VARK model of learning preferences."),
    p(VARK, "m", "Which classroom activity best suits kinesthetic learners studying the water cycle?", "building and demonstrating a working model", ["listening to a recorded lecture", "copying notes from the board", "reading a chapter silently"], "Making and operating a model lets kinesthetic learners learn by doing."),
    p(VARK, "m", "A teacher who presents a topic through speech, a diagram, a short text and an activity is:", "catering to several learning preferences", ["wasting lesson time", "confusing the learners", "favouring only visual learners"], "Using several modes reaches learners with different preferences and strengthens understanding for everyone."),
    p(VARK, "d", "Students who like more than one VARK mode are called:", "multimodal learners", ["unimodal learners", "slow learners", "passive learners"], "A multimodal learner has two or more strong preferences."),
    p(VARK, "d", "Which is the most defensible use of learning-style information by a teacher?", "offering varied activities without labelling students permanently", ["grouping students by one fixed style for the whole year", "teaching each student only in the preferred style", "ignoring it because every student learns identically"], "Preferences are useful for varying instruction, but they are not fixed labels and should not limit what a student is taught."),

    # ---------------- Cognitive, physical and social differences
    p(DIF, "e", "Individual differences among learners mean that:", "students differ in ability, pace and interest", ["all students learn at the same pace", "only gifted students differ", "differences disappear after primary school"], "Learners vary in ability, speed, background and interests, so teaching must allow for this."),
    p(DIF, "e", "According to Piaget, children aged about 7 to 11 are in the:", "concrete operational stage", ["sensorimotor stage", "preoperational stage", "formal operational stage"], "In the concrete operational stage children reason logically about real objects and events."),
    p(DIF, "m", "Piaget's stage in which abstract and hypothetical thinking develops (about 12 years onward) is the:", "formal operational stage", ["concrete operational stage", "sensorimotor stage", "preoperational stage"], "Formal operational thinkers can reason about abstract ideas and hypotheses."),
    p(DIF, "m", "Vygotsky's 'zone of proximal development' is the gap between:", "what a learner can do alone and what he or she can do with help", ["a learner's age and grade", "easy and difficult subjects", "home learning and school learning"], "Guided support within this zone moves the learner to the next level."),
    p(DIF, "m", "A teacher notices a student who sees the board poorly. The best first step is to:", "seat the student near the front and inform the parents", ["ignore it because it is a medical matter", "punish the student for inattention", "move the student to the last bench"], "Physical differences such as poor eyesight need practical adjustment and parental involvement."),
    p(DIF, "m", "Providing extra challenge and enrichment tasks suits:", "gifted learners", ["slow learners", "absent students", "new admissions only"], "Enrichment keeps high-ability learners engaged and growing."),
    p(DIF, "m", "Howard Gardner's theory states that people have:", "multiple intelligences", ["a single fixed intelligence", "intelligence only in language", "no differences in ability"], "Gardner proposed several relatively independent intelligences such as linguistic, logical and musical."),
    p(DIF, "d", "Erikson's stage for school-age children (about 6 to 12 years) is:", "industry versus inferiority", ["trust versus mistrust", "identity versus role confusion", "initiative versus guilt"], "At this age children build a sense of competence through schoolwork and achievement."),
    p(DIF, "d", "Mixed-ability groups in cooperative learning mainly help to:", "let learners support one another socially and academically", ["separate strong students from weak ones", "reduce the need for planning", "make marking easier"], "Peer interaction supports learning and builds social skills across ability levels."),
    p(DIF, "d", "Kohlberg's theory of moral development has:", "three levels: pre-conventional, conventional and post-conventional", ["two levels: right and wrong", "five levels based on age only", "no levels"], "Kohlberg described moral reasoning at three levels, each with two stages."),

    # ---------------- Lesson planning and SLOs
    p(LP, "e", "SLO stands for:", "Student Learning Outcome", ["Subject Level Objective", "School Learning Order", "Student Lesson Option"], "An SLO states what a student should know or be able to do after the lesson."),
    p(LP, "e", "Which is a well-written student learning outcome?", "Students will be able to list the three states of matter.", ["The teacher will explain the states of matter.", "Students will know about matter.", "To cover the chapter on matter."], "A good SLO is student-centred and uses an observable action verb."),
    p(LP, "m", "Which verb is best for a measurable learning outcome?", "identify", ["understand", "appreciate", "know"], "Identify can be observed and assessed; the other verbs are vague."),
    p(LP, "m", "The usual parts of a lesson plan are:", "objectives, materials, procedure and assessment", ["title, date and signature only", "textbook and homework only", "marks and attendance"], "A complete plan covers what to teach, with what, how, and how learning is checked."),
    p(LP, "m", "The opening step that grabs students' attention at the start of a lesson is the:", "introduction or hook", ["conclusion", "homework", "evaluation"], "A short hook links to prior knowledge and motivates the lesson."),
    p(LP, "m", "In the revised Bloom's taxonomy, the lowest level of thinking is:", "remembering", ["applying", "analysing", "creating"], "Remembering means recalling facts; creating is at the top."),
    p(LP, "m", "In the revised Bloom's taxonomy, the highest level is:", "creating", ["evaluating", "understanding", "remembering"], "The revised taxonomy places creating above evaluating."),
    p(LP, "d", "Lesson objectives or SLOs should be taken from the:", "curriculum", ["teacher's personal interest", "previous year's paper", "students' seating plan"], "SLOs are derived from the approved curriculum standards."),
    p(LP, "d", "The 5E lesson model consists of:", "Engage, Explore, Explain, Elaborate, Evaluate", ["Explain, Examine, Exercise, Exit, Evaluate", "Engage, Enter, Explain, Extend, End", "Explore, Edit, Explain, Enrich, Exam"], "The 5E model is an inquiry-based sequence widely used in science teaching."),
    p(LP, "d", "A good lesson plan should be:", "flexible enough to change when students need it", ["rigid and never altered", "written only after teaching", "copied unchanged from last year"], "Plans guide teaching but must adapt to learners' responses."),

    # ---------------- Teaching skills
    p(TS, "e", "Using a clear voice, eye contact and simple language is part of:", "communication skills", ["marking skills", "office skills", "budgeting skills"], "Clear communication helps students follow the lesson."),
    p(TS, "e", "Praising a student for a correct answer is an example of:", "positive reinforcement", ["punishment", "negative marking", "ignoring"], "Reinforcement increases the chance that desirable behaviour is repeated."),
    p(TS, "m", "Waiting a few seconds after asking a question before choosing a student is called:", "wait time", ["dead time", "break time", "rest time"], "Wait time gives learners time to think and improves answer quality."),
    p(TS, "m", "A question that asks a student to explain, justify or give reasons is a:", "higher-order question", ["recall question", "closed question", "rhetorical question"], "Higher-order questions require thinking beyond memory."),
    p(TS, "m", "Changing voice, gestures and activities to hold attention is called:", "stimulus variation", ["lesson repetition", "closure", "dictation"], "Varying the stimulus prevents boredom and keeps attention."),
    p(TS, "m", "Micro-teaching is mainly used to:", "practise a teaching skill in a short lesson with a small group", ["teach very small children only", "replace lesson planning", "conduct examinations"], "It lets trainee teachers practise one skill at a time and receive feedback."),
    p(TS, "m", "Summarising the main points at the end of a lesson is the skill of:", "closure", ["introduction", "reinforcement", "set induction"], "Closure consolidates learning and checks understanding."),
    p(TS, "d", "A follow-up question such as 'Why do you think so?' is called:", "a probing question", ["a leading question", "a rhetorical question", "a closed question"], "Probing questions push students to clarify and deepen their answers."),
    p(TS, "d", "Effective classroom communication is best described as:", "two-way, with the teacher listening as well as speaking", ["one-way from teacher to students", "written only", "limited to the textbook"], "Two-way exchange allows the teacher to check understanding and respond."),
    p(TS, "d", "When writing on the board, a good teacher should:", "write legibly, in an organised layout, while facing the class often", ["write quickly and cover it up", "talk only to the board", "fill every inch with text"], "Neat, organised board work supports learning and keeps the teacher aware of the class."),

    # ---------------- Teaching methodology
    p(TM, "e", "Showing students how to perform a process step by step is the:", "demonstration method", ["lecture method", "brainstorming", "case study method"], "In a demonstration the teacher performs while students observe."),
    p(TM, "e", "A main weakness of the pure lecture method is that students:", "remain passive listeners", ["become too active", "cannot hear the teacher", "learn too quickly"], "Lecturing is teacher-centred and gives learners little participation."),
    p(TM, "e", "Generating many ideas quickly without criticising them is called:", "brainstorming", ["case study", "demonstration", "dictation"], "Brainstorming encourages creative thinking and participation."),
    p(TM, "m", "Teaching by two or more teachers who plan and deliver a lesson together is:", "team teaching", ["peer teaching", "home tutoring", "self-study"], "Team teaching combines the strengths of several teachers."),
    p(TM, "m", "Analysing a real-life situation to draw conclusions is the:", "case study method", ["lecture method", "drill method", "rote method"], "Case studies connect theory to realistic problems."),
    p(TM, "m", "Which method is most suitable for young children to build interest and memory?", "storytelling", ["long lectures", "silent reading only", "formal debates"], "Stories engage imagination and make ideas easier to remember."),
    p(TM, "m", "Which method gives students the most active role?", "discussion method", ["lecture method", "dictation", "copying notes"], "Discussion lets learners share ideas and think aloud."),
    p(TM, "m", "For teaching how to use a microscope, the best method is:", "demonstration followed by practical work", ["storytelling alone", "silent reading", "dictation"], "Learners need to see the correct procedure and then practise it."),
    p(TM, "d", "A learner-centred method is one in which:", "students take an active part in constructing knowledge", ["the teacher speaks for the whole period", "students only copy notes", "textbooks are not used"], "Learner-centred methods emphasise student activity and thinking."),
    p(TM, "d", "Which teaching approach starts by posing a problem and lets students discover the answer?", "inquiry (discovery) method", ["lecture method", "drill method", "dictation method"], "In inquiry learning students investigate and find answers themselves."),

    # ---------------- Use of ICT
    p(ICT, "e", "ICT stands for:", "Information and Communication Technology", ["International Computer Training", "Internet and Computer Tools", "Information and Computing Test"], "ICT covers technologies used to store, process and share information."),
    p(ICT, "e", "Showing an animation of the heart on a projector is an example of using:", "multimedia in teaching", ["rote learning", "corporal punishment", "paper-based testing"], "Multimedia combines text, images, sound and animation to explain a topic."),
    p(ICT, "m", "Which tool lets a teacher share assignments and materials online with a class?", "a learning management system such as Google Classroom", ["a printing press", "a wall chart", "a chalkboard"], "A learning management system organises course content and tasks online."),
    p(ICT, "m", "The main purpose of integrating ICT into teaching is to:", "support the learning objectives and improve understanding", ["replace the teacher completely", "reduce student participation", "make lessons shorter"], "Technology should serve the lesson's goals rather than be used for its own sake."),
    p(ICT, "m", "A science simulation lets students:", "safely experiment with variables that are hard to change in real life", ["avoid learning the concepts", "skip the textbook entirely", "memorise answers only"], "Simulations make abstract or dangerous experiments safe and repeatable."),
    p(ICT, "m", "An interactive whiteboard allows the teacher to:", "write, display and interact with digital content on the board", ["print documents", "scan paper", "store data permanently like a hard disk"], "It combines a display with touch or pen input."),
    p(ICT, "m", "The 'digital divide' in schools refers to:", "unequal access to technology and the internet", ["a computer's broken screen", "a type of file format", "dividing a file into parts"], "Not all students have the same access to devices and connectivity."),
    p(ICT, "d", "TPACK is a framework that combines:", "technology, pedagogy and content knowledge", ["testing, planning and curriculum knowledge", "teaching, practice and classroom knowledge", "technology, politics and culture"], "Effective ICT teaching needs all three kinds of knowledge together."),
    p(ICT, "d", "Teaching students not to share passwords and to respect others online is part of:", "digital citizenship", ["data compression", "hardware repair", "network design"], "Digital citizenship covers safe, responsible and ethical use of technology."),
    p(ICT, "d", "Online quiz tools used during a lesson mainly help with:", "quick formative assessment", ["final examination marking only", "attendance only", "timetable design"], "They give immediate evidence of understanding so the teacher can adjust teaching."),

    # ---------------- Assessment and evaluation
    p(AS, "e", "Assessment carried out during teaching to improve learning is:", "formative assessment", ["summative assessment", "placement assessment", "annual assessment"], "Formative assessment gives feedback while learning is still in progress."),
    p(AS, "e", "An end-of-term examination is an example of:", "summative assessment", ["formative assessment", "diagnostic assessment", "peer assessment"], "Summative assessment judges learning at the end of a unit or course."),
    p(AS, "m", "A test given before teaching to find students' weaknesses is:", "diagnostic assessment", ["summative assessment", "final assessment", "annual assessment"], "Diagnostic assessment identifies prior knowledge and gaps."),
    p(AS, "m", "A scoring guide listing criteria and performance levels is a:", "rubric", ["syllabus", "timetable", "register"], "Rubrics make marking of projects and essays consistent and transparent."),
    p(AS, "m", "A test is valid when it:", "measures what it is intended to measure", ["gives the same score every time", "is very short", "is easy to mark"], "Validity concerns whether the test measures the intended learning."),
    p(AS, "m", "A test is reliable when it:", "gives consistent results", ["has many questions", "is printed neatly", "is given on a Monday"], "Reliability means results are consistent over repeated use or different markers."),
    p(AS, "m", "A collection of a student's work over time used to show progress is a:", "portfolio", ["register", "rubric", "blueprint"], "Portfolios document growth and achievement across a period."),
    p(AS, "d", "Comparing a student's performance with fixed learning standards is:", "criterion-referenced assessment", ["norm-referenced assessment", "random assessment", "peer comparison"], "Criterion-referenced assessment judges against set criteria, not against other students."),
    p(AS, "d", "Ranking students against one another is typical of:", "norm-referenced assessment", ["criterion-referenced assessment", "diagnostic assessment", "formative feedback"], "Norm-referenced scores show position relative to a group."),
    p(AS, "d", "A table of specifications (test blueprint) is used to:", "balance test questions across topics and cognitive levels", ["print the question paper", "assign seats", "record attendance"], "It ensures the test samples the syllabus fairly."),

    # ---------------- Reflective practice and feedback
    p(RP, "e", "Reflective teaching means:", "thinking critically about one's own teaching to improve it", ["copying another teacher", "avoiding feedback", "teaching without planning"], "Reflection turns experience into learning for the teacher."),
    p(RP, "e", "Good feedback to a student should be:", "specific, timely and constructive", ["vague and delayed", "only negative", "given only at year end"], "Specific and prompt feedback tells learners what to do next."),
    p(RP, "m", "Keeping a written record of teaching experiences and thoughts is a:", "reflective journal", ["lesson register", "attendance sheet", "mark sheet"], "A reflective journal helps teachers analyse what worked and what did not."),
    p(RP, "m", "Donald Schon distinguished reflection-in-action from:", "reflection-on-action", ["reflection-for-exams", "reflection-by-rote", "reflection-in-silence"], "Reflection-in-action happens during teaching; reflection-on-action happens afterwards."),
    p(RP, "m", "Inviting a colleague to observe a lesson and comment is:", "peer observation", ["a final examination", "an inspection penalty", "a parent meeting"], "Peer observation provides a second view for professional growth."),
    p(RP, "m", "Gathering students' opinions about a lesson helps the teacher to:", "improve future teaching", ["avoid planning", "reduce workload", "punish students"], "Student feedback shows what helps learning and what does not."),
    p(RP, "m", "A small investigation by a teacher into a classroom problem, followed by action, is called:", "action research", ["lesson dictation", "annual inspection", "board examination"], "Action research solves practical classroom problems systematically."),
    p(RP, "d", "Gibbs' reflective cycle begins with:", "description of what happened", ["an action plan", "a conclusion", "an evaluation"], "The cycle runs from description through feelings, evaluation, analysis and conclusion to an action plan."),
    p(RP, "d", "The ultimate purpose of reflective practice is:", "continuous professional improvement", ["finding someone to blame", "writing longer reports", "impressing the inspector"], "Reflection should lead to better teaching and learning."),
    p(RP, "d", "Feedback is most useful to a learner when it is given:", "soon after the task, with advice on how to improve", ["months later", "without comments", "only as a grade"], "Prompt, informative feedback allows the learner to correct and improve."),

    # ---------------- Classroom management
    p(CM, "e", "Classroom rules are most effective when they are:", "clear, few and made known at the start", ["secret", "changed daily", "applied only to some students"], "Clear rules set expectations and reduce misbehaviour."),
    p(CM, "e", "Good classroom management mainly aims to:", "create an orderly environment for learning", ["control students by fear", "avoid teaching", "finish the syllabus without interaction"], "Management exists to support learning, not to dominate students."),
    p(CM, "m", "Preventing problems through planning, routines and engaging lessons is called:", "proactive management", ["reactive management", "punitive management", "passive management"], "Good planning prevents most disruptions before they begin."),
    p(CM, "m", "A student is disturbing the class. The best first response is usually to:", "use a calm non-verbal cue or quiet private word", ["shout at the student publicly", "send the student out immediately", "ignore every behaviour"], "Low-key responses correct behaviour while keeping the lesson flowing."),
    p(CM, "m", "Handing out materials and moving between activities smoothly is the management of:", "transitions", ["admissions", "examinations", "promotions"], "Smooth transitions save time and reduce disruption."),
    p(CM, "m", "Involving students in making classroom rules usually:", "increases their ownership and cooperation", ["causes more disorder", "wastes the lesson", "has no effect"], "Learners follow rules they helped to create."),
    p(CM, "m", "Jacob Kounin's idea of 'withitness' means the teacher:", "is aware of everything happening in the classroom", ["stays seated at the desk", "talks only to the best students", "ignores minor events"], "A teacher who is 'with it' notices and stops problems early."),
    p(CM, "d", "A seating arrangement in a semi-circle or groups is useful because it:", "encourages interaction and lets the teacher move around", ["prevents all talking", "hides weak students", "reduces visibility of the board"], "Flexible seating supports discussion and teacher monitoring."),
    p(CM, "d", "An authoritative teaching style is best described as:", "firm and fair, with warmth and clear expectations", ["strict with no explanation", "permissive with no rules", "uninvolved"], "Authoritative management combines high expectations with support."),
    p(CM, "d", "Minor misbehaviour that does not disturb learning is often best handled by:", "briefly ignoring it or using a gentle cue", ["stopping the lesson to punish", "calling parents at once", "writing a report each time"], "Overreacting to small matters wastes time and can escalate problems."),

    # ---------------- STEAM / STREAM and project-based learning
    p(ST, "e", "STEAM stands for:", "Science, Technology, Engineering, Arts, Mathematics", ["Science, Teaching, English, Arts, Mathematics", "Skills, Technology, Engineering, Arts, Memory", "Science, Technology, Education, Art, Medicine"], "STEAM adds the Arts to STEM."),
    p(ST, "e", "STREAM adds which subject area to STEAM?", "Reading (and writing)", ["Religion", "Recreation", "Revision"], "STREAM integrates reading and writing with STEAM subjects."),
    p(ST, "e", "In project-based learning, students:", "work on a real-world problem over an extended period", ["memorise a chapter overnight", "only listen to lectures", "take a single test"], "PBL is built around investigation and producing a final product."),
    p(ST, "m", "In project-based learning the teacher acts mainly as a:", "facilitator", ["dictator", "judge only", "bystander"], "The teacher guides, supports and monitors while students drive the work."),
    p(ST, "m", "A 'driving question' in a project:", "gives the project a purpose and focuses the inquiry", ["is only asked in the final test", "replaces all lessons", "is answered by the teacher alone"], "An open, engaging question keeps the project focused."),
    p(ST, "m", "The 4Cs of 21st-century skills are:", "critical thinking, creativity, collaboration and communication", ["copying, counting, cramming and checking", "calculation, computing, coding and chemistry", "culture, care, calm and control"], "Project work builds these four skills."),
    p(ST, "m", "Which is an example of a STEAM project?", "designing and decorating a low-cost water filter", ["copying the definition of filtration", "listening to a lecture on water", "reciting a poem about rain"], "It combines science, engineering, technology and design (arts)."),
    p(ST, "d", "A project is best assessed using:", "a rubric covering both the product and the process", ["the final product only", "attendance only", "a single multiple-choice test"], "Process skills such as teamwork matter as much as the final result."),
    p(ST, "d", "What does the 'A' in STEAM add to STEM?", "creativity and design thinking through the arts", ["more memorisation", "extra examinations", "less mathematics"], "The arts bring creative expression and design into problem solving."),
    p(ST, "d", "Interdisciplinary learning in STEAM means:", "connecting ideas from several subjects to solve one problem", ["teaching each subject separately", "avoiding mathematics", "using only textbooks"], "Real problems cut across subjects, so STEAM combines them."),
]
