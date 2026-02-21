import { useParams, useNavigate } from "react-router-dom";
import { useCategoryDetails } from '../hooks/useCategoriesDetails.js';
import CategoryHeader from "../components/category/categoryHeader.jsx";
import SubCategoryGrid from "../components/category/subCateoryGrid.jsx";
import { Loader2, AlertCircle } from "lucide-react";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { category, loading, error } = useCategoryDetails(categorySlug);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  // Error State
  if (error || !category) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Category Not Found
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {error || "The category you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleSubCategoryClick = (subSlug) => {
    navigate(`/search?categoryId=${category._id}&subCategorySlug=${subSlug}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Component */}
      <CategoryHeader category={category} />

      {/* Grid Component */}
      <SubCategoryGrid
        subCategories={category.subCategories}
        onSelect={handleSubCategoryClick}
      />
    </div>
  );
};

export default CategoryPage;
