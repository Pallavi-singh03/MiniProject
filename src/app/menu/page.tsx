"use client";

import {dummyMenu } from "@/data/dummyMenu";
import MenuCard from "@/components/MenuCard";

export default function MenuPage(){
    return(
        <main className="min-h-screen bg-gray-100 py-10 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Menu Items📋</h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {dummyMenu.map((item) => (
                    <MenuCard key = {item.id} item={item}/>
                ))}
            </div>
        </main>
    );
}