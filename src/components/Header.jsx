"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app  from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart } from "lucide-react";

export default function Header(){

    const [user, setUser] = useState(null);
    const auth = getAuth(app);
    const router = useRouter();
    
    
    const items = useCartStore((state) => state.items);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);

        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };


    return(
        <header className = "flex items-center justify-between px-6 py-4 bg-white shadow-md p-4 sticky top-0 z-50">
            {/*Logo */}
            <Link href ="/" className = "text-2xl font-bold text-[#4A3AFF]">
            TenMinEats 🍽️
            </Link>
        <nav className="flex items-center gap-4">
            <Link href="/menu" className="hover:underline">
                Menu
            </Link>
            
            <Link href="/cart" className="relative flex items-center">
                    <ShoppingCart className="w-6 h-6"/>
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                            {totalItems}
                        </span>
                    )}
                </Link>
                <Link href="/orders" className="hover:underline">Orders</Link>


            {user ? (
                <>
                <span className="text-gray-700 ">{user.email}</span>
                <button 
                    onClick ={handleLogout}
                    className="bg-red-500 text-white px-4 py-1 rounded hover: bg-red-600">
                        Logout
                    </button>
                    </>
            ) : (
                <>
                <Link 
                    href="/login" 
                    className="text-blue-600 hover:underline">
                        Login
                </Link>
                <Link 
                    href = "/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover: bg-blue-700 ">
                        Sign Up
                </Link>
                </>
            )}
            </nav>
        </header>
    );
};

