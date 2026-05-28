import Link from "next/link";
import { OfflineRetryButton } from "@/app/offline/offline-retry-button";

export default function OfflinePage() {
  return (
    <main className="page offline-page">
      <section className="sec offline-card">
        <span className="section-tag">You&apos;re offline</span>
        <h1 className="section-title">No connection right now</h1>
        <p className="section-desc" style={{ margin: "0 auto 1.5rem" }}>
          Nanay Nely&apos;s app saved this page so you can still see this message. Reconnect to browse products and
          place orders.
        </p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <OfflineRetryButton />
          <Link href="/" className="btn btn-ghost">
            Go Home
          </Link>
        </div>
      </section>
    </main>
  );
}
