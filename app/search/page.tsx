"use client";

import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Product, useGetProductsQuery } from "@/redux/services/productsApi";
import { useDebounce } from "@/hooks/useDebounce";


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const debouncedQuery = useDebounce(query, 300);
  const { data: sampleProducts, error, isLoading } = useGetProductsQuery('all'); 
  const { categoryFilter, sortBy } = useSelector((state: RootState) => state.userPref);

  if (isLoading) return <p>Loading search results...</p>;
  if (error) return <p>Error fetching search results.</p>;

  // Filter products based on the search query
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

  return (
    <div>
      <h1>{`Search Results for "${query}"`}</h1>

      {filteredProducts?.length ? (
        filteredProducts.map((product) => (
          <div key={product.id}>
            <p>{product.name} - ${product.price} (Rating: {product.net_price})</p>
          </div>
        ))
      ) : (
        <p>No products match your search.</p>
      )}
    </div>
  );
}
