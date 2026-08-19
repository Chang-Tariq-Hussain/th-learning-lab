import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { WaveSpeed } from "@/features/subjects/physics/wave-speed";

export const metadata: Metadata = {
  title: "Wave Speed — v = fλ",
  description:
    "Change frequency and wavelength independently to see how wave speed responds, and discover the relationship v = fλ by interacting with the wave itself.",
};

export default function WaveSpeedPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/wave-speed" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Wave Motion", href: "/dashboard/physics/wave-motion" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Wave Motion
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Wave Speed — v = fλ
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Adjust frequency and wavelength independently and watch how wave speed responds — the relationship is
          easier to feel than to memorize.
        </p>
      </div>

      <WaveSpeed />

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "State the relationship between wave speed, frequency, and wavelength.",
          "Predict how wave speed changes when frequency or wavelength changes.",
          "Explain why increasing frequency doesn't always mean increasing speed.",
          "Use v = fλ to solve for any one variable given the other two.",
        ]}
        concepts={[
          {
            term: "Frequency (f)",
            explanation:
              "How many complete wave cycles pass a fixed point every second, measured in hertz (Hz). A higher frequency means the wave oscillates faster.",
          },
          {
            term: "Wavelength (λ)",
            explanation:
              "The distance between two matching points on the wave, like crest to crest. A longer wavelength means the wave is more stretched out.",
          },
          {
            term: "Wave speed",
            explanation:
              "How fast the wave pattern itself travels through the medium. It's determined by frequency and wavelength together, not by either one alone.",
            formula: "v = f\\lambda",
            formulaCaption: "speed = frequency × wavelength",
          },
          {
            term: "The trade-off",
            explanation:
              "For a wave moving through a given medium, speed usually stays fixed — so if frequency goes up, wavelength has to go down to compensate, and vice versa. That's why v = fλ works like a balance: change one side, and the other side shifts to keep speed constant.",
          },
        ]}
        howToUse={[
          "Set a frequency and a wavelength, and note the wave speed that results.",
          "Increase the frequency while keeping the same medium and watch what happens to the wavelength.",
          "Now increase the wavelength instead and watch how frequency responds.",
          "Try to find two different frequency/wavelength combinations that give the exact same wave speed.",
        ]}
        whyItMatters="This same v = fλ relationship explains why a radio station can broadcast at a set frequency while its wavelength is fixed by the speed of light, why red light and blue light travel at the same speed but have different wavelengths and frequencies, and why sound waves of different pitches (frequencies) all travel through air at roughly the same speed. Once you can move fluently between speed, frequency, and wavelength, a whole range of wave phenomena — from music to radio to color — starts to make sense as one underlying pattern."
        tryThis={[
          "Double the frequency without changing the medium. What happens to the wavelength, and does the speed change?",
          "Find a combination where wavelength is small but frequency is also small. Is that possible while keeping the same wave speed?",
          "Before adjusting either slider, predict which direction the other value will move — then check your prediction.",
        ]}
      />
    </Container>
  );
}
