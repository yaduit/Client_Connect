import SearchForm from "../components/search/searchForm.jsx";
import SearchResults from "../components/search/searchResuts.jsx";
import { useSearchProviders } from "../hooks/useSearchProvider.jsx";

const SearchPage = () => {
  const { providers, loading, error, page, setPage } = useSearchProviders();

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar (Sticky) */}
      <SearchForm />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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