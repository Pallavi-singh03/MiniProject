"use client";


import {useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import app  from "@/firebase/firebaseConfig";

export default function Dashboard() {
  const auth = getAuth(app);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if(!user) {
            router.push("/login");

        }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">You're now logged in 🎉</p>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </main>
  );
}
