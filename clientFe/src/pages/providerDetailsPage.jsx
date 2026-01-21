import {useParams, Link} from 'react-router-dom';
import { useProviderDetails } from '../hooks/useProviderDetails.jsx';
import ProviderDetailsSkeleton from '../components/providers/providerDetailsSkeleton.jsx';

const ProviderDetailsPage = () => {
    const {id} = useParams();
    const{provider, loading, error} = useProviderDetails(id);

    if(loading) return <ProviderDetailsSkeleton/>;
    if(error){
      return <div className="p-4 text-red-600">
        Failed to load provider
      </div>
    }
    if(!provider){
      return <div className='p-4 text-gray-600'>
        Provider not found
      </div>
    }

    return (
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Link to="/" className="text-green-600 hover:underline">
          ← Back to search
        </Link>

        <div className="bg-white rounded-lg shadow p-6 space-y-3">
          <h1 className="text-2xl font-bold">{provider.businessName}</h1>
          <p className="text-gray-600">
            {provider.categoryId?.name}·{provider.subCategorySlug}
          </p>
          <p className="text-gray-700">{provider.description}</p>
          <p className="text-gray-600">
            📍 {provider.location?.city}, {provider.location?.state}
          </p>
          {provider.ratingAverage > 0 && (
            <p className='text-yellow-600 font-medium'>
                ⭐ {provider.ratingAverage.toFixed(1)} ({provider.totalReviews} reviews)
            </p>
          )}

          <div className="pt-4 space-y-2">
            <button disabled className='w-full bg-green-600 text-white py-2 rounded opacity-70'>
                contact provider (coming soon)
            </button>

            <button disabled className='w-full border py-2 rounded opacity-70'>
                Request service (coming soon)
            </button>
          </div>
        </div>
      </div>
    );
};

export default ProviderDetailsPage;