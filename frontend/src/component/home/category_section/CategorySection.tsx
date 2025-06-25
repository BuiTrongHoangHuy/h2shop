import React from 'react';
import { CategoryCard } from './CategoryCard';
import {Category} from "@/services/api/categoryApi";

interface CategorySectionProps {
    categories: Category[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
    function shuffle(array:any) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    const categoriesRandom: Category[] = shuffle(categories);
    return (
        <div>
            <div className="text-2xl font-medium mb-4 mt-4">
                Shop our most popular categories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                {categoriesRandom.slice(0,6).map((_, index) => (
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