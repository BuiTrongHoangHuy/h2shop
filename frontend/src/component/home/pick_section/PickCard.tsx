import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface PickCardProps {
    imageUrl: string
    price: string
    originalPrice?: string
    alt: string
    href?: string
    className?: string
    height?: number
    width?: number
}

export function PickCard({ imageUrl, price, alt, href = "#", className, height, width, originalPrice }: PickCardProps) {
    return (
        <Link href={href} className={cn(`relative rounded-lg overflow-hidden bg-white block`, className)}>
            <Image
                src={imageUrl || "/placeholder.svg"}
                alt={alt}
                width={height}
                height={width}
                className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md text-xs gap-1 flex items-center">
                <span>{price}</span>
                {originalPrice && (
                    <span className=" text-gray-500 line-through">
                        {originalPrice}
                    </span>
                )}
            </div>
        </Link>
    )
}