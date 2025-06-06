import React from 'react';
import { CategoryCard } from './CategoryCard';
import {Category} from "@/services/api/categoryApi";

interface CategorySectionProps {
    categories: Category[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
    return (
        <div>
            <div className="text-2xl font-medium mb-4 mt-4">
                Shop our most popular categories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                {categories.map((_, index) => (
                    <CategoryCard
                        key={index}
                        title={categories[index]?.name || 'Category Name'}
                        imageSrc={categories[index].image?.url || '/images/default-category.jpg'}
                        href={"/collections/" +slug(categories[index])}
                        height={240}
                        width={200}
                    />
                ))}
            </div>
        </div>
    );
};
function slug(category : Category): string {
    return category.name.toLowerCase().split(" ").join("-")+'-'+category.id
}
export default CategorySection;