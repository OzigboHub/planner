import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "./components/pwa/ServiceWorkerRegister";
import { PlannerProvider } from "./context/PlannerContext";

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"),
  title: "In Loving Memory of Late Mr. Festus Okoruwa Akhabue (Aged 74) | Funeral & Celebration of Life",
  description:
    "Official Invitation & Programme: Catholic Vigil Mass, Funeral Mass, Interment & Reception for Late Mr. Festus Okoruwa Akhabue (Aged 74). 29th & 30th October 2026 at St Matthew Catholic Church, Eidenu Irrua and Akhabue Residence, Eidenu, Irrua, Edo State.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Late Pa Festus Memorial",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/crest-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "In Loving Memory of Late Mr. Festus Okoruwa Akhabue (Aged 74) | Funeral & Celebration of Life",
    description:
      "The Akhabue Family cordially invites you to the Catholic Vigil Mass at St Matthew Catholic Church, Eidenu Irrua, and Funeral Mass, Interment & Reception on 29th & 30th October 2026.",
    url: "/invite",
    siteName: "Late Mr. Festus Okoruwa Akhabue Memorial",
    images: [
      {
        url: "/pa_festus_portrait.png",
        width: 800,
        height: 1000,
        alt: "Late Mr. Festus Okoruwa Akhabue (Aged 74)",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "In Loving Memory of Late Mr. Festus Okoruwa Akhabue (Aged 74) | Funeral & Celebration of Life",
    description:
      "Official Invitation: Catholic Funeral Ceremonies for Late Mr. Festus Okoruwa Akhabue (Aged 74) in Eidenu, Irrua, Edo State (29th – 30th October 2026).",
    images: ["/pa_festus_portrait.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#080c15] text-slate-100 selection:bg-amber-500 selection:text-slate-950">
        <ServiceWorkerRegister />
        <PlannerProvider>{children}</PlannerProvider>
      </body>
    </html>
  );
}
