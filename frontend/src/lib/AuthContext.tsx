"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
            const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
            
            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setIsAuthenticated(true);
                    setUser(parsedUser);
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    logout();
                }
            } else {
                logout();
            }
        };
        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const logout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            setIsAuthenticated, 
            setUser,
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}