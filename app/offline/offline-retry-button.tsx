"use client";

export function OfflineRetryButton() {
  return (
    <button type="button" className="btn btn-amber" onClick={() => window.location.reload()}>
      Try Again
    </button>
  );
}
