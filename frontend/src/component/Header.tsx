"use client";

import { useState } from 'react';
import { Search, X, Heart, Gift, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from 'next/navigation';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        console.log('Search query:', searchQuery);
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <header className="border-b">
            <div className="mx-10 flex h-18 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant='ghost'
                        className="text-xl font-bold p-0 h-auto cursor-pointer"
                        onClick={() => navigateTo('/')}
                    >
                        H2Shop
                    </Button>

                    <div className="hidden md:flex items-center gap-1">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="h-8 px-2 flex items-center cursor-pointer">
                                    <Menu className="h-6 w-6" />
                                    <span className="leading-none text-base">Categories</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <nav className="grid gap-4 py-4">
                                    <Button
                                        variant="link"
                                        className="text-sm font-medium hover:underline justify-start p-0 h-auto cursor-pointer"
                                        onClick={() => navigateTo('/category/clothing')}
                                    >
                                        Clothing
                                    </Button>
                                    <Button
                                        variant="link"
                                        className="text-sm font-medium hover:underline justify-start p-0 h-auto cursor-pointer"
                                        onClick={() => navigateTo('/category/electronics')}
                                    >
                                        Electronics
                                    </Button>
                                    <Button
                                        variant="link"
                                        className="text-sm font-medium hover:underline justify-start p-0 h-auto cursor-pointer"
                                        onClick={() => navigateTo('/category/home')}
                                    >
                                        Home
                                    </Button>
                                    <Button
                                        variant="link"
                                        className="text-sm font-medium hover:underline justify-start p-0 h-auto cursor-pointer"
                                        onClick={() => navigateTo('/category/beauty')}
                                    >
                                        Beauty
                                    </Button>
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    {searchQuery ? (
                        <button className="absolute right-10 top-1/2 -translate-y-1/2" onClick={clearSearch}>
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    ) : null}
                    <Button
                        size="icon"
                        className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full bg-orange-500 hover:bg-orange-600 cursor-pointer"
                        onClick={handleSearch}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        className="hidden md:block text-sm font-medium p-0 h-auto cursor-pointer"
                        onClick={() => navigateTo('/signin')}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground cursor-pointer"
                        onClick={() => navigateTo('/wishlist')}
                    >
                        <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground cursor-pointer"
                        onClick={() => navigateTo('/gifts')}
                    >
                        <Gift className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground cursor-pointer"
                        onClick={() => navigateTo('/cart')}
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </Button>
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    {searchQuery ? (
                        <button
                            className="absolute right-10 top-1/2 -translate-y-1/2"
                            onClick={clearSearch}
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    ) : null}
                    <Button
                        size="icon"
                        className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full bg-orange-500 hover:bg-orange-600"
                        onClick={handleSearch}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}