// src/components/review/ReviewCard.tsx

import React from 'react';
import { format } from 'date-fns';
import { User, MessageCircle, ThumbsUp, CheckCircle, Clock } from 'lucide-react';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
      name: string;
      avatarUrl?: string;
    };
    isApproved: boolean;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-[#2D5A27]/10 flex items-center justify-center flex-shrink-0">
          {review.reviewer.avatarUrl ? (
            <img
              src={review.reviewer.avatarUrl}
              alt={review.reviewer.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold text-[#2D5A27]">
              {review.reviewer.name?.charAt(0) || 'U'}
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">
                {review.reviewer.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-sm text-gray-500">
                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            {!review.isApproved ? (
              <span className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                <Clock className="w-3 h-3" />
                Pending
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {review.comment && (
            <p className="mt-3 text-gray-600 leading-relaxed">
              {review.comment}
            </p>
          )}

          <div className="flex items-center gap-4 mt-4">
            <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#2D5A27] transition-colors">
              <ThumbsUp className="w-4 h-4" />
              Helpful
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#2D5A27] transition-colors">
              <MessageCircle className="w-4 h-4" />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;