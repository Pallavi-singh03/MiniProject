"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const [user, setUser] = useState<User | null>(null);
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please login to place Order");
      router.push("/login");
      return;
    }
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (deliveryType === "delivery" && address.trim() === "") {
      toast.error("Please enter a delivery address");
      return;
    }

    const db = getFirestore(app);
    const orderObj = {
      userId: user.uid,
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
      })),
      total,
      deliveryType,
      address: deliveryType === "delivery" ? address : " ",
      status: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderObj);
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${docRef.id}`);
    } catch (err: unknown) {
      console.error("Order error:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong while placing order");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <motion.h1
        className="text-2xl font-semibold mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Checkout
      </motion.h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left - Cart Items */}
        <motion.section
          className="bg-white shadow-lg rounded-2xl p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-bold mb-4">Your Items</h2>
          {items.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image
                      src={it.image}
                      alt={it.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-600">
                      ₹{it.price} × {it.quantity}
                    </div>
                  </div>
                  <div className="font-medium">₹{it.price * it.quantity}</div>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Right - Delivery & Payment */}
        <motion.section
          className="bg-white shadow-lg rounded-2xl p-4 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-bold mb-4">Delivery Details</h2>

          {/* Delivery Type */}
          <div>
            <label className="block mb-2 font-medium">Delivery Option</label>
            <div className="flex gap-4 items-center mb-3">
              <label className="flex items-center gap-2">
                <input
                  checked={deliveryType === "pickup"}
                  onChange={() => setDeliveryType("pickup")}
                  type="radio"
                />
                Pickup
              </label>
              <label className="flex items-center gap-2">
                <input
                  checked={deliveryType === "delivery"}
                  onChange={() => setDeliveryType("delivery")}
                  type="radio"
                />
                Delivery
              </label>
            </div>
          </div>

          {/* Address Field */}
          {deliveryType === "delivery" && (
            <div>
              <label className="block mb-1 font-medium">Delivery Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter delivery address"
              />
            </div>
          )}

          {/* Total */}
          <div className="text-right pt-4 border-t">
            <div className="text-xl font-bold mb-4">Total: ₹{total}</div>
            <motion.button
              onClick={placeOrder}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              whileTap={{ scale: 0.95 }}
            >
              Place Order
            </motion.button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
