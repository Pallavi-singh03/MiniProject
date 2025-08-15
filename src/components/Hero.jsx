"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  // Updated food images with new positions and sizes
  const foodItems = [
    { src: "/Images/Food/samosa3.jpeg", x: "-550px", y: "-30px", size: 220 },
    { src: "/Images/Food/misal1.jpeg", x: "340px", y: "-130px", size: 220 },
    { src: "/Images/Food/Sandwich.jpg", x: "450px", y: "30px", size: 170 },
    { src: "/Images/Food/Coffee.jpg", x: "-380px", y: "60px", size: 200 },
  ];

  // Animation variants for sequential pop-in + float
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 0, rotate: 0 },
    visible: (i) => ({
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1.2, 1, 0.5],
      y: [0, -15, 0, 0],
      rotate: [-5, 5, -5, 0],
      transition: {
        delay: i * 0.5, // sequential “zoop” effect
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center py-20 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/Images/Food/vadapav.jpg')" }}
    >
      {/* Floating food images */}
      {foodItems.map((item, idx) => (
        <motion.div
          key={idx}
          custom={idx}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="absolute"
          style={{
            left: `calc(50% + ${item.x})`,
            top: `calc(50% + ${item.y})`,
          }}
        >
          <Image
            src={item.src}
            alt="Food item"
            width={item.size}
            height={item.size}
            className="rounded-full drop-shadow-xl object-cover"
          />
        </motion.div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Text */}
      <div className="relative z-10 max-w-xl mx-auto px-4">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-[0_0_15px_rgba(0,0,0,0.7)]"
          style={{ fontFamily: "' PlayfairDisplay', serif", fontStyle: "italic"}}
        >
          Welcome to TenMinEats 
        </motion.h1>

        {/* Tagline */}
        <p
          className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md"
          style={{ fontFamily: "'PlayfairDisplay', serif", }}
        >
          Pre-order your{" "}
          <span className="font-semibold">favourite breakfast</span> and get it ready in your{" "}
          <span className="font-semibold">short break</span> — from any nearby cafe, nashta house, or campus canteen.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href="/menu">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg transition"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              View Menu
            </motion.button>
          </Link>

          <Link href="/checkout">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-3 rounded-full font-bold text-lg shadow-lg transition"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Order Now
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
