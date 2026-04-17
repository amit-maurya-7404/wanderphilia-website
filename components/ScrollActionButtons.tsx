"use client";
import { MdEmail, MdWhatsapp } from "react-icons/md";
import { useState } from "react";
import { IoCall } from "react-icons/io5";

const buttons = [
    {
        icon: <IoCall size={24} />,
        text: "Call Now",
        href: "tel:+919217664099",
        bg: "bg-gradient-to-t from-secondary to-primary",
    },
    // {
    //   icon: <MdEmail size={24} />,
    //   text: "Email Now",
    //   href: "mailto:leaderplumbing25@gmail.com",
    //   bg: "bg-gradient-to-t from-[#0246ee] to-[#3eb4f1]",
    // },
    //   {
    //     icon: <MdEmail size={24} />,
    //     text: "Email Now",
    //     // href: "mailto:", - removed or comment out
    //     bg: "bg-gradient-to-t from-[#0246ee] to-[#3eb4f1]",
    //     className: "pointer-events-none cursor-default",
    //     onClick: (e: React.MouseEvent<HTMLElement>) => e.preventDefault(),
    //     disabled: true,
    // },
    {
        icon: <MdWhatsapp size={24} />,
        text: "Chat Now",
        href: "https://wa.me/+919217664099",
        bg: "bg-gradient-to-t from-secondary to-primary",
    },
];

export default function ScrollActionButtons() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 space-y-4 flex flex-col items-end">
            {buttons.map((btn, index) => (
                <div
                    key={index}
                    className="group cursor-pointer"
                    onMouseEnter={() =>
                        window.innerWidth >= 640 && setHoveredIndex(index)
                    }
                    onMouseLeave={() =>
                        window.innerWidth >= 640 && setHoveredIndex(null)
                    }
                    onClick={() => {
                        if (window.innerWidth < 640) {
                            // Mobile toggle
                            setHoveredIndex((prev) => (prev === index ? null : index));
                        }
                    }}
                >
                    <div
                        className={`flex items-center rounded-l-full text-white shadow-md transition-all duration-300 ${btn.bg}
            ${hoveredIndex === index ? "w-40" : "w-11 md:w-14"} sm:${hoveredIndex === index ? "w-40" : "w-[3.7rem]"
                            }`}
                    >
                        {/* Icon button */}
                        <div
                            className="w-11 h-11 sm:w-13 sm:h-13 flex justify-center items-center rounded-full bg-gray-200 text-black transition-transform p-4"
                            style={{
                                boxShadow: "4px 0 6px -1px rgba(0,0,0,0.3)",
                            }}
                        >
                            <span
                                className="transition-transform"
                                style={{
                                    animation:
                                        hoveredIndex === index ? "rotateOnce 0.6s linear" : "none",
                                }}
                            >
                                {btn.icon}
                            </span>
                        </div>

                        {/* Text + link button (only when expanded) */}
                        {hoveredIndex === index && (
                            <a
                                href={btn.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-3 mx-2 text-base truncate"
                            >
                                {btn.text}
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
