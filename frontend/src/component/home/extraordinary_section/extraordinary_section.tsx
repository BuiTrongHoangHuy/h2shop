import React from 'react';
import { ExtraordinaryCard } from './extraordinary_card';

const ExtraordinarySection = () => {
    return (
        <div>
            <div className="text-2xl font-medium mb-4 mt-4">
                Shop extraordinary items at special prices
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <ExtraordinaryCard key={index} imageUrl='/assets/images/bigdeal.png' title='Home improvement items' discount='up to 15% off' />
                ))}
            </div>
        </div>
    );
};

export default ExtraordinarySection;