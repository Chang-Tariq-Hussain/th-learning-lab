import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { themeIds } from "@/config/themes";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { UserProfileProvider } from "@/hooks/use-user-profile";
import { LearningProgressProvider } from "@/hooks/use-learning-progress";
import { PracticePerformanceProvider } from "@/hooks/use-practice-performance";
import { UsernameSetup } from "@/components/onboarding/username-setup";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Learn science by doing it`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={themeIds}
        >
          <UserProfileProvider>
            <LearningProgressProvider>
              <PracticePerformanceProvider>
                <SkipLink />
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
                <UsernameSetup />
              </PracticePerformanceProvider>
            </LearningProgressProvider>
          </UserProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
