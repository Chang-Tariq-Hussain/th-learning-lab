/**
 * Statistics Foundations — data model.
 *
 * Every dataset here is small and hand-authored (per the brief's
 * "no heavy data science libraries, small generated datasets"
 * instruction). Nothing here computes mean/median/mode/etc. — this
 * file only carries the facts the panels render and the questions the
 * two practice games ask.
 */

// --- Section 1 — the classroom dataset -----------------------------------------

export type ColumnId = "name" | "age" | "subject" | "studyHours" | "testScore";

export interface Student {
  name: string;
  age: number;
  subject: string;
  studyHours: number;
  testScore: number;
}

export const STUDENTS: Student[] = [
  { name: "Amara", age: 14, subject: "Art", studyHours: 3, testScore: 78 },
  { name: "Bilal", age: 15, subject: "Math", studyHours: 6, testScore: 91 },
  { name: "Chloe", age: 14, subject: "Science", studyHours: 5, testScore: 85 },
  { name: "Diego", age: 16, subject: "History", studyHours: 2, testScore: 64 },
  { name: "Elif", age: 15, subject: "Math", studyHours: 4, testScore: 80 },
  { name: "Farid", age: 14, subject: "Art", studyHours: 1, testScore: 58 },
  { name: "Grace", age: 16, subject: "Science", studyHours: 7, testScore: 95 },
  { name: "Hana", age: 15, subject: "History", studyHours: 3, testScore: 72 },
  { name: "Ivan", age: 14, subject: "Math", studyHours: 5, testScore: 88 },
];

export interface ColumnDef {
  id: ColumnId;
  header: string;
  variableName: string;
  description: string;
}

export const COLUMNS: ColumnDef[] = [
  { id: "name", header: "Name", variableName: "Name", description: "An identifier, not really a variable we'd analyze — every student has a different one." },
  { id: "age", header: "Age", variableName: "Age", description: "Variable: Age — how old each student is, in years." },
  { id: "subject", header: "Favorite Subject", variableName: "Favorite Subject", description: "Variable: Favorite Subject — which subject each student likes best." },
  { id: "studyHours", header: "Study Hours", variableName: "Study Hours", description: "Variable: Study Hours — how many hours each student studies per week." },
  { id: "testScore", header: "Test Score", variableName: "Test Score", description: "Variable: Test Score — each student's score out of 100 on a recent test." },
];

// --- Section 2 — variables ---------------------------------------------------

export interface VariableExample {
  id: string;
  label: string;
  hint: string;
}

export const VARIABLE_EXAMPLES: VariableExample[] = [
  { id: "age", label: "Age", hint: "How many years old a person is — different for almost everyone." },
  { id: "height", label: "Height", hint: "How tall a person is — changes from person to person." },
  { id: "siblings", label: "Number of Siblings", hint: "How many brothers and sisters a person has." },
  { id: "color", label: "Favorite Color", hint: "Which color a person likes best." },
  { id: "score", label: "Test Score", hint: "How well a person did on a test." },
  { id: "study", label: "Study Hours", hint: "How many hours a person spends studying." },
];

// --- Sections 3 & 4 — sorting activities --------------------------------------

export type CatNumBin = "categorical" | "numerical";
export type DiscreteContinuousBin = "discrete" | "continuous";

export interface SortItem<Bin extends string> {
  id: string;
  label: string;
  correctBin: Bin;
}

export const CATEGORICAL_NUMERICAL_ITEMS: SortItem<CatNumBin>[] = [
  { id: "age", label: "Age", correctBin: "numerical" },
  { id: "favColor", label: "Favorite Color", correctBin: "categorical" },
  { id: "numPets", label: "Number of Pets", correctBin: "numerical" },
  { id: "testScore", label: "Test Score", correctBin: "numerical" },
  { id: "bloodType", label: "Blood Type", correctBin: "categorical" },
  { id: "studyHours", label: "Study Hours", correctBin: "numerical" },
  { id: "transport", label: "Type of Transport", correctBin: "categorical" },
  { id: "numBooks", label: "Number of Books", correctBin: "numerical" },
];

