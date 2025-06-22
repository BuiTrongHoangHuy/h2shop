"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "@/services/api/authApi";
import Input from "../components/Input";
import { LoginCredentials } from "@/types";
import Cookies from "js-cookie";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const credentials: LoginCredentials = { email, password };
            const result = await authApi.login(credentials);

            console.log("Login result:", result.user);

            if (rememberMe) {
                localStorage.setItem("authToken", result.token);
                Cookies.set("auth-token", result.token, { expires: 7 });
            } else {
                sessionStorage.setItem("authToken", result.token);
                Cookies.set("auth-token", result.token);
            }

            toast.success(`Login successful! Welcome, ${result.user.fullName}`);
            router.push("/"); // Điều hướng đến dashboard
        } catch (err: any) {
            const errorMessage = err.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-semibold">Sign in</div>
                </div>

                {error && (
                    <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email *"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <Input
                        label="Password *"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />

                    <div className="flex items-center justify-between">
                        <label htmlFor="remember" className="flex items-center space-x-2 text-sm font-medium">
                            <Checkbox
                                id="remember"
                                className="border-gray-300"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked === true)}
                                disabled={isLoading}
                            />
                            <span>Stay signed in</span>
                        </label>
                    </div>

                    <Button
                        className="w-full mt-4 rounded-[24px] text-base py-6 bg-black text-white"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </div>
        </div>
    );
}