"use client";

import {useCartStore} from "@/store/useCartStore";
import { hasHydrated } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import {getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "@/firebase/firebaseConfig";
import { toast } from "sonner";
import { Toaster } from 'sonner';
import Image from "next/image";
import Link from "next/link";

export default function CartPage(){
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const clearCart = useCartStore((state) => state.clearCart);

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(hasHydrated());
    }, []);

    const total =items.reduce((sum,item) => sum + item.price * item.quantity, 0);

    console.log("Cart items:", items);

    const db = getFirestore(app);
    const auth = getAuth(app);
    const router = useRouter();

    const placeOrder = async () => {

        console.log("🛒 Placing order...");

        const user = auth.currentUser;

        if(!user){
            toast.error("Please login to place order");
            console.log("❌ No user logged in");
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
        total: total,
        status: "pending",
        createdAt: serverTimestamp(),
     };

     console.log("✅ Order object:", order);


        try{
            const db = getFirestore(app);
            await addDoc(collection(db, "orders") , order);
            clearCart();
            toast.success("Order placed successfully!");
            console.log("🎉 Order placed!");
            router.push("/menu");
 
        }catch(error){
            console.error("🔥 Firebase error:", error);
            toast.error("Something went wrong");
        }

        
    };

    if(!hydrated){
        return <div className="p-6">Loading cart...</div>;
    }
    return (
        <main className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Cart 🛒</h1>

            {items.length === 0 ? (
                <p className="text-gray-600">Your cart is empty</p>

            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div 
                            key= {item.id}
                            className="flex items-center justify-between  bg-white shadow-md rounded-xl p-4"
                            >
                        <div className="flex items-center space-x-4">
                            <div className="relative w-20 h-20 rounded overflow-hidden">
                                <Image 
                                    src = {item.image}
                                    alt = {item.name}
                                    layout ="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-gray-600">
                                    ₹{item.price} × {item.quantity}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick = {() => removeFromCart(item.id)}
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
                </div>
            </div>
            )}
        </main>
    );
}
