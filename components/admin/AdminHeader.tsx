import { business } from "@/lib/business";

export function AdminHeader() {
  return (
    <header className="fixed top-3 md:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] md:w-auto">
      <div className="relative mx-auto overflow-hidden rounded-full border border-[var(--color-border)] bg-white/85 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.25)] ring-1 ring-white/60 backdrop-blur-xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
          style={{
            background:
              "linear-gradient(115deg, var(--color-cyan-glow) 0%, transparent 35%, transparent 65%, var(--color-accent-glow) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-cyan)]/40 to-transparent"
        />

        <div className="relative flex h-14 md:h-16 items-center justify-between gap-4 md:gap-8 px-4 md:px-6">
          <a href="/en" className="flex items-center" aria-label={`${business.name} home`}>
            <span className="relative block w-32 md:w-44 h-11 md:h-13 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt={business.name}
                className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2"
              />
            </span>
          </a>

          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-cyan)] bg-[var(--color-cyan-glow)] border border-[var(--color-cyan)]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
              Admin
            </span>
            <span className="text-sm font-medium text-[var(--color-fg-muted)]">Dashboard</span>
          </div>

          <a
            href="/en"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium border border-[var(--color-border)] bg-white/70 text-[var(--color-fg)] hover:border-[var(--color-border-hover)] hover:bg-white transition-colors"
          >
            ← Back to site
          </a>
        </div>
      </div>
    </header>
  );
}
