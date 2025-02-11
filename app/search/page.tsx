"use client";

import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Product, useGetProductsQuery } from "@/redux/services/productsApi";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const debouncedQuery = useDebounce(query, 300);
  const { data: sampleProducts, error, isLoading } = useGetProductsQuery("all");
  const { categoryFilter, sortBy } = useSelector(
    (state: RootState) => state.userPref
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-600 text-center">Loading search results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500 text-center">
          Error fetching search results.
        </p>
      </div>
    );
  }

  const filteredProducts = sampleProducts?.data
    .filter((product: Product) =>
      product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
    .filter((product: Product) => {
      if (categoryFilter === null) return true;
      return product.categories.includes(Number(categoryFilter));
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return b.net_price - a.net_price;
      return 0;
    });

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/"
        className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
      >
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-6">{`Search Results for "${query}"`}</h1>
      {filteredProducts?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block bg-white shadow-md rounded-lg overflow-hidden"
            >
              <Image
                src={product.images?.[0]?.url || "/placeholder.jpg"}
                alt={product.name}
                width={640}
                height={480}
                className="w-full h-48 object-cover"
                priority={false}
              />
              <div className="p-4">
                <h3 className="font-medium text-black">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-yellow-500">Rating: {product.net_price}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          No products match your search.
        </p>
      )}
    </div>
  );
}
