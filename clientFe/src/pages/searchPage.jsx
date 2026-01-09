import SearchResuts from '../components/search/searchResuts.jsx';
import SearchForm from '../components/search/searchForm.jsx'
import { useSearchProviders } from '../hooks/useSearchProvider.jsx';

const SearchPage = () => {
  const searchState = useSearchProviders();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <SearchForm onSearch={searchState.search} />
      <SearchResuts {...searchState} />
    </div>
  );
};

export default SearchPage;
