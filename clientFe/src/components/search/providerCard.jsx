import React from 'react'

const ProviderCard = ({provider}) => {   
  return (
    <div>
        <div className="bg-white rounded-lg shadow p-4 space-y-2">
            {/*Business name*/}
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                    {provider.businessName}
                </h3>
                {provider.ratingAverage > 0 &&(
                    <span className='text-sm text-yellow-600 font-medium'>
                        ⭐{provider.ratingAverage.toFixed(1)}
                    </span>
                )}
            </div>
            {/* category */}
            {provider.categoryId?.name && (
                <p className="text-sm text-gray-500">
                    {provider.categoryId.name}
                </p>
            )}

            {/* location */}
            <p className="text-sm text-gray-600">
                📍{provider.location?.city},{provider.location?.state}
            </p>

             {/* Distance */}
            <p className="text-sm text-gray-600">
                📏 {provider.distanceKm} km away
            </p>

            {/* Description */}
            {provider.description && (
                <p className="text-sm text-gray-700 line-clamp-2">
                {provider.description}
                </p>
            )}

            {/* Future action */}
            <button disabled className='mt-2 text-sm text-green-600 font-medium cursor-not-allowed'>
                Coming Soon
            </button>
        </div>
    </div>
  );
};

export default ProviderCard;