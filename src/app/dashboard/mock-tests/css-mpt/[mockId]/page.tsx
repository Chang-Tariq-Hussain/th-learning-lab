import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { MptMockTest } from "@/features/mpt-mock";
import { MPT_MOCKS, getMockById } from "@/features/mpt-mock/engine";
import { mockLabel } from "@/features/mpt-mock/test-defs";

interface Props {
  params: { mockId: string };
}

/** Only registered mocks exist; any other id is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return MPT_MOCKS.map((m) => ({ mockId: m.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const mock = getMockById(params.mockId);
  if (!mock) return {};
  return {
    title: mock.title,
    description: `${mock.title}: ${mock.totalQuestions} questions in ${mock.timeMinutes} minutes, passing ${mock.passMarks}/${mock.totalQuestions}, with review and section analysis.`,
  };
}

export default function MockPage({ params }: Props) {
  const mock = getMockById(params.mockId);
  if (!mock) notFound();
  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mock Tests", href: "/dashboard/mock-tests" },
          { label: "CSS MPT", href: "/dashboard/mock-tests/css-mpt" },
          { label: mockLabel(mock.id) },
        ]}
        className="mb-4"
      />
      <MptMockTest testId={mock.id} />
    </Container>
  );
}
