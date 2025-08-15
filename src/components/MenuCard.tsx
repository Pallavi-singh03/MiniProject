"use client";

import { MenuItem } from "@/types/menu";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Props {
  item: MenuItem;
}

export default function MenuCard({ item }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart 🛒`, {
      position: "top-right",
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white rounded-2xl shadow-md p-4 w-full max-w-sm hover:shadow-lg transition"
    >
      <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
        <Image
          src={item.image}
          alt={item.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h3 className="text-xl font-semibold">{item.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-lg font-bold">₹{item.price}</span>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 active:scale-95 transition"
        >
          Add
        </motion.button>
      </div>
    </motion.div>
  );
}
