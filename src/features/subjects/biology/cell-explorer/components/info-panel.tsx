"use client";

import { Lightbulb, MousePointerClick, Telescope } from "lucide-react";
import { type OrganelleDef, PRESENCE_LABEL } from "../data/organelles";
import type { CellKind } from "../types";
import { OrganelleGlyph } from "./organelle-glyph";

export interface InfoPanelProps {
  organelle: OrganelleDef | null;
  kind: CellKind;
}

const shell = "rounded-[1.5rem] border p-5 sm:p-6";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-mono text-label uppercase tracking-eyebrow text-ink-soft dark:text-bone-soft">{title}</h4>
      <p className="mt-1 text-base leading-relaxed text-ink dark:text-bone">{children}</p>
    </div>
  );
}

/** Name, function, explanation, role in the whole cell, analogy and optional deeper detail for the selected structure. */
export function InfoPanel({ organelle, kind }: InfoPanelProps) {
  if (!organelle) {
    return (
      <div className={`${shell} flex min-h-[200px] flex-col items-center justify-center gap-3 border-dashed border-line bg-white/50 text-center dark:border-line-dark dark:bg-white/[0.03]`}>
        <MousePointerClick className="h-6 w-6 text-ink-soft dark:text-bone-soft" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-base text-ink-soft dark:text-bone-soft">Select any part of the cell, or pick one from the legend, to see what it does.</p>
        <p className="max-w-md text-helper text-ink-soft dark:text-bone-soft">
          This is a typical, simplified {kind} cell. Real cells differ: for example, mature human red blood cells have no nucleus.
        </p>
      </div>
    );
  }

  const note = organelle.inCell?.[kind];
  return (
    <article aria-live="polite" className={`${shell} flex flex-col gap-4 border-line bg-white/70 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]`} data-testid="info-panel">
      <header className="flex items-start gap-3">
        <OrganelleGlyph id={organelle.id} size={34} />
        <div className="min-w-0">
          <h3 className="font-display text-xl font-medium text-ink dark:text-bone" data-testid="info-name">
            {organelle.name}
          </h3>
          <p className="mt-0.5 inline-flex items-center rounded-full border border-subject-biology px-2 py-0.5 text-label font-medium text-subject-biology" data-testid="info-presence">
            {PRESENCE_LABEL[organelle.presence]}
          </p>
        </div>
      </header>

      <Section title="What it does">
        <strong className="font-semibold">{organelle.function}</strong> {organelle.explanation}
      </Section>
      <Section title="Why the cell needs it">{organelle.contribution}</Section>
      <Section title="Think of it like this">{organelle.analogy}</Section>
      {note ? (
        <p className="rounded-xl bg-subject-biology-soft px-3 py-2 text-sm leading-relaxed text-subject-biology dark:bg-subject-biology/15">
          <span className="font-semibold">In this {kind} cell: </span>
          {note}
        </p>
      ) : null}

      <details className="group rounded-xl border border-line px-3 py-2 dark:border-line-dark">
        <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 text-sm font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:text-bone dark:focus-visible:outline-bone">
          <Telescope className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Go deeper
        </summary>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{organelle.deeper}</p>
      </details>

      <p className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        <span>
          <span className="font-medium text-ink dark:text-bone">Fun fact: </span>
          {organelle.fact}
        </span>
      </p>
    </article>
  );
}
