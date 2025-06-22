import type React from "react"
import Header from "@/components/header"
import Navigation from "@/components/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Navigation />
            <main className="p-6 ">{children}</main>
        </div>
    )
}
