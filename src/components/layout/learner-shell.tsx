"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { UserProfileProvider } from "@/hooks/use-user-profile";
import { LearningProgressProvider } from "@/hooks/use-learning-progress";
import { PracticePerformanceProvider } from "@/hooks/use-practice-performance";
import { UsernameSetup } from "@/components/onboarding/username-setup";

/**
 * Learner chrome: providers (which read localStorage), navbar, footer and the
 * username prompt. The admin area under /admin renders without any of it, so
 * learner state never loads — or prompts for a name — inside the console.
 */
export function LearnerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;

  return (
    <UserProfileProvider>
      <LearningProgressProvider>
        <PracticePerformanceProvider>
          <SkipLink />
          <div id="learner-app" className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
          </div>
          <UsernameSetup />
        </PracticePerformanceProvider>
      </LearningProgressProvider>
    </UserProfileProvider>
  );
}
