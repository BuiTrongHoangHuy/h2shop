import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "H2shop Dashboard",
  description: "Shop management dashboard",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-white">
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          <Header />
          <Navigation />
          <main className="p-6 ">{children}</main>
        </div>
      </body>
    </html>
  )
}
