import type { CellKind, OrganelleId, Presence } from "../types";

/**
 * Single source of truth for every structure in the Cell Explorer: what it is, where it is found, and what
 * the learner reads about it. The scene, legend, info panel and every activity are driven from this table, so
 * a fact is written once.
 *
 * Accuracy notes (introductory-biology level, generalized "typical" cells):
 * - Mitochondria, ribosomes, ER, Golgi, vesicles, vacuoles, nucleus: shared by plant and animal cells.
 * - Cell wall, chloroplasts, the large central vacuole and plasmodesmata: plant cells only (of the two shown).
 * - Real cells vary: e.g. mature human red blood cells have no nucleus, and root cells have no chloroplasts.
 *   The in-app note and several descriptions say so rather than implying every cell is identical.
 */
export interface OrganelleDef {
  id: OrganelleId;
  name: string;
  presence: Presence;
  /** Legend/accent color (also the base of the shape's gradient in the scene). */
  color: string;
  /** What it does, as one short sentence starting with a verb. Used for matching questions. */
  function: string;
  /** Concise explanation. */
  explanation: string;
  /** How it contributes to the cell as a whole. */
  contribution: string;
  /** Everyday analogy (analogies are memory aids, not exact descriptions). */
  analogy: string;
  /** What it looks like in the diagram, in words (also the screen-reader description). */
  appearance: string;
  /** Hint for finding it in the diagram. */
  where: string;
  /** Optional deeper detail for curious learners. */
  deeper: string;
  /** One memorable, true detail. */
  fact: string;
  /** Extra text that depends on which cell is being viewed. */
  inCell?: Partial<Record<CellKind, string>>;
}

