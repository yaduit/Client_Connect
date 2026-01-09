import React from 'react'
import ProviderCard from './providerCard.jsx';

const SearchResults = ({
  providers,
  loading,
  error,
  page,setPage
}) => {

  if(loading && page === 1){
    return <p className='text-gray-600'>Searching Providers...</p>
  }
  
  if(error){
    return <p className='text-red-600'>{error}</p>
  }

  if(!loading && providers.length === 0){
    return <p className='text-gray-600'>No providers found</p>
  }
  return (
    <div>
       <div className='space-y-4'>
        {/* result grid*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((provider)=>{
                return(
                   <ProviderCard key={provider._id} provider={provider}/>
                );
              })}
          </div>
      </div>

    {/* load more */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={loading}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load more"}
        </button>
      </div>
    </div>
   
  )
}

export default SearchResults;