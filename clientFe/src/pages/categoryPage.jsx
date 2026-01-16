import { useParams, useNavigate } from "react-router-dom";
import {useCategories} from '../hooks/useCategories.jsx';
import CategoryHeader from "../components/category/categoryHeader.jsx";
import SubCategoryGrid from "../components/category/subCateoryGrid.jsx";

const CategoryPage = () => {
    const {categorySlug} = useParams();
    const navigate = useNavigate();
    const{categories, loading} = useCategories();

    if(loading){
        return <p className="text-center py-20">Loading category...</p>
    }

    const category = categories.find((cat)=> cat.slug === categorySlug);

     if(!category) {
    return <div className="py-20 text-center">Category not found</div>;
    }

    const handleSubCategoryClick = (subSlug) => {
        navigate(
            `/search?categoryId=${category._id}&subCategorySlug=${subSlug}`
        );
    };

    return(
        <section className="bg-gray-50 min-h-screen ">
            <CategoryHeader category={category}/>
            <SubCategoryGrid
            subCategories={category.subCategories}
            onSelect={handleSubCategoryClick}
            />
        </section>
    )
}

export default CategoryPage;