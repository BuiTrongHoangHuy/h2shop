"use client";

import { useState } from 'react';
import { Search, X, Heart, Gift, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from 'next/link';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("")

    const clearSearch = () => {
        setSearchQuery("")
    }

    return (
        <header className="border-b">
            <div className="mx-10 flex h-18 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-xl font-bold">
                        H2Shop
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="h-8 px-2 flex items-center">
                                    <Menu className="h-6 w-6" />
                                    <span className="leading-none text-base">Categories</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <nav className="grid gap-4 py-4">
                                    <Link href="/category/clothing" className="text-sm font-medium hover:underline">
                                        Clothing
                                    </Link>
                                    <Link href="/category/electronics" className="text-sm font-medium hover:underline">
                                        Electronics
                                    </Link>
                                    <Link href="/category/home" className="text-sm font-medium hover:underline">
                                        Home
                                    </Link>
                                    <Link href="/category/beauty" className="text-sm font-medium hover:underline">
                                        Beauty
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="relative hidden md:flex flex-1 mx-6">
                    <Input
                        type="search"
                        placeholder="shirt"
                        className="w-full rounded-full pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery ? (
                        <button className="absolute right-10 top-1/2 -translate-y-1/2" onClick={clearSearch}>
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    ) : null}
                    <Button
                        size="icon"
                        className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full bg-orange-500 hover:bg-orange-600"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/signin" className="hidden md:block text-sm font-medium">
                        Sign In
                    </Link>
                    <Link href="/wishlist">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Heart className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/gifts">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Gift className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="md:hidden px-4 pb-4">
                <div className="relative">
                    <Input
                        type="search"
                        placeholder="shirt"
                        className="w-full rounded-full pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery ? (
                        <button className="absolute right-10 top-1/2 -translate-y-1/2" onClick={clearSearch}>
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    ) : null}
                    <Button
                        size="icon"
                        className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full bg-orange-500 hover:bg-orange-600"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}