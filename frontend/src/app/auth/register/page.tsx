"use client";
import Input from "@/component/auth/Input";
import SocialLoginButton from "@/component/auth/SocialLoginButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function Register() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-semibold">Create your account</div>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Email *"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="First Name *"
                        type="password"
                        placeholder="Enter your first name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        label="Password *"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button variant="default" className="w-full mt-4 rounded-[24px] text-base py-6">Register</Button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <SocialLoginButton type="google" />
                    <SocialLoginButton type="facebook" />
                </div>
            </div>
        </div>
    )
}