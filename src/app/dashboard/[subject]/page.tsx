import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RulerDivider } from "@/components/ui/ruler-divider";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { TopicGrid } from "@/components/dashboard/topic-grid";
import { subjects, getSubjectBySlug } from "@/features/subjects/data/subjects";
import { getLearningPathsForSubject, LearningPathTrack } from "@/features/learning-path";

interface SubjectPageProps {
  params: { subject: string };
}

/** One entry per subject — adding a fifth subject to `data/subjects.ts` automatically gets a working hub page here, no new route file needed. */
export function generateStaticParams() {
  return subjects.map((subject) => ({ subject: subject.slug }));
}

export function generateMetadata({ params }: SubjectPageProps): Metadata {
  const subject = getSubjectBySlug(params.subject);
  if (!subject) return {};
  return {
    title: subject.name,
    description: subject.description,
  };
}

export default function SubjectHubPage({ params }: SubjectPageProps) {
  const subject = getSubjectBySlug(params.subject);
  if (!subject) notFound();

  // Empty for any subject that doesn't have a registered path yet —
  // this section simply doesn't render for those, no special-casing
  // needed per subject.
  const learningPaths = getLearningPathsForSubject(subject.slug);

  return (
    <Container className="py-14">
      <Breadcrumbs
        items={[{ label: "Dashboard", href: "/dashboard" }, { label: subject.name }]}
        className="mb-6"
      />

      <SectionHeading eyebrow={subject.code} title={subject.name} description={subject.description} />

      {learningPaths.length > 0 ? (
        <div className="my-10 flex flex-col gap-6">
          {learningPaths.map((path) => (
            <LearningPathTrack key={path.id} path={path} />
          ))}

          <div className="flex flex-col items-start gap-3 rounded-card border border-dashed border-ink/15 px-5 py-4 dark:border-bone/20 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              Follow the Learning Path for guided progression, or explore any simulation freely.
            </p>
            <Button href="#simulations" variant="secondary" size="sm" className="shrink-0">
              Explore All Simulations
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}

      <RulerDivider className="my-10" />

      <div id="simulations" className="scroll-mt-28">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          All Simulations
        </p>
        <TopicGrid subject={subject} />
      </div>
    </Container>
  );
}
