'use client';

import React, { useEffect, useState, useRef } from 'react';
import { doc, getFirestore, getDoc, onSnapshot } from 'firebase/firestore';
import app from '@/firebase/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { use } from 'react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  status: string;
  createdAt?: { toDate: () => Date };
  total: number;
  items?: OrderItem[];
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = React.useState<Order | null >(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const prevStatus = useRef<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const db = getFirestore(app);
      const docRef = doc(db, 'orders', id);

      // Initial fetch
      getDoc(docRef).then((snap) => {
        if (snap.exists()) {
          const data = {...(snap.data() as Order) , id: snap.id  };
          setOrder(data);
          prevStatus.current = data.status;
        } else {
          setOrder(null);
        }
        setLoading(false);
      });

      // Subscribe to real-time updates on this order
      const unsubscribeOrder = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = { ...(snap.data() as Order), id: snap.id };
          setOrder(data);

          // Show toast if status changed
          if (prevStatus.current && prevStatus.current !== data.status) {
            toast(`Order status updated: ${data.status}`, {
              description: `Your order #${data.id} status changed to ${data.status}`,
            });
          }
          prevStatus.current = data.status;
        }
      });

      return () => {
        unsubscribeOrder();
      };
    });

    return () => {
      unsubscribeAuth();
    };
  }, [id, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!order) return <div className="p-6">Order not found.</div>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order #{order.id}</h1>

      <div className="mb-4">
        <div className="text-sm text-gray-600">
          Status: <span className="font-medium">{order?.status ?? 'N/A'}</span>
        </div>
        <div className="text-sm text-gray-600">
          Placed:{' '}
          {order?.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}
        </div>
      </div>

      <div className="space-y-3">
        {order.items?.map((it: OrderItem) => (
          <div key={it.id} className="flex items-center gap-4 p-3 bg-white rounded shadow">
            <div className="relative w-16 h-16 rounded overflow-hidden">
              <Image src={it.image} alt={it.name} fill style={{ objectFit: 'cover' }} />
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

      <div className="text-right mt-4 font-bold">Total: ₹{order.total}</div>
    </main>
  );
}
