import Image from "next/image";

export default function AgariciaMark({
  size = 28,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  // Se a cor pedida for clara (como var(--foam) ou white), inverte a imagem escura para ficar branca
  const isLightColor = color.includes("foam") || color === "white" || color === "#fff" || color === "#ffffff";
  
  return (
    <Image
      src="/logo.png"
      alt="Agaricia Logo"
      width={size}
      height={size}
      style={{ 
        objectFit: "contain",
        filter: isLightColor ? "brightness(0) invert(1)" : "none"
      }}
    />
  );
}
