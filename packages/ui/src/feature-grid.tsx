import { Card } from "./card";
import { cn } from "./utils";

interface FeatureItem {
  title: string;
  description: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  className?: string;
  variant?: "light" | "dark";
}

export function FeatureGrid({ items, className, variant = "light" }: FeatureGridProps) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item) => (
        <Card key={item.title} variant={variant} className={variant === "dark" ? "" : ""}>
          <p className={`font-bold text-lg ${variant === "dark" ? "text-white" : "text-black"}`}>{item.title}</p>
          <p className={`mt-2 text-sm leading-6 ${variant === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>{item.description}</p>
        </Card>
      ))}
    </div>
  );
}
