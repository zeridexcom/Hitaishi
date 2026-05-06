import { cn } from "@/lib/cn";

type Props = {
  label?: string;
  aspect?: string;
  className?: string;
  rounded?: boolean;
  ariaLabel?: string;
};

// Replaces next/image until client provides real assets.
// All real images should swap this for <Image /> with src/alt later.
export function PlaceholderImage({
  label,
  aspect = "aspect-[4/3]",
  className,
  rounded = true,
  ariaLabel,
}: Props) {
  return (
    <div
      role="img"
      aria-label={ariaLabel ?? label ?? "Image placeholder"}
      className={cn(
        aspect,
        "relative w-full overflow-hidden bg-neutral-200 grid place-items-center",
        rounded && "rounded-2xl",
        className,
      )}
    >
      {/* subtle pattern so the placeholder looks intentional, not broken */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 14px, rgba(255,255,255,0.6) 14px 15px)",
        }}
      />
      {label && (
        <span className="relative text-xs font-medium uppercase tracking-widest text-neutral-500">
          {label}
        </span>
      )}
    </div>
  );
}
