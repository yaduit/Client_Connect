import SearchForm from "../components/search/searchForm.jsx";
import SearchResults from "../components/search/searchResuts.jsx";
import { useSearchProviders } from "../hooks/useSearchProvider.jsx";
import Navbar from "../components/layout/navbar.jsx";

const SearchPage = () => {
  const { providers, loading, error, page, setPage } = useSearchProviders();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Discover Local Services
          </h1>
          <p className="text-gray-600">
            Find trusted professionals in your area
          </p>
        </div>

        {/* Search Form */}
        <SearchForm />

        {/* Search Results */}
        <SearchResults
          providers={providers}
          loading={loading}
          error={error}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default SearchPage;