"use client";

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { addItem, removeItem, CartItem } from '@/redux/slices/cartSlice';
import { setSortBy, setCategoryFilter } from '@/redux/slices/userPreferencesSlice';
import { setSearchQuery } from '@/redux/slices/searchSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { Product, useGetProductsQuery } from '@/redux/services/productsApi';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';

export default function Home() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { sortBy, categoryFilter } = useSelector((state: RootState) => state.userPref);
  const { query } = useSelector((state: RootState) => state.search);
  const debouncedQuery = useDebounce(query, 300, 4);

  const { data: sampleProducts, error, isLoading } = useGetProductsQuery(currentPage);  

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products.</p>;

  const allCategories = Array.from(
    new Set(sampleProducts?.data.flatMap((product) => product.categories))
  );

  const filteredProducts = sampleProducts?.data
    .filter((product: Product) => product.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
    .filter((product: Product) => {
      if (categoryFilter === null) return true;
      return product.categories.includes(Number(categoryFilter));
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.net_price - a.net_price;
      return 0;
    });

  const handleAddToCart = (product: Product) => {
  const cartItem: CartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.categories[0] || 0, 
    quantity: 1,  
  };
  dispatch(addItem(cartItem));
};

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeItem(id));
  };

  const handleSortChange = (sortOption: 'price' | 'rating') => {
    dispatch(setSortBy(sortOption));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };
  const handleSearchSubmit = () => {
    router.push(`/search?q=${query}`);
  };


  return (
    <div className='container mx-auto p-6'>
     {/* Search Bar */}

  <div className="flex items-center space-x-4">
    <label htmlFor="search">Search: </label>
    <div className="relative w-full">
    <input
      className="border rounded-lg px-4 py-2 w-full text-black"
      type="text"
      value={query}
      onChange={handleSearchChange}
      placeholder="Search for products..."
    />
     {/* Search Suggestions */}
    {debouncedQuery && filteredProducts && filteredProducts.length > 0 && (
    <ul className="absolute inset-x-0 bg-white text-gray-600 border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
      {filteredProducts.slice(0, 5).map((product) => (
        <button
          key={product.id}
          onClick={() => dispatch(setSearchQuery(product.name))}
          className="block text-left w-full px-4 py-2 hover:bg-gray-200 cursor-pointer"
        >
          <span className="font-medium">{product.name}</span>
        </button>
      ))}
    </ul>
  )}
  </div>
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      onClick={handleSearchSubmit}
    >
      Search
    </button>
  </div>

{/* Sorting */}
<div className="mb-6 mt-4">
  <label htmlFor="sortBy" className="font-medium">Sort by: </label>
  <select
    id="sortBy"
    value={sortBy}
    onChange={(e) => handleSortChange(e.target.value as 'price' | 'rating')}
    className="border text-black rounded-lg px-4 py-2 ml-2"
  >
    <option value="">None</option>
    <option value="price">Price</option>
    <option value="rating">Rating</option>
  </select>
</div>


      {/* Filtering by category */}
      <div className='mb-6'>
  <label htmlFor="categoryFilter">Filter by Category: </label>
  <select
    className="border rounded-lg px-4 py-2 ml-2 text-black"
    id="categoryFilter"
    value={categoryFilter ?? ''}
    onChange={(e) => dispatch(setCategoryFilter(e.target.value || null))}
  >
    <option value="">All Categories</option>
    {allCategories.map((category) => (
      <option key={category} value={category}>
        Category {category}
      </option>
    ))}
  </select>
</div>


      {/* <h2>Products:</h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      {filteredProducts?.length ? (
        filteredProducts.map(product => (
          <div key={product.id} className="bg-white text-black shadow-md rounded-lg overflow-hidden">
            <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
            <h3 className=" font-semibold">{product.name}</h3>
            <p className="text-gray-600"> ${product.price}</p>
            <p className="text-yellow-500"> (Rating: {product.net_price})</p>
            <button onClick={() => handleAddToCart(product)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Add to Cart</button>
            </div>
           
          </div>
        ))
        
      ) : (
        <p className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center bg-white bg-opacity-60 rounded-lg p-2 mt-4">
        No products matching your search in <span className="font-bold">page {currentPage}</span></p>
      )}
      </div>

      
      {/* Pagination */}
      <div className="flex justify-between items-center mb-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-medium">Page {currentPage}</span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Cart items */}
      <h2>Cart Items:</h2>
      {cartItems.map(item => (
        <div key={item.id}>
          <p>{item.name} - ${item.price} (Quantity: {item.quantity})</p>
          <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
