import { TopicCard } from "./topic-card";
import type { Subject } from "@/features/subjects/types";

export function TopicGrid({ subject }: { subject: Subject }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {subject.topics.map((topic) => (
        <TopicCard key={topic.slug} subjectSlug={subject.slug} colorToken={subject.colorToken} topic={topic} />
      ))}
    </div>
  );
}
