import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white hover:bg-brand-muted shadow-md hover:shadow-lg",
  secondary:
    "bg-brand-secondary/20 text-brand-dark hover:bg-brand-secondary/40 border border-brand-secondary/30",
  outline:
    "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp-dark shadow-md hover:shadow-lg",
  ghost:
    "text-brand-primary hover:bg-brand-secondary/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm min-h-[36px]",
  md: "px-6 py-3 text-base min-h-[44px]",
  lg: "px-8 py-4 text-lg min-h-[52px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external = false,
  className,
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
