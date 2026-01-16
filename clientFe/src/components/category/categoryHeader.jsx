const CategoryHeader = ({ category }) => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          {category.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Choose a service under this category
        </p>
      </div>
    </div>
  );
};

export default CategoryHeader;
