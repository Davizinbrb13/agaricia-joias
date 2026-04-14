import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "category" | "featured" | "new";
  className?: string;
}

const variantStyles = {
  category: "bg-brand-secondary/30 text-brand-dark",
  featured: "bg-brand-accent/20 text-brand-primary border border-brand-accent/30",
  new: "bg-emerald-100 text-emerald-800",
};

export default function Badge({
  children,
  variant = "category",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
