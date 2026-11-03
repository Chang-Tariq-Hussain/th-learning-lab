"use client";

/** What the picture is, and is not. Always available, so the simplification is never hidden. */
export function ModelNote() {
  return (
    <section aria-label="About this model" className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <h3 className="font-display text-base font-medium text-ink dark:text-bone">About this model</h3>
      <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm text-ink-soft dark:text-bone-soft">
        <li>This is a simplified, Bohr-style teaching model. It is not a literal picture of an atom.</li>
        <li>Not to scale: in a real atom the nucleus is about 100,000 times smaller than the whole atom, and nucleons are not coloured balls.</li>
        <li>Shells are an introductory way to count how electrons are arranged. Real electrons do not follow circular paths; they are described by orbitals, regions where an electron is likely to be found.</li>
        <li>The slow movement along each ring is only there to keep the picture readable. It does not show real electron motion.</li>
        <li>The proton count sets the element, the neutron count sets the isotope (mass number = protons + neutrons), and the electron count sets the charge (charge = protons − electrons).</li>
      </ul>
    </section>
  );
}