export const ORGANELLES: Record<OrganelleId, OrganelleDef> = {
  cellWall: {
    id: "cellWall",
    name: "Cell Wall",
    presence: "plant",
    color: "#B7955A",
    function: "Gives the plant cell a rigid shape and protects it.",
    explanation:
      "A tough, fairly rigid layer outside the cell membrane, built mainly from cellulose fibres. Water and small molecules pass through it easily; it is the membrane just inside that decides what really enters the cell.",
    contribution:
      "It holds the cell in shape and stops it from bursting when water floods in. Many stiff cells stacked together are what let a plant stand up without a skeleton.",
    analogy: "Like a sturdy cardboard box around a water balloon: the box sets the shape and takes the pressure.",
    appearance: "A thick tan layer forming the outermost boundary of the plant cell.",
    where: "It is the thick outer layer around the whole plant cell, outside the membrane.",
    deeper:
      "Plant cell walls are made mostly of cellulose, hemicellulose and pectin. Fungi, bacteria and algae also have cell walls, but made of different materials. Animal cells have no cell wall.",
    fact: "Cellulose is the most abundant organic polymer on Earth, and it is the main material in wood and cotton.",
  },
  plasmodesmata: {
    id: "plasmodesmata",
    name: "Plasmodesmata",
    presence: "plant",
    color: "#5B7C99",
    function: "Link neighbouring plant cells so substances can pass between them.",
    explanation:
      "Narrow channels that run through the cell walls and connect the cytoplasm of one plant cell to the next. Water, small molecules and signals can move through them.",
    contribution:
      "They let a plant's cells share resources and send signals, so a whole leaf or root can work together instead of as separate islands.",
    analogy: "Like doorways cut through the walls between rooms in a building.",
    appearance: "Thin channels crossing the cell wall, each with a dark thread down the middle.",
    where: "Look for narrow gaps cutting across the thick wall at the cell's edge.",
    deeper:
      "Each channel is lined by the cell membrane and contains a thin strand of endoplasmic reticulum (the desmotubule). Animal cells have different cell-to-cell links, such as gap junctions.",
    fact: "A single plant cell can have thousands of these channels connecting it to its neighbours.",
  },
  cellMembrane: {
    id: "cellMembrane",
    name: "Cell Membrane",
    presence: "both",
    color: "#D9776E",
    function: "Controls what enters and leaves the cell.",
    explanation:
      "A thin, flexible boundary made of a double layer of phospholipids with proteins embedded in it. It is selectively permeable: it lets some substances through, helps others across, and keeps the rest out.",
    contribution:
      "It keeps the inside of the cell different from the outside, so the chemistry of life can run in a stable environment. It also receives signals and helps cells recognise each other.",
    analogy: "Like a security checkpoint at the entrance of a building: it checks what comes in and goes out.",
    appearance: "A thin double line of small beads around the edge of the cell.",
    where: "It is the thin beaded line right at the edge of the cell.",
    deeper:
      "Water moves across by osmosis, small molecules by diffusion or with help from protein channels, and bigger cargo by vesicles (endocytosis and exocytosis). Membrane proteins also work as receptors and pumps.",
    fact: "The phospholipid bilayer is only about 7 to 10 nanometres thick, thousands of times thinner than a sheet of paper.",
    inCell: {
      plant: "In a plant cell it sits just inside the cell wall, pressed against it.",
      animal: "In an animal cell it is the outermost boundary, so it also gives the cell its flexible outline.",
    },
  },
  cytoplasm: {
    id: "cytoplasm",
    name: "Cytoplasm",
    presence: "both",
    color: "#F4C6AE",
    function: "Fills the cell and holds the organelles in place.",
    explanation:
      "Everything inside the cell membrane apart from the nucleus: a watery, jelly-like fluid called cytosol with the organelles suspended in it. Many chemical reactions happen here, including the first steps of breaking down glucose (glycolysis).",
    contribution:
      "It is the medium where substances move around and meet, and where organelles are supported and kept apart from each other.",
    analogy: "Like the open floor of a busy workshop: the machines sit in it and materials move through it.",
    appearance: "The soft coloured background that fills the cell around the organelles.",
    where: "Click the empty space between the organelles.",
    deeper:
      "The cytosol is mostly water, packed with dissolved salts, sugars, amino acids and proteins. A network of protein fibres called the cytoskeleton runs through it and helps shape the cell and move things around.",
    fact: "The cytosol is crowded: proteins and other molecules make up a large share of what is inside, so it behaves more like a gel than a thin liquid.",
    inCell: {
      plant: "In mature plant cells the large central vacuole pushes the cytoplasm into a thin layer against the cell edge.",
    },
  },
  nucleus: {
    id: "nucleus",
    name: "Nucleus",
    presence: "both",
    color: "#A894E0",
    function: "Stores the cell's DNA and controls which genes are used.",
    explanation:
      "A large organelle that holds the cell's DNA, packaged as chromatin. By controlling which genes are switched on, it directs the cell's activities and passes instructions to the rest of the cell.",
    contribution:
      "It is where the cell's instructions are kept safe and copied (as messenger RNA) so that ribosomes can build the proteins the cell needs. It also holds the DNA that is copied when the cell divides.",
    analogy: "Like a library that keeps the master recipe book and only lends out photocopies.",
    appearance: "A large rounded body with a double outline and a dark spot (the nucleolus) inside.",
    where: "Look for the largest rounded structure, with a darker spot inside it.",
    deeper:
      "Cells with a true nucleus are called eukaryotes. Not every cell keeps its nucleus: mature human red blood cells have none, and neither do mature phloem sieve-tube cells in plants.",
    fact: "If the DNA in one human cell were stretched out, it would be about two metres long, yet it fits inside a nucleus only a few micrometres across.",
  },
  nuclearEnvelope: {
    id: "nuclearEnvelope",
    name: "Nuclear Envelope",
    presence: "both",
    color: "#6B58B0",
    function: "Surrounds the nucleus and controls what moves in and out of it.",
    explanation:
      "A double membrane around the nucleus, studded with nuclear pores. The pores let messenger RNA and ribosome parts leave and let proteins such as enzymes enter, while DNA stays inside.",
    contribution:
      "It separates the DNA from the rest of the cell, so gene activity can be controlled, and its pores act as gates between the nucleus and the cytoplasm.",
    analogy: "Like the walls of a records office with a few guarded doors: paperwork goes through, the originals stay put.",
    appearance: "The double outline around the nucleus, with small gaps (pores) along it.",
    where: "It is the double outline around the nucleus, not the middle of it.",
    deeper:
      "The outer membrane of the envelope is continuous with the rough endoplasmic reticulum, which is why the two are drawn touching. Each pore is a large protein complex that selects what may pass.",
    fact: "A typical nucleus has thousands of nuclear pores, and each one can pass cargo in both directions.",
  },
  nucleolus: {
    id: "nucleolus",
    name: "Nucleolus",
    presence: "both",
    color: "#5B49A0",
    function: "Makes ribosome parts inside the nucleus.",
    explanation:
      "A dense region inside the nucleus, with no membrane of its own. It makes ribosomal RNA and assembles it with proteins into the two subunits of ribosomes, which then leave through the nuclear pores.",
    contribution:
      "Ribosomes are needed for making every protein, so the nucleolus supports almost everything else the cell does.",
    analogy: "Like a workshop that builds the machines which will later do the cell's building work.",
    appearance: "A dark, dense spot inside the nucleus.",
    where: "It is the darkest spot inside the nucleus.",
    deeper:
      "The final steps of ribosome assembly finish in the cytoplasm. Cells that make a lot of protein often have a larger or more obvious nucleolus.",
    fact: "Some cells have more than one nucleolus.",
  },
  mitochondria: {
    id: "mitochondria",
    name: "Mitochondria",
    presence: "both",
    color: "#E8825F",
    function: "Release usable energy (ATP) from food molecules.",
    explanation:
      "Bean-shaped organelles with a smooth outer membrane and a folded inner membrane. They carry out most of cellular respiration, using oxygen to turn the energy in glucose into ATP, the molecule cells spend as energy.",
    contribution:
      "Nearly every energy-demanding job in the cell, from building proteins to moving things around, is paid for with ATP, so mitochondria keep the whole cell running.",
    analogy: "Like a power station: it does not create energy, it converts the energy stored in fuel into a form the cell can use.",
    appearance: "Orange bean shapes with folded lines (cristae) inside.",
    where: "Look for the orange bean-shaped organelles with wavy lines inside.",
    deeper:
      "The folds (cristae) give the inner membrane a large surface area for making ATP. Mitochondria contain their own small circle of DNA and can divide on their own. Plant cells have mitochondria too, even though they also have chloroplasts.",
    fact: "Cells that use a lot of energy, such as heart muscle cells, can contain thousands of mitochondria. The diagram shows only a few.",
  },
  ribosomes: {
    id: "ribosomes",
    name: "Ribosomes",
    presence: "both",
    color: "#3D5AFE",
    function: "Build proteins by reading instructions from RNA.",
    explanation:
      "Tiny molecular machines made of RNA and protein. They read a messenger RNA copy of a gene and join amino acids together in the right order to build a protein. Some float free in the cytoplasm; others sit on the rough ER.",
    contribution:
      "Enzymes, membrane channels, structural fibres and many hormones are proteins, so ribosomes make the working parts that every other organelle depends on.",
    analogy: "Like a 3D printer that follows a file (the RNA) to build the part it describes.",
    appearance: "Many tiny blue dots, free in the cytoplasm and attached to the rough ER.",
    where: "Look for tiny blue dots scattered in the cytoplasm, in small clusters.",
    deeper:
      "Ribosomes have two subunits, a large and a small one, assembled in the nucleolus. Free ribosomes mostly make proteins used inside the cell; ribosomes on the rough ER mostly make proteins for membranes or for export.",
    fact: "Ribosomes are so small that a single cell can hold millions of them. Ribosomes are not surrounded by a membrane.",
  },
  roughER: {
    id: "roughER",
    name: "Rough Endoplasmic Reticulum",
    presence: "both",
    color: "#3E9C6C",
    function: "Folds and processes proteins made by its attached ribosomes.",
    explanation:
      "A network of flattened, membrane-bound sacs dotted with ribosomes on the outside. Proteins made there are threaded into the sacs, folded correctly and modified before being sent on.",
    contribution:
      "It is the first stop for proteins that will be exported, placed in membranes or sent to other organelles, so it feeds the Golgi apparatus with finished cargo.",
    analogy: "Like a workshop where freshly made products are shaped and inspected before shipping.",
    appearance: "Green folded sheets covered in tiny blue dots, curving around the nucleus.",
    where: "Look for the green folded sheets covered in dots, next to the nucleus.",
    deeper:
      "Small packages of proteins bud off the ER in transport vesicles that travel to the Golgi apparatus. The rough ER is continuous with the nuclear envelope.",
    fact: "It looks 'rough' under an electron microscope because of the ribosomes studding its surface.",
  },
  smoothER: {
    id: "smoothER",
    name: "Smooth Endoplasmic Reticulum",
    presence: "both",
    color: "#27AFA4",
    function: "Makes lipids and helps break down some toxins.",
    explanation:
      "A network of membrane tubes with no ribosomes on its surface. It makes lipids such as phospholipids and steroids, and in some cells helps detoxify drugs and poisons or stores calcium ions.",
    contribution:
      "The membranes of the whole cell are built from lipids, so the smooth ER helps supply the material for new membranes and for energy storage and signalling molecules.",
    analogy: "Like a chemistry lab that makes oils and neutralises harmful substances.",
    appearance: "Teal branching tubes with no dots on them.",
    where: "Look for the teal branching tubes that have no dots, connected to the rough ER.",
    deeper:
      "It is especially abundant in cells that make steroid hormones and in liver cells, which detoxify many substances. In muscle cells a specialised form stores calcium for contraction.",
    fact: "It is called 'smooth' simply because, unlike the rough ER, it has no ribosomes attached.",
  },
  golgi: {
    id: "golgi",
    name: "Golgi Apparatus",
    presence: "both",
    color: "#F0A85B",
    function: "Modifies, sorts and packages proteins and lipids for delivery.",
    explanation:
      "A stack of flattened membrane sacs. Cargo arrives from the ER in vesicles on one face, is modified (for example, by adding sugars) as it moves through, and leaves from the other face in new vesicles labelled for their destinations.",
    contribution:
      "It makes sure proteins and lipids end up in the right place: the cell membrane, outside the cell, or other organelles.",
    analogy: "Like a post office sorting centre: it receives parcels, labels them and sends them on.",
    appearance: "A stack of curved golden-orange layers with small vesicles budding from one side.",
    where: "Look for the stack of curved golden layers with small bubbles near its edge.",
    deeper:
      "The receiving side is called the cis face and the shipping side the trans face. In plant cells the Golgi also builds some of the carbohydrates used in the cell wall, and plant cells have many separate Golgi stacks.",
    fact: "It is named after Camillo Golgi, the Italian scientist who first saw it in 1898.",
  },
  vesicles: {
    id: "vesicles",
    name: "Vesicles",
    presence: "both",
    color: "#E0568F",
    function: "Carry materials between organelles and to or from the cell surface.",
    explanation:
      "Small, membrane-bound sacs. They bud off one membrane, carry their contents through the cytoplasm and fuse with another membrane to deliver them. Some bring materials in (endocytosis) and others release them outside (exocytosis).",
    contribution:
      "They link the parts of the cell together, moving proteins and lipids between the ER, the Golgi apparatus and the cell membrane without letting contents mix with the cytoplasm.",
    analogy: "Like delivery vans carrying sealed packages from one place to another.",
    appearance: "Small pink spheres near the Golgi apparatus, the ER and the cell edge.",
    where: "Look for the small pink bubbles, especially near the Golgi apparatus.",
    deeper:
      "Vesicles are simply small membrane compartments, so they come in many kinds: transport vesicles, secretory vesicles, and others. A vesicle that fuses with the membrane adds its membrane to the cell surface.",
    fact: "Nerve cells use vesicles to release chemical messengers across the gaps between neurons.",
  },
  vacuole: {
    id: "vacuole",
    name: "Vacuoles",
    presence: "both",
    color: "#8DC4EE",
    function: "Store water, nutrients or wastes in a membrane-bound sac.",
    explanation:
      "Fluid-filled sacs surrounded by a membrane. They hold water, dissolved substances, nutrients or wastes, keeping them separate from the rest of the cytoplasm.",
    contribution:
      "They act as the cell's storage compartments, helping it balance water and keep wastes away from sensitive reactions.",
    analogy: "Like storage tanks that hold supplies until they are needed.",
    appearance: "Round, pale-blue sacs with a thin outline.",
    where: "Look for the round pale-blue sacs, smaller than the nucleus.",
    deeper:
      "Animal cells usually have only small or temporary vacuoles. Young plant cells start with several small vacuoles, which fuse together into one large central vacuole as the cell grows.",
    fact: "Some single-celled organisms have a contractile vacuole that pumps excess water out, so the cell does not burst.",
    inCell: {
      animal: "Animal cells have small vacuoles like these, but nothing like a plant cell's large central vacuole.",
      plant: "These small vacuoles are typical of younger cells. As the cell matures they merge into the large central vacuole.",
    },
  },
  largeVacuole: {
    id: "largeVacuole",
    name: "Large Central Vacuole",
    presence: "plant",
    color: "#7DB6E4",
    function: "Stores water and keeps the plant cell firm.",
    explanation:
      "One huge fluid-filled vacuole, surrounded by a membrane called the tonoplast. It stores water, ions, sugars, pigments and wastes, and its water pushes outward against the cell wall.",
    contribution:
      "That outward push (turgor pressure) keeps the cell firm, which keeps leaves and stems upright. When a plant loses water, the vacuoles shrink and the plant wilts.",
    analogy: "Like a water-filled balloon pressing out against a box: the pressure holds the box firm.",
    appearance: "A very large pale-blue sac filling most of the middle of the plant cell.",
    where: "It is the very large pale-blue space in the middle of the plant cell.",
    deeper:
      "In many mature plant cells it takes up most of the cell volume, squeezing the cytoplasm into a thin layer near the wall. Pigments stored in it give some flowers and fruit their colour.",
    fact: "A wilted plant often recovers after watering because the vacuoles refill and push the cells firm again.",
  },
  chloroplast: {
    id: "chloroplast",
    name: "Chloroplasts",
    presence: "plant",
    color: "#4FAE3C",
    function: "Capture light energy to make sugar by photosynthesis.",
    explanation:
      "Green, double-membrane organelles containing stacks of flat discs (grana) rich in chlorophyll. Using light, water and carbon dioxide, they make glucose and release oxygen.",
    contribution:
      "They supply the plant with food and the energy stored in it, and they are the source of most of the oxygen in the air and of the energy that food chains depend on.",
    analogy: "Like a solar-powered kitchen that makes its own food from sunlight.",
    appearance: "Green oval organelles with stacks of discs inside.",
    where: "Look for the green ovals with stacks of discs, mostly near the edge of the cell.",
    deeper:
      "Chloroplasts have their own DNA, like mitochondria. Not every plant cell has them: cells in roots, for example, are not exposed to light and have none. Plants still need mitochondria to release the energy in the sugar the chloroplasts make.",
    fact: "Chlorophyll absorbs red and blue light and reflects green, which is why leaves look green.",
  },
};

