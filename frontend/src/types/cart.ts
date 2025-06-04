import {CartItem} from "@/types/cartItem";

export interface Cart {
    items: CartItem[];
    total: number;
}