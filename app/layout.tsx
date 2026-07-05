import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wonder Food's Maraval - Café & desserts premium",
  description:
    "Découvrez des crêpes, gaufres, tiramisu et boissons signature chez Wonder Food's. Parcourez notre menu et passez votre commande.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Wonder Food's Maraval - Café & desserts premium",
    description: "Découvrez des crêpes, gaufres, tiramisu et boissons signature chez Wonder Food's. Parcourez notre menu et passez votre commande.",
    url: "wonderfood-menu.vercel.app",
    siteName: "Wonder Food's Maraval",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/logo1.svg",
        width: 1200,
        height: 630,
        alt: "Wonder Food's logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wonder Food's Maraval - Café & desserts premium",
    description: "Découvrez des crêpes, gaufres, tiramisu et boissons signature chez Wonder Food's. Parcourez notre menu et passez votre commande.",
    images: ["/logo1.svg"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#8B3A3A" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
