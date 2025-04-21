import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface BigDealCardProps {
    id: string
    title: string
    imageSrc: string
    rating: number
    currentPrice: number
    originalPrice?: number
    discount?: number
    currency?: string
    className?: string
}

export function BigDealCard({
    id,
    title,
    imageSrc,
    rating,
    currentPrice,
    originalPrice,
    discount,
    currency = "₫",
    className,
}: BigDealCardProps) {
    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    return (
        <Link href={`/product/${id}`}>
            <div className={cn("overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md", className)}>
                <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                        src={imageSrc || "/placeholder.svg"}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <div className="p-3">
                    <div className="flex items-center justify-between">
                        <h3 className="truncate text-base font-medium text-gray-800">{title}</h3>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{rating}</span>
                            <Star className="h-4 w-4 fill-black text-black" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-bold text-green-700">
                            {formatPrice(currentPrice)}
                            {currency}
                        </span>
                        {originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(originalPrice)}
                                {currency}
                            </span>
                        )}
                        {discount && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm text-green-800">{discount}% off</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
