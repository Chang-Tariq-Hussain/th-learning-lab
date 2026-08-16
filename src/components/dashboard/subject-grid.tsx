import { subjects } from "@/features/subjects/data/subjects";
import { SubjectCard } from "@/components/dashboard/subject-card";

export function SubjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {subjects.map((subject) => (
        <SubjectCard key={subject.slug} subject={subject} />
      ))}
    </div>
  );
}
