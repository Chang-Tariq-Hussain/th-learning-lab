"use client";

import { cn } from "@/lib/utils";
import type { ScheduleResult } from "../model";

export interface MetricsPanelProps {
  result: ScheduleResult;
  className?: string;
}

/**
 * The scheduling-metrics table: Completion, Turnaround, Waiting, and
 * Response time per process, plus the three averages called out in
 * the brief. Formulas are shown once, above the table, rather than
 * repeated per row.
 */
export function MetricsPanel({ result, className }: MetricsPanelProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="grid gap-2 rounded-card bg-ink/[0.03] p-3 text-xs text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft sm:grid-cols-3">
        <p><span className="font-medium text-ink dark:text-bone">Turnaround</span> = Completion − Arrival</p>
        <p><span className="font-medium text-ink dark:text-bone">Waiting</span> = Turnaround − Burst</p>
        <p><span className="font-medium text-ink dark:text-bone">Response</span> = First run − Arrival</p>
      </div>

      <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-ink/[0.03] text-left text-xs uppercase tracking-wide text-ink-soft dark:border-line-dark dark:bg-bone/[0.05] dark:text-bone-soft">
              <th className="px-3 py-2 font-medium">Process</th>
              <th className="px-3 py-2 font-medium">Arrival</th>
              <th className="px-3 py-2 font-medium">Burst</th>
              <th className="px-3 py-2 font-medium">Completion</th>
              <th className="px-3 py-2 font-medium">Turnaround</th>
              <th className="px-3 py-2 font-medium">Waiting</th>
              <th className="px-3 py-2 font-medium">Response</th>
            </tr>
          </thead>
          <tbody>
            {result.processResults.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0 dark:border-line-dark">
                <td className="px-3 py-2 font-mono font-medium text-subject-it">{r.id}</td>
                <td className="px-3 py-2 font-mono">{r.arrivalTime}</td>
                <td className="px-3 py-2 font-mono">{r.burstTime}</td>
                <td className="px-3 py-2 font-mono">{r.completionTime}</td>
                <td className="px-3 py-2 font-mono">{r.turnaroundTime}</td>
                <td className="px-3 py-2 font-mono">{r.waitingTime}</td>
                <td className="px-3 py-2 font-mono">{r.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-card border border-line p-3 dark:border-line-dark">
          <p className="text-xs text-ink-soft dark:text-bone-soft">Average Waiting Time</p>
          <p className="font-mono text-lg font-medium text-ink dark:text-bone">{result.averageWaitingTime}</p>
        </div>
        <div className="rounded-card border border-line p-3 dark:border-line-dark">
          <p className="text-xs text-ink-soft dark:text-bone-soft">Average Turnaround Time</p>
          <p className="font-mono text-lg font-medium text-ink dark:text-bone">{result.averageTurnaroundTime}</p>
        </div>
        <div className="rounded-card border border-line p-3 dark:border-line-dark">
          <p className="text-xs text-ink-soft dark:text-bone-soft">Average Response Time</p>
          <p className="font-mono text-lg font-medium text-ink dark:text-bone">{result.averageResponseTime}</p>
        </div>
      </div>
    </div>
  );
}
