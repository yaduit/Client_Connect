import { useParams, useNavigate } from "react-router-dom";
import { useCategories } from '../hooks/useCategories.jsx';
import CategoryHeader from "../components/category/categoryHeader.jsx";
import SubCategoryGrid from "../components/category/subCateoryGrid.jsx";
import Navbar from "../components/layout/navbar.jsx";
import { Loader2, AlertCircle } from "lucide-react";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { categories, loading } = useCategories();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading category...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  const category = categories.find((cat) => cat.slug === categorySlug);

  // Category not found state
  if (!category) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Category Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubCategoryClick = (subSlug) => {
    navigate(
      `/search?categoryId=${category._id}&subCategorySlug=${subSlug}`
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      <CategoryHeader category={category} />
      <SubCategoryGrid
        subCategories={category.subCategories}
        onSelect={handleSubCategoryClick}
      />
    </div>
  );
};

export default CategoryPage;