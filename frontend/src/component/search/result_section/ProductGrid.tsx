import { ProductCard } from "./ProductCard"

interface Product {
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

interface ProductGridProps {
    products: Product[]
    className?: string
}

export function ProductGrid({ products, className }: ProductGridProps) {
    return (
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${className}`}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
