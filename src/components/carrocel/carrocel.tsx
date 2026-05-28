import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import fundo1 from "../../assets/image/fundo_1.png";
import fundo2 from "../../assets/image/fundo_2.png";
import fundo3 from "../../assets/image/fundo_3.png";
import fundo4 from "../../assets/image/fundo_4.png";

const slides = [
    {
        image: fundo1,
        title: "Send Estimates with Confidence",
        text: "Build and share detailed quotes with your clients before closing the deal.",
    },
    {
        image: fundo2,
        title: "Create and Send Invoices Easily",
        text: "Generate professional invoices in seconds and keep track of your payments in real time.",
    },
    {
        image: fundo3,
        title: "Create and Send Invoices Easily",
        text: "Generate professional invoices in seconds and keep track of your payments in real time.",
    },
    {
        image: fundo4,
        title: "Send Estimates with Confidence",
        text: "Build and share detailed quotes with your clients before closing the deal.",
    },
];

export default function Carousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        slides.forEach((slide) => {
            const img = new Image();
            img.src = slide.image;
        });

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-md">
            {slides.map((slide, i) => (
                <motion.div
                    key={slide.image}
                    initial={false}
                    animate={{ opacity: i === index ? 1 : 0 }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${slide.image})` }}
                />
            ))}

            <motion.div
                key={`content-${index}`}
                initial={{ opacity: 0.2, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col justify-end p-8 md:p-12"
            >
                <div className="text-left w-full max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                        {slides[index].title}
                    </h2>
                    <p className="text-lg md:text-2xl text-white/90 max-w-xl font-extralight drop-shadow-md">
                        {slides[index].text}
                    </p>
                </div>
                <motion.div
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex space-x-2 mt-8"
                >
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-300 ${
                                i === index
                                    ? "h-2 w-6 bg-[#448AFF]"
                                    : "h-2 w-2 bg-white/60"
                            }`}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
