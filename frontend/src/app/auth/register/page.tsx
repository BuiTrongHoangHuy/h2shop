"use client";
import Input from "@/component/auth/Input";
import SocialLoginButton from "@/component/auth/SocialLoginButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authApi } from "@/services/api/authApi";
import { RegisterUserData } from "@/types/authTypes";
import { useRouter } from "next/navigation";

export default function Register() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const registerData: RegisterUserData = {
                fullName: name,
                email,
                password,
            };

            const result = await authApi.register(registerData);
            alert("Registration successful! Welcome, " + result.fullName);
            // Reset form
            setEmail("");
            setName("");
            setPassword("");
            router.push("/auth/login");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-semibold">Create your account</div>
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
                        label="Full Name *"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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

                    <Button
                        variant="default"
                        className="w-full mt-4 rounded-[24px] text-base py-6"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
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