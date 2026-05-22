import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import imageslide from "../../assets/image/carrocel_1.png";
import imageslieder2 from "../../assets/image/corrocel_2.png";
import imageslieder3 from "../../assets/image/corrocel_3.png";

const slides = [
    {
        image: imageslide,
        title: "Send Estimates with Confidence",
        text: "Build and share detailed quotes with your clients before closing the deal.",
    },
    {
        image: imageslieder2,
        title: "Create and Send Invoices Easily",
        text: "Generate professional invoices in seconds and keep track of your payments in real time.",
    },
    {
        image: imageslieder3,
        title: "Create and Send Invoices Easily",
        text: "Generate professional invoices in seconds and keep track of your payments in real time.",
    },
];

export default function Carousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-screen h-screen bg-[#A6E7FD] overflow-hidden flex items-center justify-center p-4 rounded-md">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.7, delay: 0 } }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="flex flex-col  justify-center w-full max-w-xl"
                >
                    <img
                        src={slides[index].image}
                        alt="Carousel slide"
                        className="max-w-[1000px] h-auto mb-12"
                    />
                    <div className="text-left w-full">
                        <h2 className="text-4xl font-bold text-black mb-4">
                            {slides[index].title}
                        </h2>
                        <p className="text-2xl text-black max-w-xl font-extralight ">{slides[index].text}</p>
                    </div>
                    <div className="flex space-x-2 mt-8 self-start">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-full ${
                                    i === index
                                        ? "h-2 w-6 bg-[#448AFF]"
                                        : "h-2 w-2 bg-gray-400"
                                }`}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}