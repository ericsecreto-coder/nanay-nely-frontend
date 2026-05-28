type Props = {
  label?: string;
  inline?: boolean;
};

export function LoadingSpinner({ label = "Loading...", inline }: Props) {
  return (
    <div className={inline ? "loading-inline" : "loading-block"} role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
