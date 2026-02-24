import { useState } from "react";
import { Star, AlertCircle, CheckCircle } from "lucide-react";
import { createReviewApi } from "../../api/review.api.js";

const ReviewForm = ({ providerId, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a review title");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a review description");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const reviewData = {
        providerId,
        rating: formData.rating,
        title: formData.title,
        description: formData.description,
      };

      await createReviewApi(reviewData);

      setSuccess(true);
      setFormData({ rating: 5, title: "", description: "" });

      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
          <p className="text-green-700 text-sm">Review submitted successfully!</p>
        </div>
      )}

      {/* Rating Section */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-800 mb-4">
          Rate Your Experience
        </label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              className="transition-transform hover:scale-110"
              aria-label={`Rate ${rating} stars`}
            >
              <Star
                size={40}
                className={`${
                  rating <= formData.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {formData.rating} / 5 Stars
        </p>
      </div>

      {/* Title Section */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
          Review Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Summarize your experience"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          maxLength={100}
          disabled={loading}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length} / 100 characters
        </p>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
          Your Review *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Share your detailed experience with this service provider..."
          rows="6"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
          maxLength={1000}
          disabled={loading}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length} / 1000 characters
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || !formData.title.trim() || !formData.description.trim()}
          className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={() => {
            setFormData({ rating: 5, title: "", description: "" });
            setError(null);
          }}
          disabled={loading}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
