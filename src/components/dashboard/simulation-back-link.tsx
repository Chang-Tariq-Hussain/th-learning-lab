import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVisualizationParent } from "@/features/subjects/data/subjects";

export interface SimulationBackLinkProps {
  /** This simulation's own route, e.g. "/dashboard/biology/cell-explorer" — used to look up its topic in the registry. */
  simulationHref: string;
  className?: string;
}

/**
 * Every simulation page renders this with just its own href; the
 * correct parent topic (and therefore the correct "back" destination)
 * is derived from the same registry that builds the topic/subject
 * pages, so it can't drift out of sync route by route.
 */
export function SimulationBackLink({ simulationHref, className }: SimulationBackLinkProps) {
  const parent = getVisualizationParent(simulationHref);
  const backHref = parent ? `/dashboard/${parent.subject.slug}/${parent.topic.slug}` : "/dashboard";
  const label = parent ? `Back to ${parent.topic.name}` : "Back to Dashboard";

  return (
    <Button href={backHref} variant="ghost" size="md" className={className} aria-label={label}>
      <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </Button>
  );
}
