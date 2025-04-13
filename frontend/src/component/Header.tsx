import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">MyShop</Link>
                <nav>
                    <Link href="/products" className="mr-4">Products</Link>
                    <Link href="/cart">Cart</Link>
                </nav>
            </div>
        </header>
    );
}