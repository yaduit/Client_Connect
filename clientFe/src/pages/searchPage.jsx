import SearchForm from '../components/search/searchForm.jsx'
import SearchResults from "../components/search/searchResuts.jsx"
import { useSearchProviders } from "../hooks/useSearchProvider.jsx";

const SearchPage = () => {
  const { providers, loading, error, page, setPage } = useSearchProviders();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <SearchForm />
      <SearchResults
        providers={providers}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default SearchPage;
