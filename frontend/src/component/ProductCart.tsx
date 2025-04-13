import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="border p-4 rounded">
            <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>${product.price}</p>
            <Link href={`/products/${product.id}`} className="text-blue-500">
                View Details
            </Link>
        </div>
    );
}