export const DISCRETE_CONTINUOUS_ITEMS: SortItem<DiscreteContinuousBin>[] = [
  { id: "siblings", label: "Number of Siblings", correctBin: "discrete" },
  { id: "books", label: "Number of Books", correctBin: "discrete" },
  { id: "students", label: "Number of Students", correctBin: "discrete" },
  { id: "height", label: "Height", correctBin: "continuous" },
  { id: "weight", label: "Weight", correctBin: "continuous" },
  { id: "temperature", label: "Temperature", correctBin: "continuous" },
  { id: "time", label: "Time", correctBin: "continuous" },
  { id: "cars", label: "Number of Cars", correctBin: "discrete" },
];

// --- Section 5 & 6 — population / sample / sample size ------------------------

export const POPULATION_TOTAL = 1000;
export const POPULATION_DOT_COUNT = 100; // each dot represents 10 people
export const PEOPLE_PER_DOT = POPULATION_TOTAL / POPULATION_DOT_COUNT;

export const DEFAULT_SAMPLE_SIZE = 50;
export const SAMPLE_SIZE_MIN = 10;
export const SAMPLE_SIZE_MAX = 100;

// --- Section 7 — sampling methods ---------------------------------------------

export const SAMPLING_POPULATION_SIZE = 100;

export type SamplingMethodId = "random" | "systematic" | "stratified" | "convenience";

export interface SamplingMethodDef {
  id: SamplingMethodId;
  label: string;
  explanation: string;
}

export const SAMPLING_METHODS: SamplingMethodDef[] = [
  {
    id: "random",
    label: "Simple Random",
    explanation: "Every individual has an equal chance of being selected.",
  },
  {
    id: "systematic",
    label: "Systematic",
    explanation: "Individuals are chosen at a fixed interval from an ordered list — here, every 5th person.",
  },
  {
    id: "stratified",
    label: "Stratified",
    explanation: "Stratified sampling ensures that important groups are represented in the sample.",
  },
  {
    id: "convenience",
    label: "Convenience",
    explanation: "Convenience sampling chooses individuals who are easiest to access. Convenient does not necessarily mean representative.",
  },
];

export const STRATIFIED_GROUPS = [
  { id: "g9", label: "Grade 9" },
  { id: "g10", label: "Grade 10" },
  { id: "g11", label: "Grade 11" },
  { id: "g12", label: "Grade 12" },
] as const;

// --- Section 8 — representative samples ---------------------------------------

export const REPRESENTATIVE_GROUPS = [
  { id: "a", label: "Group A", color: "#3b82f6", proportion: 0.5 },
  { id: "b", label: "Group B", color: "#f59e0b", proportion: 0.3 },
  { id: "c", label: "Group C", color: "#10b981", proportion: 0.2 },
] as const;

// A "more representative" sample keeps roughly the population's proportions;
// a "less representative" one is dominated by a single group.
export const SAMPLE_A_COUNTS = { a: 5, b: 3, c: 2 }; // ~50/30/20, matches population
export const SAMPLE_B_COUNTS = { a: 9, b: 1, c: 0 }; // dominated by Group A

// --- Section 9 — sampling bias --------------------------------------------------

export interface BiasScenario {
  id: "library" | "random";
  label: string;
  question: string;
  yesPercent: number;
  description: string;
}

export const BIAS_SCENARIOS: BiasScenario[] = [
  {
    id: "library",
    label: "Ask only students in the library",
    question: "Do you like reading?",
    yesPercent: 92,
    description: "Students already sitting in the library are more likely to enjoy reading — the sample is skewed before a single question is asked.",
  },
  {
    id: "random",
    label: "Ask students randomly throughout the school",
    question: "Do you like reading?",
    yesPercent: 54,
    description: "A random sample from the whole school includes students with all kinds of reading habits, so the result better reflects everyone.",
  },
];

// --- Section 10 — classification game -------------------------------------------