/** Fixed display order used by the legend, tables and activities. */
export const ORGANELLE_ORDER: OrganelleId[] = [
  "cellWall",
  "cellMembrane",
  "cytoplasm",
  "nucleus",
  "nuclearEnvelope",
  "nucleolus",
  "mitochondria",
  "chloroplast",
  "ribosomes",
  "roughER",
  "smoothER",
  "golgi",
  "vesicles",
  "vacuole",
  "largeVacuole",
  "plasmodesmata",
];

export function isPresent(id: OrganelleId, kind: CellKind): boolean {
  const presence = ORGANELLES[id].presence;
  return presence === "both" || presence === kind;
}

/** Structures that appear in the given cell, in display order. */
export function organellesFor(kind: CellKind): OrganelleDef[] {
  return ORGANELLE_ORDER.filter((id) => isPresent(id, kind)).map((id) => ORGANELLES[id]);
}

export function getOrganelle(id: string | null | undefined): OrganelleDef | null {
  if (!id) return null;
  return (ORGANELLES as Record<string, OrganelleDef | undefined>)[id] ?? null;
}

export const PRESENCE_LABEL: Record<Presence, string> = {
  both: "Found in plant and animal cells",
  plant: "Plant cells only (of the two shown)",
  animal: "Animal cells only",
};

export const PRESENCE_SHORT: Record<Presence, string> = {
  both: "Both cell types",
  plant: "Plant cells only",
  animal: "Animal cells only",
};
