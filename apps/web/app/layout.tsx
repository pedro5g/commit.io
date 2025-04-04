import "./global.css"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "Commit.io",
  description: "Commit.io the social media of devs",
}

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "400", "600", "800"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="dark" lang="en">
      <body
        className={`${jetBrainsMono.className} bg-zinc-950 font-sans text-zinc-50 antialiased`}
      >
        <div>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
