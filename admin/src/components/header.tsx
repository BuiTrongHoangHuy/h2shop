"use client"

import { Bell, MessageSquare, Settings, LogOut, User } from "lucide-react"
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">H2shop</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700 flex items-center space-x-2"
            onClick={() => {
              localStorage.removeItem("auth-token")
              Cookies.remove("auth-token");
              window.location.href = "/auth/login"
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>

        </div>
      </div>
    </header>
  )
}
