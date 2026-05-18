import Link from "next/link";

interface ShellProps {
  active: "dashboard" | "chat" | "sessions" | "resources" | "profile";
  pageCode: string;
  pageTitle: string;
  children: React.ReactNode;
}

const NAV = [
  { key: "dashboard", label: "Today", href: "/student/dashboard" },
  { key: "chat", label: "Chat", href: "/student/chat" },
  { key: "sessions", label: "Sessions", href: "/student/sessions" },
  { key: "resources", label: "Resources", href: "/student/resources" },
  { key: "profile", label: "Profile", href: "/student/profile" },
] as const;

export function Shell({ active, pageCode, pageTitle, children }: ShellProps) {
  return (
    <main className="min-h-screen bg-[var(--paper)] flex justify-center p-3 md:p-8">
      <div
        className="w-full max-w-[1100px] bg-[var(--paper)] border border-[var(--rule)]
                   grid grid-cols-1 md:grid-cols-[56px_1fr] min-h-[calc(100vh-1.5rem)]"
      >
        <nav
          aria-label="Student navigation"
          className="hidden md:flex flex-col justify-between border-r border-[var(--rule)] py-6"
        >
          <div className="flex flex-col gap-1">
            {NAV.map((item) => {
              const isActive = item.key === active;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`relative flex items-center justify-center h-14 italic-serif text-sm
                    ${isActive ? "text-[var(--ink)] font-bold" : "text-[var(--ink-soft)]"}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label[0]}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[var(--ink)]" />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="text-center text-[var(--ink-faint)] text-[10px] tracking-widest uppercase">
            M
          </div>
        </nav>

        <section className="flex flex-col p-4 md:p-10 gap-4 md:gap-6 min-w-0">
          <header className="flex items-start justify-between gap-4">
            <div>
              <div className="meta">{pageCode}</div>
              <h1 className="serif text-2xl md:text-4xl font-medium leading-tight mt-1">
                {pageTitle}
              </h1>
            </div>
            <div className="meta hidden md:block">MentorIIT</div>
          </header>
          <div className="rule" aria-hidden />
          {children}
        </section>

        {/* mobile bottom nav */}
        <nav
          aria-label="Student navigation mobile"
          className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--paper)] border-t border-[var(--rule)]
                     flex justify-around py-2 z-10"
        >
          {NAV.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 italic-serif text-xs
                  ${isActive ? "text-[var(--ink)] font-bold" : "text-[var(--ink-soft)]"}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-base">{item.label[0]}</span>
                <span className="text-[10px] not-italic font-sans tracking-wide uppercase">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
