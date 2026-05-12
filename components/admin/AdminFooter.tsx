import { business } from "@/lib/business";

export function AdminFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-background-alt)]">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[var(--color-fg-subtle)]">{business.copyright}</p>
        <p className="text-xs text-[var(--color-fg-subtle)]">
          Internal admin · not indexed
        </p>
      </div>
    </footer>
  );
}
