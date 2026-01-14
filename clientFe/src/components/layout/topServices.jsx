const TopServicesNearYou = () => {
  // Mock provider data - replace with API call in production
  const providers = [
    {
      id: 1,
      name: 'Swift Plumbing Solutions',
      category: 'Plumbing',
      rating: 4.8,
      reviewCount: 142,
      distance: 2.3,
      description: 'Expert plumbing services for residential and commercial needs. Available 24/7 for emergencies.',
      imageUrl: null
    },
    {
      id: 2,
      name: 'TechFix IT Services',
      category: 'IT & Computer Repair',
      rating: 4.9,
      reviewCount: 98,
      distance: 1.5,
      description: 'Professional IT support, computer repair, and network setup for homes and businesses.',
      imageUrl: null
    },
    {
      id: 3,
      name: 'Green Cleaning Co.',
      category: 'House Cleaning',
      rating: 4.7,
      reviewCount: 215,
      distance: 3.1,
      description: 'Eco-friendly cleaning services with certified professionals. Deep cleaning and maintenance.',
      imageUrl: null
    },
    {
      id: 4,
      name: 'Elite Electricians',
      category: 'Electrical Services',
      rating: 4.9,
      reviewCount: 187,
      distance: 1.8,
      description: 'Licensed electricians for installations, repairs, and safety inspections.',
      imageUrl: null
    },
    {
      id: 5,
      name: 'HandyPro Services',
      category: 'Handyman',
      rating: 4.6,
      reviewCount: 156,
      distance: 2.7,
      description: 'All-around handyman services for home repairs, painting, and minor renovations.',
      imageUrl: null
    },
    {
      id: 6,
      name: 'Garden Masters',
      category: 'Landscaping',
      rating: 4.8,
      reviewCount: 124,
      distance: 4.2,
      description: 'Professional landscaping, garden design, and maintenance services for beautiful outdoor spaces.',
      imageUrl: null
    }
  ];

  const userCity = 'Kochi'; // Replace with actual user location

  const handleProviderClick = (id) => {
    console.log('Navigate to provider:', id);
    // Replace with: navigate(`/providers/${id}`)
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <svg key={index} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <svg key={index} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id={`half-${index}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#e5e7eb" />
                  </linearGradient>
                </defs>
                <path fill={`url(#half-${index})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          } else {
            return (
              <svg key={index} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          }
        })}
      </div>
    );
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Top Services Near You
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Highly rated professionals in your area
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Showing results near {userCity}
          </p>
        </div>

        {/* Provider Cards - Horizontal scroll on mobile, grid on desktop */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:overflow-visible sm:mx-0 sm:px-0">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 min-w-max sm:min-w-0">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderClick(provider.id)}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden w-72 sm:w-auto text-left group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label={`View details for ${provider.name}`}
              >
                {/* Image Placeholder */}
                <div className="bg-linear-to-br from-green-50 to-green-100 h-36 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-12 h-12 text-green-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 bg-white px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                    {provider.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Business Name */}
                  <h3 className="font-bold text-base text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {provider.name}
                  </h3>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(provider.rating)}
                    <span className="text-sm font-semibold text-gray-900">{provider.rating}</span>
                    <span className="text-xs text-gray-500">({provider.reviewCount})</span>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{provider.distance} km away</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {provider.description}
                  </p>

                  {/* CTA Button */}
                  <div className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* View More Link */}
        <div className="text-center mt-10">
          <button
            onClick={() => console.log('View all providers')}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
          >
            View all service providers
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default TopServicesNearYou;