export function formatPrice(price: number): string {
  return `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
