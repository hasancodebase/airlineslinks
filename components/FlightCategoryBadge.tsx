// components/FlightCategoryBadge.tsx
import { cn } from "@/lib/utils";

type Category = "VFR" | "MVFR" | "IFR" | "LIFR" | "UNKNOWN";

const STYLES: Record<Category, string> = {
  VFR: "bg-secondary-container text-on-secondary-container border-[#00bd85]/20 shadow-[0_0_8px_rgba(0,189,133,0.2)]",
  MVFR: "bg-tertiary-container text-on-tertiary-container border-[#34daff]/20",
  IFR: "bg-danger-critical/20 text-danger-critical border-danger-critical/30",
  LIFR: "bg-error-container text-on-error-container border-error/20",
  UNKNOWN: "bg-surface-bright text-data-text border-border-subtle",
};

export default function FlightCategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded font-bold text-label-caps uppercase border",
        STYLES[category]
      )}
    >
      {category}
    </span>
  );
}
