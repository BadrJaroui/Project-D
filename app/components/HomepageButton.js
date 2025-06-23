"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function HomepageButton() {
  // Creating an useState variable
  const [showImage, setShowImage] = useState(false);

  const HandleClick = () => {
    setShowImage(!showImage);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.button
        onClick={HandleClick}
        className="mt-6 px-6 py-3 bg-yellow-300 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-700"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }} // Gekke boom boom effect
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Get started!
      </motion.button>

      {showImage && (
        <Image
          src="/side-eye-dog.webp"
          alt="Side eye dog"
          width={500}
          height={500}
        >
        </Image>
      )}
    </div>
  );
}
