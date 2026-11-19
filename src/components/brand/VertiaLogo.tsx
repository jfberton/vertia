import { cn } from "@/lib/utils";

type VertiaLogoProps = {
  className?: string;
  dark?: boolean;
  showTagline?: boolean;
  compact?: boolean;
};

export function VertiaLogo({
  className,
  dark = false,
  showTagline = true,
  compact = false,
}: VertiaLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        aria-hidden="true"
        className="h-9 w-11 shrink-0"
        viewBox="0 0 48 40"
        fill="none"
      >
        <defs>
          <linearGradient id="vertia-left" x1="2" y1="3" x2="28" y2="37" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14CBE1" />
            <stop offset="1" stopColor="#3975E8" />
          </linearGradient>
          <linearGradient id="vertia-right" x1="22" y1="3" x2="47" y2="37" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4B72EA" />
            <stop offset="1" stopColor="#9A60EA" />
          </linearGradient>
        </defs>
        <polygon points="0,1 11,1 27,29 21,39" fill="url(#vertia-left)" />
        <polygon points="37,1 48,1 27,39 21,29" fill="url(#vertia-right)" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className={cn("block text-xl font-extrabold tracking-[0.14em]", dark ? "text-white" : "text-[#071b3f]")}>VERTIA</span>
          {showTagline && (
            <span className={cn("mt-1 block text-[8px] font-bold tracking-[0.12em]", dark ? "text-slate-300" : "text-slate-500")}>
              RED DE CONSTRUCCIÓN & SUMINISTRO
            </span>
          )}
        </span>
      )}
    </span>
  );
}
