"use client";

import { useCartStore, hasHydrated } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "@/firebase/firebaseConfig";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

// Type for Cart Items
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(hasHydrated());
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    const auth = getAuth(app);
    const user: User | null = auth.currentUser;

    if (!user) {
      toast.error("Please login to place order");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const order = {
      userId: user.uid,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "orders"), order);
      clearCart();
      toast.success("Order placed successfully!");
      router.push("/menu");
    } catch (error) {
      console.error("Firebase error:", error);
      toast.error("Something went wrong while placing order");
    }
  };

  if (!hydrated) {
    return <div className="p-6">Loading cart...</div>;
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart 🛒</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow-md rounded-xl p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 rounded overflow-hidden">
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-xl font-bold mb-2">Total: ₹{total}</p>

            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Cart
            </button>

            <Link href="/checkout" className="ml-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Proceed to Checkout
              </button>
            </Link>

            <button
              onClick={placeOrder}
              className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
