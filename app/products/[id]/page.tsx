"use client";

import { useState, use } from "react";
import { useDispatch } from "react-redux";
import { addItem, CartItem } from "@/redux/slices/cartSlice";
import { Product, useGetProductsQuery } from "@/redux/services/productsApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";

export default function ProductDetails({ 
  params 
}: Readonly<{ 
  params: Promise<{ id: string }> 
}>) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const { data: productsData, isLoading, isError } = useGetProductsQuery("all");
  //console.log(productsData)
  const resolvedParams = use(params);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton height={400} className="mb-4 skeleton-animated"
          baseColor="#f0f0f0"         
          highlightColor="#e0e0e0" />
        <Skeleton height={30} width="60%" />
        <Skeleton height={20} width="80%" className="mt-2" />
      </div>
    );
  }

  if (isError || !productsData) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        Failed to load product. Please try again later.
      </div>
    );
  }

  const product = productsData.data.find(
    (p: Product) => p.id === Number(resolvedParams.id)
  );

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-600">
        Product not found.
      </div>
    );
  }

  const relatedProducts = productsData.data.filter(
    (p: Product) => p.categories.some((cat) => product.categories.includes(cat)) && p.id !== product.id
  );

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      category: product.categories[0] || 0,
    };
    dispatch(addItem(cartItem));
    setIsInCart(true);
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity + 1,
      category: product.categories[0] || 0,
    };
    dispatch(addItem(cartItem));
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
      if (quantity - 1 === 0) {
        setIsInCart(false);  
        setQuantity(1);     
      } else {
        dispatch(addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity - 1,
          category: product.categories[0] || 0,
        }));
      }
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <Link href="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.images?.[0]?.url || "https://via.placeholder.com/640x480"}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg shadow"
      />
      <p className="text-gray-400 my-4">{product.description}</p>
      <p className="text-2xl font-semibold text-green-600 mb-4">${product.price.toFixed(2)}</p>

      {/* Quantity Control */}
      {!isInCart ? (
  <button
    onClick={handleAddToCart}
    className="w-full max-w-xs bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
  >
    Add to Cart
  </button>
) : (
  <div className="flex items-center justify-between w-full max-w-xs bg-blue-500 text-white rounded-lg overflow-hidden">
    <button
      onClick={handleDecrement}
      className="px-4 py-3 hover:bg-blue-600 transition"
    >
      -
    </button>
    <span className="px-4 py-3">{quantity}</span>
    <button
      onClick={handleIncrement}
      className="px-4 py-3 hover:bg-blue-600 transition"
    >
      +
    </button>
  </div>
)}
      {/* Related Products */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((relatedProduct) => (
            <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                  src={relatedProduct.images?.[0]?.url || "https://via.placeholder.com/640x480"}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-black">{relatedProduct.name}</h3>
                  <p className="text-green-500">${relatedProduct.price}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>
    </div>
  );
}