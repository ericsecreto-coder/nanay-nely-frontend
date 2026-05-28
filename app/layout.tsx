import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { ToastProvider } from "@/components/ui/toast-provider";
import { TopNav } from "@/components/top-nav";

const APP_NAME = "Nanay Nely's";
const APP_TITLE = "Nanay Nely's Lambanog";
const APP_DESCRIPTION = "Authentic lambanog from Infanta, Quezon. Browse, order, and track your purchases.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  applicationName: APP_NAME,
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nanay Nely"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }]
  },
  other: {
    "mobile-web-app-capable": "yes"
  }
};

export const viewport: Viewport = {
  themeColor: "#0d1a08",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nanay Nely" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <ToastProvider>
          <CartProvider>
            <TopNav />
            {children}
            <PwaInstallPrompt />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
