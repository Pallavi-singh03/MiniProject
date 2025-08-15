"use client";

import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define types for orders
type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: Timestamp | null; // Firestore timestamp
};

export default function OrderDetailsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    let unsubOrders: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const db = getFirestore(app);
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      unsubOrders = onSnapshot(q, (snap) => {
        const ordersData: Order[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Order, "id">),
        }));
        setOrders(ordersData);
        setLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (unsubOrders) unsubOrders();
    };
  }, [router]);

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link
              href={`/orders/${o.id}`}
              key={o.id}
              className="block p-4 bg-white rounded shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Order #{o.id}</div>
                  <div className="text-sm text-gray-600">
                    {o.createdAt?.toDate
                      ? o.createdAt.toDate().toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="mt-2 text-sm">
                    {o.items?.length ?? 0} item{o.items?.length === 1 ? "" : "s"} — ₹
                    {o.total}
                  </div>
                </div>
                <div className="text-right font-medium">{o.status}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
