export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    images?: string[];
    sizes?: string[];
}