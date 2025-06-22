import {TypeImage} from "@/types/typeImage";

export interface Category {
    id: number;
    name: string;
    description: string;
    parentId: number | null;
    status: number;
    image: TypeImage | null;
    createdAt: string;
    updatedAt: string;
}