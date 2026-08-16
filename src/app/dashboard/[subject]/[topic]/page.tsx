import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RulerDivider } from "@/components/ui/ruler-divider";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { TopicVisualizationsSection } from "@/components/dashboard/topic-visualizations-section";
import {
  subjects,
  getSubjectBySlug,
  getTopicBySlug,
} from "@/features/subjects/data/subjects";

interface TopicPageProps {
  params: { subject: string; topic: string };
}

/** Every (subject, topic) pair — adding a topic to `data/subjects.ts` automatically gets a working page here, no new route file needed. */
export function generateStaticParams() {
  return subjects.flatMap((subject) =>
    subject.topics.map((topic) => ({
      subject: subject.slug,
      topic: topic.slug,
    })),
  );
}

export function generateMetadata({ params }: TopicPageProps): Metadata {
  const subject = getSubjectBySlug(params.subject);
  const topic = subject && getTopicBySlug(subject, params.topic);
  if (!subject || !topic) return {};
  return {
    title: `${topic.name} · ${subject.name}`,
    description: `${topic.visualizations.length} interactive ${topic.visualizations.length === 1 ? "activity" : "activities"} in ${topic.name}.`,
  };
}

export default function TopicPage({ params }: TopicPageProps) {
  const subject = getSubjectBySlug(params.subject);
  const topic = subject && getTopicBySlug(subject, params.topic);
  if (!subject || !topic) notFound();

  const Icon = topic.slug;

  return (
    <div className="lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-16">
          <Sidebar className="h-[calc(100vh-4rem)]" />
        </div>
      </aside>

      <div className="min-w-0">
        <Container className="py-14">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: subject.name, href: `/dashboard/${subject.slug}` },
              { label: topic.name },
            ]}
            className="mb-6"
          />

          <SectionHeading
            eyebrow={subject.name}
            title={topic.name}
            description={
              topic.visualizations.length > 0
                ? `${topic.visualizations.length} interactive ${topic.visualizations.length === 1 ? "activity" : "activities"} to explore.`
                : "This topic doesn't have any activities yet."
            }
          />

          <RulerDivider className="my-10" />

          <TopicVisualizationsSection
            visualizations={topic.visualizations}
            icon={Icon}
            colorToken={subject.colorToken}
          />
        </Container>
      </div>
    </div>
  );
}
