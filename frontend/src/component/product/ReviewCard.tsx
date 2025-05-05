type Review = {
    rating: number;
    comment: string;
    user: string;
    date: string;
    purchasedItem: string;
};

export default function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="border-b py-4">
            <div className="flex items-center gap-2">
                <p className="text-yellow-500">{'★'.repeat(review.rating)}</p>
                <p className="font-semibold">{review.comment}</p>
            </div>
            <p className="text-gray-600 mt-1">
                Purchased item: {review.purchasedItem}
            </p>
            <p className="text-gray-500 text-sm mt-1">
                {review.user} • {review.date}
            </p>
        </div>
    );
}