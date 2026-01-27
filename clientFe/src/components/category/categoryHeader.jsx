import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryHeader = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header Content */}
        <div className="flex items-start gap-4">
          {/* Icon Badge */}
          <div className="w-16 h-16 bg-linear-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600">
              Browse services and find the perfect provider for your needs
            </p>

            {/* Stats Badge (Optional - can be populated with real data later) */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {category.subCategories?.length || 0} subcategories available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;