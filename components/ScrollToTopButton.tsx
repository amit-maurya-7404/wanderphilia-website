
"use client";
import { useEffect, useState } from "react";
import { FaAngleUp } from "react-icons/fa6";

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisible = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", toggleVisible);
        return () => window.removeEventListener("scroll", toggleVisible);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-20 md:bottom-8 right-8 z-50 w-12 h-12 rounded-full 
  bg-gradient-to-r from-purple-500 to-pink-500 
  text-white shadow-xl transition-all duration-300 flex items-center justify-center
  hover:scale-110 hover:shadow-2xl
  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            aria-label="Scroll to top"
        >
            <FaAngleUp size={18} />
        </button>

    );
};

export default ScrollToTopButton;
