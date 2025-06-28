import { useState } from 'react';
import { Star, Edit, Trash } from 'lucide-react';

type Review = {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    userName: string;
    date: string;
    createdAt: string;
    purchasedItem: string;
};

interface ReviewCardProps {
    review: Review;
    onUpdate?: (id: string, rating: number, comment: string) => void;
    onDelete?: (id: string) => void;
    currentUserId?: string;
}

export default function ReviewCard({ review, onUpdate, onDelete, currentUserId }: ReviewCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(review.rating);
    const [editComment, setEditComment] = useState(review.comment);

    const isOwner = currentUserId && review.userId === currentUserId;

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(review.id, editRating, editComment);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditRating(review.rating);
        setEditComment(review.comment);
        setIsEditing(false);
    };

    const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                type="button"
                onClick={() => interactive && onStarClick && onStarClick(index + 1)}
                className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
                disabled={!interactive}
            >
                <Star
                    className={`w-4 h-4 ${
                        index < rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                    }`}
                />
            </button>
        ));
    };

    if (isEditing) {
        return (
            <div className="border-b py-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Rating:</span>
                        <div className="flex gap-1">
                            {renderStars(editRating, true, setEditRating)}
                        </div>
                    </div>
                    <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={3}
                        placeholder="Write your review..."
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border-b py-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                            {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                            {review.rating}/5
                        </span>
                    </div>
                    <p className="font-medium text-gray-900 mb-2">{review.comment}</p>
                    <p className="text-gray-500 text-sm">
                        {review.userName} • {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                {isOwner && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1 text-gray-400 hover:text-orange-500"
                            title="Edit review"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        {onDelete && (
                            <button
                                onClick={() => onDelete(review.id)}
                                className="p-1 text-gray-400 hover:text-red-500"
                                title="Delete review"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}