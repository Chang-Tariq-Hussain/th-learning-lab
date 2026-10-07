import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MockTestCategory } from "../registry";

export function CategoryCard({ category }: { category: MockTestCategory }) {
  const body = (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{category.eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl text-ink dark:text-bone">{category.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{category.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${category.title} facts`}>
        {category.facts.map((f) => (
          <li key={f}>
            <Badge>{f}</Badge>
          </li>
        ))}
      </ul>
      <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink dark:text-bone">
        {category.available ? "Open tests" : "Coming soon"}
        {category.available ? <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden /> : null}
      </p>
    </>
  );
  const cls = "block rounded-xl border border-line p-6 transition dark:border-line-dark";
  return category.available ? (
    <Link href={category.href} className={`${cls} hover:border-pine-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500`}>
      {body}
    </Link>
  ) : (
    <div className={`${cls} opacity-60`} aria-disabled="true">
      {body}
    </div>
  );
}
