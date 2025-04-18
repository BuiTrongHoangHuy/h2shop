import React from 'react';
import { BigDealCard } from './BigDealCard';
import { Clock } from 'lucide-react';

const BigDealSection = () => {
    return (
        <div>
            <div className="mb-4 mt-4 flex gap-4 items-center">
                <text className='text-2xl font-medium'>Today's big deals</text>
                <div className="flex items-center text-base text-gray-500 leading-none">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Ending in 04:12:23</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <BigDealCard
                        key={index}
                        id="bridesmaid-pajamas"
                        title="Bridesmaid Pajamas, Bridal Party Set"
                        imageSrc="/assets/images/bigdeal.png"
                        rating={4.8}
                        currentPrice={256499}
                        originalPrice={569761}
                        discount={55}
                    />
                ))}
            </div>
        </div>
    );
};

export default BigDealSection;