"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed === "true" || standalone) {
      return;
    }

    function handleBeforeInstall(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    localStorage.setItem("pwa-install-dismissed", "true");
    setVisible(false);
  }

  if (!visible || isStandalone) {
    return null;
  }

  return (
    <div className="pwa-install-banner" role="dialog" aria-label="Install app">
      <div>
        <strong>Install Nanay Nely&apos;s</strong>
        <p>Add to your home screen for quick access and offline support.</p>
      </div>
      <div className="pwa-install-actions">
        <button type="button" className="btn btn-amber btn-sm" onClick={handleInstall}>
          Install App
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleDismiss}>
          Not now
        </button>
      </div>
    </div>
  );
}
