import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "CRM Technology — ICT & CCTV Solutions",
    template: "%s | CRM Technology",
  },
  description:
    "South Africa's trusted distributor for ICT, CCTV, networking, and security solutions. Wholesale and retail pricing available.",
  keywords: [
    "CCTV",
    "ICT",
    "networking",
    "security cameras",
    "South Africa",
    "distributor",
    "wholesale",
    "CRM Technology",
  ],
  openGraph: {
    title: "CRM Technology — ICT & CCTV Solutions",
    description:
      "South Africa's trusted distributor for ICT, CCTV, networking, and security solutions.",
    siteName: "CRM Technology",
    locale: "en_ZA",
    type: "website",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-mode="dark">
      <body className="bg-[#0a0f1c] text-slate-100 antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}

