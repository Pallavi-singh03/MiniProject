"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import app from "@/firebase/firebaseConfig";

export default function Register(){
    const router = useRouter();
    const auth = getAuth(app);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/dashboard"); //redirect on success

        } catch(err: any){
            setError(err.message);
        }
    };

    return(
        <main className="min-h-screen  flex items-center justify-center bg-gray-100">
            <form
                onSubmit = {handleRegister}
                className="bg-white shadow-lg rounded-xl p-8 w-96">
                    <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                    <input
                        type = "email"
                        placeholder = "Email"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        className = "w-full mb-4 p-2 border rounded"
                        required
                    />

                    <input
                        type = "password"
                        placeholder="Password (min 6 chars)"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        className = "w-full mb-4 p-2 border rounded"
                        required 
                    />

                    {error && <p className="text-red-500 mb-4 text-sm ">{error}</p>}

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 "
                    >
                        Sign Up
                    </button>

                    <p className="text-sm text-center mt-4">Already have an account?{" "}
                        <a href ="/login" className="text-blue-500 underline">
                    Login 
                    </a>
                    </p>
                </form>
        </main>
    );

}