"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { addItem, reduceItem, removeItem } from "@/redux/slices/cartSlice";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleIncrement = (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      dispatch(addItem({ ...item, quantity: item.quantity + 1 }));
    }
  };

  const handleDecrement = (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      dispatch(reduceItem(id));
    } else {
      dispatch(removeItem(id));
    }
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-6">
        <Link
        href="/"
        className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
      >
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white text-black p-4 shadow rounded-lg">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => handleDecrement(item.id)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncrement(item.id)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                  +
                </button>
                <button onClick={() => dispatch(removeItem(item.id))} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right font-bold text-xl mt-6">
            Total: ${totalAmount.toFixed(2)}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
}
