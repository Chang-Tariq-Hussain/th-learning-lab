import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { MptMockTest } from "@/features/mpt-mock";
import { MPT_MOCKS, getMockById } from "@/features/mpt-mock/engine";
import { buildSectionTest, CSS_MPT_BASE, mockLabel } from "@/features/mpt-mock/test-defs";

interface Props {
  params: { mockId: string; sectionCode: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return MPT_MOCKS.flatMap((m) => m.sections.map((s) => ({ mockId: m.id, sectionCode: s.code })));
}

function resolve(params: Props["params"]) {
  const mock = getMockById(params.mockId);
  return mock ? buildSectionTest(mock, params.sectionCode) : null;
}

export function generateMetadata({ params }: Props): Metadata {
  const test = resolve(params);
  if (!test) return {};
  return {
    title: test.title,
    description: `${test.title}: ${test.totalQuestions} questions in ${test.timeMinutes} minutes, pass mark ${test.passMarks}, with review and analysis.`,
  };
}

export default function SectionTestPage({ params }: Props) {
  const test = resolve(params);
  if (!test) notFound();
  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mock Tests", href: "/dashboard/mock-tests" },
          { label: "CSS MPT", href: CSS_MPT_BASE },
          { label: mockLabel(test.mockId), href: `${CSS_MPT_BASE}/${test.mockId}` },
          { label: test.sections[0]?.subject.split(" / ")[0] ?? "Section" },
        ]}
        className="mb-4"
      />
      <MptMockTest testId={test.id} />
    </Container>
  );
}
