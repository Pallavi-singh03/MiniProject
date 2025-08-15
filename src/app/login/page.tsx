"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  AuthError,
} from "firebase/auth";
import app from "@/firebase/firebaseConfig";

export default function Login() {
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      const error = err as AuthError;
      setError(error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 border border-gray-400 p-2 rounded hover:bg-gray-100"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-500 underline">
            Sign Up
          </a>
        </p>
      </form>
    </main>
  );
}
