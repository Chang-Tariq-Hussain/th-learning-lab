import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DnsSimulator } from "@/features/subjects/information-technology/dns-simulator";

const SIMULATION_HREF = "/dashboard/information-technology/dns-simulator";

export const metadata: Metadata = {
  title: "DNS Simulator",
  description:
    "See how domain names become IP addresses: DNS queries and responses, the root, TLD and authoritative servers, recursive resolution, DNS records, caching and TTL, and what happens when a lookup fails.",
};

export default function DnsSimulatorPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Information Technology", href: "/dashboard/information-technology" },
          { label: "Networking Fundamentals", href: "/dashboard/information-technology/networking-fundamentals" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-it">Information Technology · Networking Fundamentals</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">DNS Simulator</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The ninth topic in the Networking branch. See how a name like www.example.com becomes an IP address: the query, the DNS hierarchy, recursive resolution, records, caching and TTL, and what happens when a lookup goes wrong.
        </p>
      </div>

      <DnsSimulator />
    </Container>
  );
}