export interface ClassifyQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CLASSIFICATION_QUESTIONS: ClassifyQuestion[] = [
  {
    id: "height",
    prompt: "Height — is this categorical or numerical?",
    options: ["Categorical", "Numerical"],
    correctIndex: 1,
    explanation: "Height is a measurement, so it's numerical.",
  },
  {
    id: "sport",
    prompt: "Favorite Sport — is this categorical or numerical?",
    options: ["Categorical", "Numerical"],
    correctIndex: 0,
    explanation: "Favorite Sport names a category, not a number, so it's categorical.",
  },
  {
    id: "pets",
    prompt: "Number of Pets — is this discrete or continuous?",
    options: ["Discrete", "Continuous"],
    correctIndex: 0,
    explanation: "You count pets in whole numbers (0, 1, 2, ...), so it's discrete.",
  },
  {
    id: "temperature",
    prompt: "Temperature — is this discrete or continuous?",
    options: ["Discrete", "Continuous"],
    correctIndex: 1,
    explanation: "Temperature can take any value within a range, so it's continuous.",
  },
  {
    id: "cars",
    prompt: "Number of Cars a family owns — is this discrete or continuous?",
    options: ["Discrete", "Continuous"],
    correctIndex: 0,
    explanation: "Cars are counted in whole numbers, so it's discrete.",
  },
  {
    id: "eyeColor",
    prompt: "Eye Color — is this categorical or numerical?",
    options: ["Categorical", "Numerical"],
    correctIndex: 0,
    explanation: "Eye Color describes a group, not a number, so it's categorical.",
  },
  {
    id: "examScore",
    prompt: "Exam Score — is this categorical or numerical?",
    options: ["Categorical", "Numerical"],
    correctIndex: 1,
    explanation: "An exam score is a measured number, so it's numerical.",
  },
  {
    id: "children",
    prompt: "Number of Children in a family — is this discrete or continuous?",
    options: ["Discrete", "Continuous"],
    correctIndex: 0,
    explanation: "Children are counted in whole numbers, so it's discrete.",
  },
];

// --- Section 11 — sampling method game -------------------------------------------

export const SAMPLING_QUESTIONS: ClassifyQuestion[] = [
  {
    id: "everyGrade",
    prompt: "You want to survey students from every grade.",
    options: ["Random", "Systematic", "Stratified", "Convenience"],
    correctIndex: 2,
    explanation: "Splitting the population into grades and sampling from each keeps every grade represented — that's stratified sampling.",
  },
  {
    id: "every10th",
    prompt: "Select every 10th person from a numbered list.",
    options: ["Random", "Systematic", "Stratified", "Convenience"],
    correctIndex: 1,
    explanation: "Choosing individuals at a fixed interval from an ordered list is systematic sampling.",
  },
  {
    id: "randomFull",
    prompt: "Randomly choose 50 students from a complete student list.",
    options: ["Random", "Systematic", "Stratified", "Convenience"],
    correctIndex: 0,
    explanation: "Giving every student on the list an equal chance of selection is simple random sampling.",
  },
  {
    id: "hallway",
    prompt: "Survey the first 20 students you happen to see in the hallway.",
    options: ["Random", "Systematic", "Stratified", "Convenience"],
    correctIndex: 3,
    explanation: "Choosing whoever is easiest to reach, without a plan, is convenience sampling.",
  },
  {
    id: "boysGirls",
    prompt: "You want equal representation of boys and girls, so you sample proportionally from each group.",
    options: ["Random", "Systematic", "Stratified", "Convenience"],
    correctIndex: 2,
    explanation: "Sampling proportionally from predefined groups is stratified sampling.",
  },
];

// --- Shared helpers ---------------------------------------------------------------

/** Deterministic-ish shuffle using Fisher–Yates, seeded by Math.random (fine for a UI resample button). */
export function pickRandomIndices(poolSize: number, count: number): Set<number> {
  const indices = Array.from({ length: poolSize }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }
  return new Set(indices.slice(0, count));
}
