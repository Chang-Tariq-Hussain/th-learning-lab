import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { SubjectGrid } from "@/components/dashboard/subject-grid";
import { RulerDivider } from "@/components/ui/ruler-divider";

export function SubjectsPreview() {
  return (
    <section className="border-y border-line bg-white/40 py-20 dark:border-line-dark dark:bg-white/[0.02] sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Subjects"
            title="Four subjects, one consistent workspace."
            description="Each subject follows the same card and topic-page pattern, so switching between them never feels like switching apps."
          />
          <Button href="/dashboard" variant="secondary" className="shrink-0">
            View full dashboard
          </Button>
        </div>

        <RulerDivider className="my-10" />

        <SubjectGrid />
      </Container>
    </section>
  );
}
