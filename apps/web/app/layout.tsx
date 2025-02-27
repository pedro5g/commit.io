import "./global.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Commit.oi",
  description: "Commit.io the social media of devs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
