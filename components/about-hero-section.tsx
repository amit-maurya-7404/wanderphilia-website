'use client'

import React from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'

export function AboutHeroSection() {
    const galleryImages = [
        {
            src: '/images/dummy1.jpg',
            alt: 'Big Ben London',
            className: 'md:col-span-2 md:row-span-3 h-40 md:h-[60vh]',
        },
        {
            src: '/images/dummy2.jpg',
            alt: 'Mountain Landscape',
            className: 'h-40 md:h-auto',
        },
        {
            src: '/images/dummy3.jpg',
            alt: 'Historic Building',
            className: 'h-40 md:h-auto',
        },
        {
            src: '/images/dummy4.jpg',
            alt: 'Scenic View',
            className: 'h-40 md:h-auto',
        },
    ]

    const features = [
        { icon: true, text: '10k+ Wanderers' },
        { icon: true, text: 'On Ground Team' },
        { icon: true, text: 'single point accountability' },
        { icon: true, text: 'no third party hassle' },
    ]

    return (
        <section className="w-full bg-white md:pt-10 mt-[10vw] md:mt-[10vw]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-0">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-12 md:mb-0">
                    {/* Left Content */}
                    <div className="flex flex-col justify-start">
                        {/* Main Heading */}
                        <div className="mb-6 md:mb-8">
                            <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold leading-tight">
                                <span className="text-orange-500">Wanderphilia,</span>
                                <br />
                                <span className="text-gray-900">Effortless Travel,</span>
                                <br />
                                <span className="text-gray-900">Beautifully Executed.</span>
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg md:text-lg text-gray-600 leading-relaxed max-w-md">
                            We craft and operate community experiential tours & peronalised multi day tours, supporting our travallers before, during & after the journey ends.

                        </p>
                    </div>

                    {/* Right Gallery */}
                    <div className="w-full">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-max">
                            {galleryImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`relative overflow-hidden rounded-xl md:rounded-2xl ${image.className}`}
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 40vw, 25vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="border-t border-gray-200 pt-8 md:pt-12">
                    {/* मोबाइल (default) पर 1 कॉलम, टैबलेट (sm) पर 2, और डेस्कटॉप (md) पर 4 कॉलम */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 md:justify-items-center">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                // items-start सुनिश्चित करेगा कि अगर टेक्स्ट लंबा होकर दूसरी लाइन में जाए, तो आइकन टॉप पर रहे
                                className="flex items-start md:items-center justify-start md:justify-center gap-3 w-full"
                            >
                                <div className="flex-shrink-0 mt-0.5 md:mt-0">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-orange-500 text-white">
                                        <Check size={16} className="font-bold" />
                                    </div>
                                </div>
                                <span className="text-sm md:text-base font-medium text-gray-700 leading-tight">
                                    {feature.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
