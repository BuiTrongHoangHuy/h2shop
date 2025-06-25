"use client";

import { useState, useEffect } from 'react';
import { Search, X, Heart, Gift, ShoppingCart, Menu, LogOut, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authApi } from '@/services/api/authApi';
import { UserProfile } from '@/types/authTypes';
import { productApi } from '@/services/api/productApi';
import categoryApi, { Category } from "@/services/api/categoryApi";
import { useAuth } from '@/lib/AuthContext';

export default function Header() {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    function slug(category: Category): string {
        return category.name.toLowerCase().split(" ").join("-") + '-' + category.id
    }
    const [categories, setCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { categories } = await categoryApi.getCategories(1, 10, { status: 1 });
                setCategories(categories);
            } catch (err: any) {
                toast.error(err.message || 'Failed to load categories');
            }
        };
        fetchCategories();
    }, []);
    const handleSearch = async () => {
        if (searchQuery.trim()) {
            try {
                setIsLoading(true);
                await productApi.getProducts(1, 10, { search: searchQuery });
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            } catch (err: any) {
                toast.error(err.message || 'Search failed');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const navigateTo = (path: string) => {
        router.push(path);
    };

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await authApi.logout();
            toast.success('Logged out successfully');
            setIsAuthenticated(false);
            router.push('/auth/login');
        } catch (err: any) {
            toast.error(err.message || 'Logout failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMyOrders = () => {
        router.push('/orders');
    };
    const handleMyProfile = () => {
        router.push('/profile');
    }

    return (
        <header className="border-b">
            <div className="mx-10 flex h-18 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        className="text-xl font-bold p-0 h-auto cursor-pointer"
                        onClick={() => navigateTo('/')}
                        disabled={isLoading}
                    >
                        H2Shop
                    </Button>

                    <div className="hidden md:flex items-center gap-1">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 px-2 flex items-center cursor-pointer"
                                    disabled={isLoading}
                                >
                                    <Menu className="h-6 w-6" />
                                    <span className="leading-none text-base">Categories</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <nav className="grid gap-4 p-4">
                                    {categories.map((category: Category) => (
                                        <Button
                                            key={category.id}
                                            variant="link"
                                            className="text-sm font-medium hover:underline justify-start p-0 h-auto cursor-pointer"
                                            onClick={() => {
                                                navigateTo(`/collections/${slug(category)}`);
                                                setOpen(false);
                                            }
                                            }
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="relative hidden md:flex flex-1 mx-6">
                    <Input
                        type="search"
                        placeholder="Search for products"
                        className="w-full rounded-full pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        disabled={isLoading}
                    />
                    {searchQuery ? (
                        <button
                            className="absolute right-10 top-1/2 -translate-y-1/2"
                            onClick={clearSearch}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    ) : null}
                    <Button
                        size="icon"
                        className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full bg-orange-500 hover:bg-orange-600 cursor-pointer"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8 cursor-pointer">
                                        <AvatarImage src="/avatars/01.png" alt="@user" />
                                        <AvatarFallback>
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuItem onClick={handleMyProfile} className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>My Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleMyOrders} className="cursor-pointer">
                                    <Package className="mr-2 h-4 w-4" />
                                    <span>My Orders</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="ghost"
                            className="hidden md:block text-sm font-medium p-0 h-auto cursor-pointer"
                            onClick={() => navigateTo('/auth/login')}
                            disabled={isLoading}
                        >
                            Sign In
                        </Button>
                    )}
                    {/*<Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground cursor-pointer"
                        onClick={() => navigateTo('/wishlist')}
                        disabled={isLoading}
                    >
                        <Heart className="h-5 w-5" />
                    </Button>*/}
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground cursor-pointer"
                        onClick={() => navigateTo('/gifts')}
                        disabled={isLoading}
                    >
                        <Gift className="h-5 w-5" />
                    </Button>*/}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground cursor-pointer"
                        onClick={() => navigateTo('/cart')}
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                    {searchQuery ? (
                        <button
                            className="absolute right-10 top-1/2 -translate-y-1/2"
                            onClick={clearSearch}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    ) : null}
                    <Button
                        size="icon"
                        className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full bg-orange-500 hover:bg-orange-600"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}