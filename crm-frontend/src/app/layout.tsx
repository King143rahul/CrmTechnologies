import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CRM Technology — Premium IT Hardware & Laptop Parts",
    template: "%s | CRM Technology",
  },
  description:
    "South Africa's trusted source for premium laptop parts, replacement screens, SSDs, chargers, and IT hardware. Fast nationwide delivery from Durban.",
  keywords: ["laptop parts", "IT hardware", "replacement screens", "SSD", "chargers", "CRM Technology", "Durban", "South Africa"],
  openGraph: {
    title: "CRM Technology — Premium IT Hardware & Laptop Parts",
    description: "South Africa's trusted source for premium laptop parts and IT hardware.",
    type: "website",
    locale: "en_ZA",
    siteName: "CRM Technology",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
