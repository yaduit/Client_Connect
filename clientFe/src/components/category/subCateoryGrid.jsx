const  SubCategoryGrid = ({subCategories, onSelect}) => {
    if(!subCategories?.length){
        return(
            <div className="py-20 text-center text-gray-600">
                No Subcategories Available
            </div>
        )
}

    return(
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {subCategories.map((sub)=>(
                    <button 
                    key={sub.slug}
                    onClick={() => onSelect(sub.slug)}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow hover:-translate-y-1 transition border border-gray-100 text-left">
                        <h3 className="font-semibold text-gray-900">
                            {sub.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            View Providers
                        </p>
                    </button>
                ))}
            </div>
        </div>
    )


}
export default SubCategoryGrid;