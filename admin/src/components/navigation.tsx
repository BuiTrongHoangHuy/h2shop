"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, CreditCard, Users, UserCheck, FileText, Layers2 } from "lucide-react"

const navItems = [
  { name: "Overview", href: "/", icon: BarChart3 },
  { name: "Product", href: "/product", icon: Package },
  { name: "Category", href: "/category", icon: Layers2 },
  { name: "Transaction", href: "/transaction", icon: CreditCard },
  { name: "Customer", href: "/customer", icon: Users },
  { name: "Discount", href: "/discount", icon: CreditCard },
  // { name: "Report", href: "/report", icon: FileText },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-800 z-0">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
