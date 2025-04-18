import React from 'react';
import { CategoryCard } from './CategoryCard';

const CategorySection = () => {
    return (
        <div>
            <div className="text-2xl font-medium mb-4 mt-4">
                Shop our most popular categories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                    <CategoryCard
                        key={index}
                        title="Beauty"
                        imageSrc="/assets/images/category.png"
                        href="/category/beauty"
                        height={240}
                        width={200}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategorySection;