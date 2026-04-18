export default function AgariciaMark({
  size = 28,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-label="Agaricia"
    >
      <g
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M14 42 C 13 34, 10 30, 9 22 C 8.5 17, 10.5 13, 13 12" />
        <path d="M14 42 C 15 34, 17 30, 17 22 C 17 17, 15.5 13, 13 12" />
        <path d="M9.5 24 C 11 23, 12 22, 13 20" />
        <path d="M10.5 30 C 12 29, 13.5 28, 14.5 26" />
        <path d="M30 42 C 29 34, 26 28, 26 18 C 26 13, 28 9, 31 8" />
        <path d="M30 42 C 32 35, 34 30, 35 22 C 35.5 17, 34 11, 31 8" />
        <path d="M27 20 C 28.5 19, 30 17.5, 30.5 15" />
        <path d="M28 27 C 30 26, 32 24, 33 21" />
        <path d="M27.5 33 C 29.5 32, 31.5 30, 32.5 28" />
      </g>
      <g fill={color}>
        <circle cx="16" cy="16" r="0.9" />
        <circle cx="12" cy="19" r="0.7" />
        <circle cx="10.5" cy="27" r="0.7" />
        <circle cx="15" cy="33" r="0.7" />
        <circle cx="32" cy="13" r="0.9" />
        <circle cx="33.5" cy="19" r="0.7" />
        <circle cx="30" cy="24" r="0.7" />
        <circle cx="31.5" cy="30" r="0.7" />
        <circle cx="27" cy="37" r="0.7" />
      </g>
    </svg>
  );
}
