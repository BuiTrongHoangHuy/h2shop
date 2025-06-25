import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: {
    id: string
    name: string
    images: string[]
    price: number
    originalPrice: number
    discount: number
    rating?: {
      value: number
      count: number
    }
    saleEndsIn?: string
  }
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div className={cn("flex flex-col space-y-3 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full", className)}>
      <div 
        className="group relative overflow-hidden rounded-sm cursor-pointer h-[250px] w-full "
        onClick={handleProductClick}
      >
        <div className="flex transition-transform duration-500 ease-in-out group-hover:scale-105">
          {/* Front image */}
          <div className="min-w-full flex-shrink-0">
            <Image
              src={product.images[0] || "/placeholder.svg?height=500&width=400"}
              alt={`${product.name} - Front view`}
              width={400}
              height={500}
              className="h-auto w-full object-cover"
            />
          </div>
          {/* Back image (if available) */}
          {product.images.length > 1 && (
            <div className="min-w-full flex-shrink-0">
              <Image
                src={product.images[1] || "/placeholder.svg?height=500&width=400"}
                alt={`${product.name} - Back view`}
                width={400}
                height={500}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Video play button indicator if it's the last image */}
        {/*{product.images.length === 1 && (
          <div className="absolute bottom-2 right-2 rounded-full bg-white p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        )}*/}
      </div>

      <div className="space-y-1">
        <h3 
          className="text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-orange-500"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <span className="font-medium">{product.rating.value}</span>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-500">({product.rating.count})</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-medium">{product.originalPrice.toLocaleString()}đ</span>
          {/*<span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString()}đ</span>
          <span className="text-sm text-green-600">({product.discount}% off)</span>*/}
        </div>

        {/* Sale countdown */}
        {product.saleEndsIn && <p className="text-sm font-medium text-green-600">Sale ends in {product.saleEndsIn}</p>}
      </div>

      {/*<Button variant="outline" className="w-full rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          <path d="M20 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        Add to cart
      </Button>*/}
    </div>
  )
}
