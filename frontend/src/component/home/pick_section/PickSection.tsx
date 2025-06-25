import { Button } from '@/components/ui/button';
import React from 'react';
import { PickCard } from './PickCard';

const PickSection = () => {
    return (
        <div className={'mb-4'}>
            <div className="text-2xl font-medium mb-4 mt-4 flex items-center justify-between">
                <div>H2Shop’s Picks</div>{/*
                <Button variant="secondary" className="rounded-full text-sm px-5 py-2 h-auto bg-gray-100 hover:bg-gray-200">
                    See more
                </Button>*/}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-white">
                        <PickCard imageUrl='/assets/images/pick.png' price='171,089đ' alt='image' originalPrice='250,123đ' height={300} width={300} />
                    </div>
                ))}
                <div className="relative rounded-lg overflow-hidden bg-white col-span-1 lg:col-span-2 row-span-2">
                    <PickCard imageUrl='/assets/images/pick.png' price='171,089đ' alt='image' originalPrice='250,123đ' height={300} width={300} />
                </div>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-white">
                        <PickCard imageUrl='/assets/images/pick.png' price='171,089đ' alt='image' height={300} width={300} />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PickSection;