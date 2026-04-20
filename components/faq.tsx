'use client';

import { useState } from 'react';

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: 'What types of travel experiences does Wanderphilia specialise in?',
            intro: 'Wanderphilia focuses on four core travel formats:',
            bullets: [
                'Community Group Tours – curated, social, experience-driven journeys',
                'Personalised Family Trips – comfortable, well-paced, stress-free travel',
                'Honeymoon Experiences – thoughtfully designed, private, and memorable',
                'Corporate & MICE Travel – structured, seamless, and professionally executed',
            ],
            outro: 'Each format is handled with dedicated expertise and tailored planning, not a one-size-fits-all approach.',
        },
        {
            question: 'What makes Wanderphilia different from other travel companies?',
            intro: 'The difference lies in how we operate.',
            bullets: [
                '100% in-house coordination',
                'Strong focus on execution, not just planning',
                'Carefully verified partners only',
                'Continuous support throughout the journey',
            ],
            outro: 'We don\'t just design trips — we take responsibility for delivering them smoothly. Wanderphilia is always with you throughout your journey. 🧡',
        },
        {
            question: 'What is Wanderphilia and what do you stand for?',
            intro: 'Wanderphilia is an experiential travel company built on one core idea: travel should feel seamless, meaningful, and well-managed — not stressful or transactional.',
            text: 'We focus on creating journeys that are:',
            bullets: [
                'Thoughtfully planned',
                'Smoothly executed',
                'Experience-driven',
            ],
            outro: 'Our approach is simple — do the basics perfectly, and the experience follows.',
        },
        {
            question: 'Are the quality and services the same across all types of trips?',
            intro: 'Yes.',
            text: 'Whether it\'s:',
            bullets: [
                'A group departure',
                'A private honeymoon',
                'A family vacation',
                'A corporate outing',
            ],
            text2: 'We maintain:',
            bullets2: [
                'Verified stays and transport',
                'Strong execution standards',
                'Continuous support',
            ],
            outro: 'The format may change — the quality does not.',
        },
        {
            question: 'How do you ensure quality of hotels, transport, and experiences?',
            intro: 'We only work with verified and trusted partners.',
            text: 'Every hotel, vehicle, and activity is selected based on:',
            bullets: [
                'Consistent guest experience',
                'Reliability',
                'Safety and comfort standards',
            ],
        },
        {
            question: 'Will I get the same level of support in all trips?',
            intro: 'Absolutely.',
            text: 'Across all travel formats, we provide:',
            bullets: [
                'Pre-trip guidance',
                'On-trip support (always accessible)',
                'Post-trip assistance',
            ],
            outro: 'You are always one call or message away from our team.',
        },
        {
            question: 'How do you manage such different types of travel?',
            intro: 'Through strong in-house operations and structured systems.',
            text: 'Each segment — group tours, family trips, honeymoons, and corporate travel — is managed with:',
            bullets: [
                'Dedicated planning approach',
                'Verified partners',
                'End-to-end execution control',
            ],
            outro: 'This ensures consistency in quality across all formats.',
        },
        {
            question: 'How do you make sure the trip runs smoothly on-ground?',
            intro: 'Through strong operational control and real-time coordination.',
            bullets: [
                'Dedicated trip captains (for group tours)',
                'Backend operations team monitoring the trip',
                'Immediate issue resolution if required',
            ],
            outro: 'Planning is important — but execution is where we truly focus.',
        },
        {
            question: 'What if something doesn\'t go as planned during the trip?',
            intro: 'Travel can be dynamic — and we\'re prepared for that.',
            text: 'We respond with:',
            bullets: [
                'Quick decision-making',
                'Backup solutions',
                'Active coordination',
            ],
            outro: 'Our goal is simple: resolve quickly and keep your experience uninterrupted.',
        },
        {
            question: 'Why should I trust Wanderphilia across different travel needs?',
            intro: 'Because we don\'t just specialise in destinations — we specialise in execution across formats.',
            bullets: [
                'Community-led group experiences',
                'Carefully curated private journeys',
                'Professionally managed corporate travel',
            ],
            outro: 'All backed by strong systems, experienced team, and complete ownership.',
        },
        {
            question: 'How transparent are you in terms of pricing and commitments?',
            intro: 'Completely transparent.',
            text: 'We ensure:',
            bullets: [
                'Clear breakdown of inclusions and exclusions',
                'No hidden costs',
                'Realistic commitments',
            ],
            outro: 'We believe clear communication avoids confusion later.',
        },
        {
            question: 'Who is responsible if something goes wrong during the trip?',
            intro: 'Wanderphilia remains your single point of contact throughout the tour. Our teams manage disruptions, coordinate alternatives or applicable refunds, and handle escalations directly without pushing you between different service providers.',
        },
        {
            question: 'How are itineraries created so quickly?',
            intro: 'We rely on internal itinerary and pricing platforms that bring together real-time availability, direct supplier relationships, and destination specialists. AI-supported tools help shortlist suitable routing and pacing, while experienced planners validate feasibility and finalise the plan.',
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-white">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </h2>
                    <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
                    <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                        "Whether you're travelling with a group, your family, your partner, or your team — Wanderphilia ensures the same standard of care, planning, and execution across every journey."
                    </p>

                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-orange-500/50 hover:shadow-md"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
                            >
                                <span className="text-lg font-semibold text-gray-900">
                                    {index + 1}. {faq.question}
                                </span>
                                <span
                                    className={`text-orange-500 flex-shrink-0 ml-4 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                >
                                    ▼
                                </span>
                            </button>

                            {openIndex === index && (
                                <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 animate-in fade-in duration-300">
                                    <div className="text-gray-700 leading-relaxed space-y-3">
                                        {faq.intro && <p>{faq.intro}</p>}
                                        {faq.text && <p className="mt-2">{faq.text}</p>}
                                        {faq.bullets && (
                                            <ul className="list-disc list-inside space-y-2 ml-2">
                                                {faq.bullets.map((bullet, i) => (
                                                    <li key={i} className="text-gray-700">{bullet}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {faq.text2 && <p className="mt-3">{faq.text2}</p>}
                                        {faq.bullets2 && (
                                            <ul className="list-disc list-inside space-y-2 ml-2">
                                                {faq.bullets2.map((bullet, i) => (
                                                    <li key={i} className="text-gray-700">{bullet}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {faq.outro && <p className="mt-3">{faq.outro}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-orange-50 to-white border border-orange-200 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Didn&apos;t find your answer?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Our team is here to help. Contact us for personalized assistance and we'll get back to you within 24 hours.
                    </p>
                    <button className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                        Contact Support
                    </button>
                </div>
            </div>
        </section>
    );
}
