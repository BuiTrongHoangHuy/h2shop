import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
    title: string
    imageSrc: string
    href: string
    className?: string
    height: number
    width: number
}

export function CategoryCard({ title, imageSrc, href, className, height, width }: CategoryCardProps) {
    return (
        <Link href={href} className="block">
            <div className={cn("overflow-hidden  transition-all hover:opacity-90", className)}>
                <div className="h-[240px] relative rounded-2xl aspect-square w-full overflow-hidden">
                    <Image
                        src={imageSrc || "/placeholder.svg"}
                        alt={`${title} category`}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <div className="mt-2 text-base font-medium">{title}</div>
            </div>
        </Link>
    )
}
