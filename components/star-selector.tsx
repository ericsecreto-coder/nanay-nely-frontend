"use client";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function StarSelector({ value, onChange }: Props) {
  return (
    <div className="star-selector">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= value ? "star-active" : ""}`}
          onClick={() => onChange(star === value ? 0 : star)}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          {star <= value ? "\u2605" : "\u2606"}
        </button>
      ))}
    </div>
  );
}
