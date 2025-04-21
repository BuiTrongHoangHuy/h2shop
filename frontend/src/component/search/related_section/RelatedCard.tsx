import Image from "next/image"
import Link from "next/link"

export interface RelatedCardProps {
    id: string
    label: string
    image: string
    url: string
}

export function RelatedCard({ id, label, image, url }: RelatedCardProps) {
    return (
        <div>
            <Link
                key={id}
                href={url}
                className="flex min-w-[100px] flex-col items-center text-center transition-opacity hover:opacity-80"
            >
                <div className="mb-2 h-[150px] w-[150px] overflow-hidden rounded-md">
                    <Image
                        src={image || "/placeholder.svg"}
                        alt={label}
                        width={150}
                        height={150}
                        className="h-full w-full object-cover"
                    />
                </div>
                <span className="text-sm text-gray-700">{label}</span>
            </Link>
        </div>
    )
}
