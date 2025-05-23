import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="border rounded">
            <Image
                src={product.images && product.images[0].url || '/placeholder-product.png'}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-t"
            />
            <div className="p-4">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-red-500">{product.price && product.price.toLocaleString()}đ</p>
            </div>
        </div>
    );
}