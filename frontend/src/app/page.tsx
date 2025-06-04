import Link from 'next/link';
import { Product } from "@/types/product";
import { CategoryCard } from '@/component/home/category_section/CategoryCard';
import CategorySection from '@/component/home/category_section/CategorySection';
import BigDealSection from '@/component/home/big_deal_section/BigDealSection';
import PickSection from '@/component/home/pick_section/PickSection';
import ExtraordinarySection from '@/component/home/extraordinary_section/extraordinary_section';
import categoryApi from "@/services/api/categoryApi";

export default async function Home() {
    const { categories, total } = await categoryApi.getCategories(1, 10, {
        status: 1
    });
  return (
    <div className="w-full h-full">
      <div className='mx-14 gap-10'>
        <CategorySection categories={categories} />
        <BigDealSection />
        <PickSection />
        <ExtraordinarySection />
      </div>
    </div>
  );
}