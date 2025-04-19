import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface ExtraordinaryCardProps {
    imageUrl: string
    title: string
    discount: string
    href?: string
    className?: string
    height?: number
    width?: number
}

export function ExtraordinaryCard({ imageUrl, title, discount, href = "#", className, height, width }: ExtraordinaryCardProps) {
    return (
        <Link href={href} className={cn(`group`, className)}>
            <div className="rounded-lg overflow-hidden mb-2">
                <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={title}
                    width={width || 300}
                    height={height || 300}
                    className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                />
            </div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-600">{discount}</p>
        </Link>
    )
}
