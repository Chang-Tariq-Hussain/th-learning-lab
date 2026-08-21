import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RulerDivider } from "@/components/ui/ruler-divider";
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
    <div className="lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <Sidebar className="h-[calc(100vh-7rem)]" />
        </div>
      </aside>

      <div className="min-w-0">
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
            </div>
          ) : null}

          <RulerDivider className="my-10" />

          <TopicGrid subject={subject} />
        </Container>
      </div>
    </div>
  );
}
