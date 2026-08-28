import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ScrollNav } from "@/components/ScrollNav";
import { site } from "@/content/site";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-mono",
});

const description =
  "Frontend developer specializing in production e-commerce interfaces — Shopify storefronts, cart experiences and responsive product UI.";

/**
 * Tab-title role, requested as "Full Stack Developer". Kept separate from
 * `site.role` ("Frontend Developer"), which stays as-is everywhere else on
 * the site (hero code snippet, nav, etc.) — the two currently disagree, so
 * confirm which is accurate before shipping.
 */
const metaRole = "Full Stack Developer";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${metaRole}`,
    template: `%s — ${site.name}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${metaRole}`,
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${metaRole}`,
    description,
  },
  robots: { index: true, follow: true },
  verification: {
    google: "bwq8exBDq_oLYAfdx-I9dsfbekmMIcNt8_5IcMPF6wI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
        <ScrollNav />
      </body>
    </html>
  );
}
