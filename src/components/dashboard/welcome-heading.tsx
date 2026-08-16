"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { useUserProfile } from "@/hooks/use-user-profile";

/**
 * The only part of the dashboard page that needs to be a client
 * component — everything else (`Sidebar`, `SubjectGrid`, the page
 * shell) stays server-rendered. Falls back to the generic copy until
 * hydration confirms a saved name, so there's no mismatch flash.
 */
export function WelcomeHeading() {
  const { username, hydrated } = useUserProfile();
  const firstName = username?.split(" ")[0];

  if (hydrated && firstName) {
    return (
      <SectionHeading
        eyebrow="Dashboard"
        title={`Welcome back, ${firstName} 👋`}
        description="What would you like to learn today?"
      />
    );
  }

  return (
    <SectionHeading
      eyebrow="Dashboard"
      title="Choose a subject to explore."
      description="Every card below will open into a dedicated workspace with concept notes and, soon, an interactive simulation."
    />
  );
}
