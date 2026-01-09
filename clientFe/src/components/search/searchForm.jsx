import React, { useState } from 'react'

const SearchForm = ({onSearch})=> {
  const[lat, setLat] = useState('');
  const[lng, setLng] = useState('');
  const[radius, setRadius] = useState(10);
  const[categoryId, setCategoryId] = useState('');
  const[subCategorySlug, setSubCategorySlug] = useState('');
  const[sort, setSort] = useState("distance");

  const handleSubmit = (e) =>{
    e.preventDefault();
    onSearch({
      lat,
      lng,
      radius,
      ...(categoryId && {categoryId}),
      ...(subCategorySlug && {subCategorySlug}),
      sort
    });
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow p-4 mb-6 py-4'>
        <h4 className="text-lg font-semibold text-gray-800">
          Search Services
        </h4>
        {/*location*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
            type="Number"
            step="any"
            placeholder='Latitude'
            value={lat}
            onChange={(e)=>setLat(e.target.value)}
            className='border rounded px-3 py-2 w-full'
            required
             />

            <input 
            type="Number"
            step="any"
            placeholder='Longitude'
            value={lng}
            onChange={(e)=>setLng(e.target.value)}
            className='border rounded px-3 py-2 w-full'
            required
             />
        </div>

      {/*Radius*/}
      <div>
        <label htmlFor="" className="block text-sm text-gray-600 mb-1">
          Radius (km)
        </label>
        <select 
        value={radius}
        onChange={(e)=> setRadius(e.target.value)}
        className='border rounded px-3 py-2 w-full'>
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={25}>25 km</option>
          <option value={50}>50 km</option>
         </select>
      </div>

      {/*Category*/ }
      <input 
      type="text"
      placeholder='CategoryId'
      value={categoryId}
      onChange={(e)=> setCategoryId(e.target.value)}
      className="border rounded px-3 py-2 w-full" />

      {/*SubcategoryId*/}
      <input 
      type="text"
      placeholder='subcategory Slug'
      value={subCategorySlug} 
      onChange={(e)=> setSubCategorySlug(e.target.value)}
      className="border rounded px-3 py-2 w-full"/>

      {/*Sort*/}
      <div>
        <label  className="block text-sm text-gray-600 mb-1">
          Sort by
        </label>
        <select 
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className='border rounded px-3 py-2 w-full'
        >
          <option value="distance">Distance</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* submit */}
      <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full'>
        Search
      </button>
      </form>
    </div>
  );
};

export default SearchForm;