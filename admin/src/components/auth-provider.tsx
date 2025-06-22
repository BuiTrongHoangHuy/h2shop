"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authApi } from "@/services/api/authApi"
import { User } from "@/types"

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (token: string, user: User, rememberMe?: boolean) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // Các route không cần authentication
    const publicRoutes = ["/auth/login"]

    useEffect(() => {
        checkAuth()
    }, [])

    const getStoredToken = () => {
        // Kiểm tra cả localStorage và sessionStorage
        return localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    }

    const checkAuth = async () => {
        try {
            const token = getStoredToken()

            if (token) {
                // Validate token với API
                const userData = await authApi.validateToken(token)
                setUser(userData)
                setIsAuthenticated(true)

                // Set cookie for middleware
                document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

                // Nếu đang ở login page và đã login -> redirect về dashboard
                if (pathname === "/auth/login") {
                    router.replace("/")
                }
            } else {
                setUser(null)
                setIsAuthenticated(false)

                // Nếu đang ở protected routes và chưa login -> redirect về login
                if (!publicRoutes.includes(pathname)) {
                    router.replace("/auth/login")
                }
            }
        } catch (error) {
            console.error("Auth check failed:", error)
            // Token invalid, clear storage
            localStorage.removeItem("authToken")
            sessionStorage.removeItem("authToken")
            document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

            setUser(null)
            setIsAuthenticated(false)

            if (!publicRoutes.includes(pathname)) {
                router.replace("/auth/login")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const login = (token: string, userData: User, rememberMe = false) => {
        // Lưu token theo lựa chọn của user
        if (rememberMe) {
            localStorage.setItem("authToken", token)
            sessionStorage.removeItem("authToken") // Clear sessionStorage nếu có
        } else {
            sessionStorage.setItem("authToken", token)
            localStorage.removeItem("authToken") // Clear localStorage nếu có
        }

        // Set cookie for middleware
        const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24 // 7 days or 1 day
        document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}`

        setUser(userData)
        setIsAuthenticated(true)
        router.replace("/")
    }

    const logout = () => {
        // Clear all storage
        localStorage.removeItem("authToken")
        sessionStorage.removeItem("authToken")
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

        setUser(null)
        setIsAuthenticated(false)
        router.replace("/auth/login")
    }

    // Loading screen
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>{children}</AuthContext.Provider>
    )
}
