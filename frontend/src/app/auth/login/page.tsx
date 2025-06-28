"use client";
import Input from "@/component/auth/Input";
import SocialLoginButton from "@/component/auth/SocialLoginButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "@/services/api/authApi";
import { LoginCredentials } from "@/types/authTypes";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
    const {setUser, setIsAuthenticated } = useAuth();
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

            // Lưu token
            if (rememberMe) {
                localStorage.setItem("authToken", result.token);
                localStorage.setItem("user", JSON.stringify(result.user));
            } else {
                sessionStorage.setItem("authToken", result.token);
                sessionStorage.setItem("user", JSON.stringify(result.user));
            }

            setIsAuthenticated(true);
            setUser(result.user);
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
                    <Button
                        onClick={() => router.push("/auth/register")}
                        variant="outline"
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        Register
                    </Button>
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
                        {/* <Button
                            variant="link"
                            className="text-sm text-gray-500 hover:underline cursor-pointer"
                            disabled={isLoading}
                            onClick={() => router.push("/auth/forgot-password")} // Thêm điều hướng nếu có trang quên mật khẩu
                        >
                            Forgot your password?
                        </Button> */}
                    </div>

                    <Button
                        variant="default"
                        className="w-full mt-4 rounded-[24px] text-base py-6"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                {/*<div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <SocialLoginButton type="google" disabled={isLoading} />
                    <SocialLoginButton type="facebook" disabled={isLoading} />
                </div>*/}
            </div>
        </div>
    );
}