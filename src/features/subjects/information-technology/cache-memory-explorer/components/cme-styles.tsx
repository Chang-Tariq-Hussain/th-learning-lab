/**
 * Keyframes used only by the Cache Memory Explorer, scoped with a
 * `cme-` prefix. Kept local (rather than added to the shared Tailwind
 * config or globals.css) so this simulation doesn't touch shared
 * styling. The app-wide `prefers-reduced-motion` rule in globals.css
 * already collapses animation durations, so these need no extra guard.
 */
const CSS = `
@keyframes cme-flash { 0% { background-color: rgba(16,185,129,0.5); } 100% { background-color: rgba(16,185,129,0); } }
@keyframes cme-pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
@keyframes cme-slide { 0% { transform: translateY(-6px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
.cme-flash { animation: cme-flash 1.3s ease-out 1; }
.cme-pop { display: inline-block; animation: cme-pop 0.25s ease-out 1; }
.cme-slide { animation: cme-slide 0.3s ease-out 1; }
`;

export function CmeStyles() {
  return <style>{CSS}</style>;
}
