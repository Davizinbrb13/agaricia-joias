interface BagIconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/** Ícone de sacola da Agaricia. Usa currentColor — controle a cor via CSS `color`. */
export default function BagIcon({
  size = 22,
  strokeWidth = 1.6,
  className,
}: BagIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
