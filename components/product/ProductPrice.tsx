import { formatPrice } from "@/lib/utils";

interface ProductPriceProps {
  price: number | null;
  className?: string;
}

export default function ProductPrice({ price, className }: ProductPriceProps) {
  if (price === null || price === undefined) {
    return (
      <span className={`text-brand-primary font-medium italic ${className ?? ""}`}>
        Consulte-nos
      </span>
    );
  }

  return (
    <span className={`text-brand-dark font-semibold ${className ?? ""}`}>
      {formatPrice(price)}
    </span>
  );
}
