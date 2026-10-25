"use client";

/**
 * Last resort: renders when the root layout itself fails, so it cannot rely on the app's providers, themes or
 * Tailwind variables. Plain, high-contrast inline styles on purpose.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#142019" }}>
        <div role="alert" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Something went wrong.</p>
          <p style={{ margin: 0, maxWidth: 420, color: "#3d4a44" }}>The page could not be shown. Nothing you did caused this. Please try again.</p>
          <button type="button" onClick={reset} style={{ minHeight: 44, padding: "0 20px", borderRadius: 8, border: 0, background: "#175748", color: "#ffffff", fontSize: 16, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
