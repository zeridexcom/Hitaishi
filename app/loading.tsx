export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Double-ring Premium Loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary-soft/60"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-primary/40 border-b-transparent border-l-transparent animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-secondary border-r-transparent border-b-secondary/40 border-l-transparent animate-spin-reverse-slow"></div>
        </div>

        {/* Elegant Logo / Loading Text */}
        <div className="text-center">
          <h2 className="font-serif italic text-3xl font-medium text-primary-deep tracking-wide animate-pulse">
            Hitaishi
          </h2>
          <p className="font-mono text-[10px] text-ink-faint tracking-widest uppercase mt-2">
            Securing Connection...
          </p>
        </div>
      </div>
    </div>
  );
}
