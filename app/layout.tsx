import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"),
  title: "In Loving Memory of Pa Festus Okoruwa Akhabue | Funeral & Celebration of Life",
  description:
    "Official Invitation & Programme: Catholic Funeral Mass, Interment & Reception for Pa Festus Okoruwa Akhabue. Friday, 30 October 2026 at St. Matthew Catholic Church and Akhabue Residence, Eidenu, Irrua, Edo State.",
  openGraph: {
    title: "In Loving Memory of Pa Festus Okoruwa Akhabue | Funeral & Celebration of Life",
    description:
      "The Akhabue Family cordially invites you to the Catholic Funeral Mass, Interment & Reception Ceremony in Eidenu, Irrua, Edo State on Friday, 30 October 2026.",
    url: "/invite",
    siteName: "Pa Festus Okoruwa Akhabue Memorial",
    images: [
      {
        url: "/pa_festus_portrait.png",
        width: 800,
        height: 1000,
        alt: "Pa Festus Okoruwa Akhabue (1948 – 2026)",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "In Loving Memory of Pa Festus Okoruwa Akhabue | Funeral & Celebration of Life",
    description:
      "Official Invitation: Catholic Funeral Mass, Interment & Reception for Pa Festus Okoruwa Akhabue in Eidenu, Irrua, Edo State.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080c15] text-slate-100 selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
