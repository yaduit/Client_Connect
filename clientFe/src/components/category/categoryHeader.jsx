import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CategoryHeader = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            title="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Center Content */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {category.name}
            </h1>
            <p className="text-gray-600 text-sm">
              Find the perfect service provider
            </p>
          </div>

          {/* Spacer for balance */}
          <div className="shrink-0 w-10" />
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;