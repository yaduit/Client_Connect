import { Star } from "lucide-react";

const ReviewSection = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const displayReviews = reviews.slice(0, 3);

  return (
    <section className="py-12 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Reviews ({reviews.length})
      </h2>

      <div className="space-y-6">
        {displayReviews.map((review) => (
          <div key={review._id}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {review.authorName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">{review.text}</p>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button className="mt-6 text-sm text-green-600 hover:text-green-700 font-medium">
          See all {reviews.length} reviews →
        </button>
      )}
    </section>
  );
};

export default ReviewSection;
