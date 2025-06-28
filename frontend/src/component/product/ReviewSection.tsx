import { useState, useEffect } from 'react';
import { Star, Filter, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { Review } from '@/types/review';

interface ReviewSectionProps {
    reviews: Review[];
    productId: string;
    onReviewUpdate?: (id: number, rating: number, comment: string) => void;
    onReviewDelete?: (id: number) => void;
    currentUserId?: number;
}

type SortOption = 'relevance' | 'newest' | 'rating';

interface RatingDistribution {
    [key: number]: number;
}

export default function ReviewSection({ 
    reviews, 
    onReviewUpdate, 
    onReviewDelete, 
    currentUserId 
}: ReviewSectionProps) {
    const [sortBy, setSortBy] = useState<SortOption>('relevance');
    const [sortedReviews, setSortedReviews] = useState<Review[]>(reviews);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);

    // Calculate overall rating and distribution
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

    const ratingDistribution: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
        ratingDistribution[review.rating]++;
    });

    useEffect(() => {
        const sorted = [...reviews];
        
        switch (sortBy) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'relevance':
            default:
                break;
        }
        
        setSortedReviews(sorted);
        setCurrentPage(1);
    }, [reviews, sortBy]);

    // Calculate pagination
    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = sortedReviews.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const reviewSection = document.getElementById('review-section');
        if (reviewSection) {
            reviewSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClasses = {
            sm: 'w-3 h-3',
            md: 'w-4 h-4',
            lg: 'w-5 h-5'
        };

        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`${sizeClasses[size]} ${
                    index < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                }`}
            />
        ));
    };

    const renderRatingBar = (rating: number, count: number) => {
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        
        return (
            <div key={rating} className="flex items-center gap-3 py-1">
                <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-gray-600">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                </span>
            </div>
        );
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
        );

        // First page
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="ellipsis1" className="px-3 py-2 text-sm text-gray-500">
                        ...
                    </span>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                        currentPage === i
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="ellipsis2" className="px-3 py-2 text-sm text-gray-500">
                        ...
                    </span>
                );
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        );

        return pages;
    };

    return (
        <div id="review-section" className="mt-12">
            {/* Review Header */}
            <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                    Customer Reviews ({totalReviews})
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rating Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6">
                        {/* Overall Rating */}
                        <div className="text-center mb-6">
                            <div className="text-4xl font-bold text-gray-900 mb-2">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="flex justify-center mb-2">
                                {renderStars(Math.round(averageRating), 'lg')}
                            </div>
                            <p className="text-sm text-gray-600">
                                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map(rating => 
                                renderRatingBar(rating, ratingDistribution[rating])
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2">
                    {/* Sort Options */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Sort by:</span>
                        </div>
                        <div className="flex gap-2">
                            {[
                                { value: 'relevance', label: 'Relevance' },
                                { value: 'newest', label: 'Newest' },
                                { value: 'rating', label: 'Rating' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value as SortOption)}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        sortBy === option.value
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="space-y-0">
                        {currentReviews.length > 0 ? (
                            <>
                                {currentReviews.map((review) => (
                                    <ReviewCard
                                        key={review.id}
                                        review={{
                                            ...review,
                                            id: review.id.toString(),
                                            user: review.userName,
                                            date: review.createdAt,
                                            purchasedItem: "Product"
                                        }}
                                        onUpdate={onReviewUpdate ? 
                                            (id, rating, comment) => onReviewUpdate(parseInt(id), rating, comment) : 
                                            undefined
                                        }
                                        onDelete={onReviewDelete ? 
                                            (id) => onReviewDelete(parseInt(id)) : 
                                            undefined
                                        }
                                        currentUserId={currentUserId?.toString()}
                                    />
                                ))}
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                Showing {startIndex + 1} to {Math.min(endIndex, totalReviews)} of {totalReviews} reviews
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {renderPagination()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 