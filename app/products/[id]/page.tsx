"use client";

"use client";

import { useState, use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, reduceItem, CartItem } from "@/redux/slices/cartSlice";
import { Product, useGetProductsQuery } from "@/redux/services/productsApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import { RootState } from "@/redux/store";
import Image from "next/image";

export default function ProductDetails({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const dispatch = useDispatch();
  const resolvedParams = use(params);
  const { data: productsData, isLoading, isError } = useGetProductsQuery("all");

  // Get cart state from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Find current product in cart
  const cartItem = cartItems.find(
    (item) => item.id === Number(resolvedParams.id)
  );

  // Initialize state based on cart
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
  const [isInCart, setIsInCart] = useState(!!cartItem);

  // Update local state when cart changes
  useEffect(() => {
    const updatedCartItem = cartItems.find(
      (item) => item.id === Number(resolvedParams.id)
    );
    if (updatedCartItem) {
      setQuantity(updatedCartItem.quantity);
      setIsInCart(true);
    } else {
      setIsInCart(false);
      setQuantity(1);
    }
  }, [cartItems, resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton
          height={400}
          className="mb-4 skeleton-animated"
          baseColor="#f0f0f0"
          highlightColor="#e0e0e0"
        />
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
    (p: Product) =>
      p.categories.some((cat) => product.categories.includes(cat)) &&
      p.id !== product.id
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
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: newQuantity,
        category: product.categories[0] || 0,
      })
    );
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (newQuantity === 0) {
        setIsInCart(false);
        setQuantity(1);
      } else {
        dispatch(reduceItem(product.id));
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/"
        className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
      >
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <Image
        src={product.images?.[0]?.url || "/placeholder.jpg"}
        alt={product.name}
        width={640}
        height={480}
        className="w-full h-96 object-cover rounded-lg shadow"
        priority={false}
      />
      <p className="text-gray-400 my-4">{product.description}</p>
      <p className="text-2xl font-semibold text-green-600 mb-4">
        ${product.price.toFixed(2)}
      </p>

      {/* Quantity Control */}
      <div className="flex flex-wrap">
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
        <Link href="/cart" className="ml-6">
          <p className=" text-green-400 px-4 py-2 rounded-lg hover:underline">
            Go to Cart
          </p>
        </Link>
      </div>
      {/* Related Products */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((relatedProduct) => (
            <Link
              key={relatedProduct.id}
              href={`/products/${relatedProduct.id}`}
            >
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Image
                  src={relatedProduct.images?.[0]?.url || "/placeholder.jpg"}
                  alt={relatedProduct.name}
                  width={640}
                  height={480}
                  className="w-full h-48 object-cover"
                  priority={false}
                />
                <div className="p-4">
                  <h3 className="font-medium text-black">
                    {relatedProduct.name}
                  </h3>
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
