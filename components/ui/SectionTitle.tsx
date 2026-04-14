import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  centered = true,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn(centered && "text-center", "mb-12", className)}>
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-dark tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-brand-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "mt-6 h-0.5 w-16 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full",
          centered && "mx-auto"
        )}
      />
    </div>
  );
}
