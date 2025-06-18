import { Bell, MessageSquare, Settings } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">H2shop</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MessageSquare className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
