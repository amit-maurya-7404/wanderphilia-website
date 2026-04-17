'use client'

import type { Trip } from '@/lib/data'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { ArrowRight } from 'lucide-react'

type DepartureDate = Trip['dates'][number]

interface UpcomingDeparturesProps {
    datesByMonth: Record<string, DepartureDate[]>
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
}

export function UpcomingDepartures({ datesByMonth }: UpcomingDeparturesProps) {
    const groupedMonths = Object.entries(datesByMonth)
    const previewMonths = groupedMonths.slice(0, 3)

    return (
        <section className="rounded-3xl border border-white/30 bg-gradient-to-br from-white to-slate-50 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Upcoming Departures
                    </h2>
                    <p className="text-xs text-gray-500">
                        Choose your preferred date
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
                
                {/* Scrollable Premium Chips */}
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 min-w-max">
                        {previewMonths.map(([month, dates]) => (
                            <div
                                key={month}
                                className="group flex-col max-w-auto items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-[2px]"
                            >
                                {/* Month */}
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {month}
                                </span>

                                {/* Divider */}
                                <div className="w-full h-px  my-[3vw] md:my-[1vw] bg-slate-200" />

                                {/* Dates */}
                                <div className="flex gap-2">
                                    {dates.slice(0).map((date, index) => (
                                        <span
                                            key={index}
                                            className="rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-gray-900 transition-all group-hover:bg-blue-50 group-hover:text-blue-600"
                                        >
                                            {new Date(date.startDate).getDate()}
                                        </span>
                                    ))}
                                </div>

                                {/* Extra Count */}
                                {/* {dates.length > 2 && (
                                    <span className="text-xs text-gray-400">
                                        +{dates.length - 2}
                                    </span>
                                )} */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Premium Arrow Button */}
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="flex h-7 w-7 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95">
                            <ArrowRight className="h-4 w-4 text-gray-700" />
                        </button>
                    </SheetTrigger>

                    <SheetContent side="bottom" className="max-w-full rounded-t-3xl p-5">
                        <SheetHeader>
                            <SheetTitle className="text-lg font-semibold">
                                All Departure Dates
                            </SheetTitle>
                        </SheetHeader>

                        <div className="mt-5 space-y-6">
                            {groupedMonths.map(([month, dates]) => (
                                <div key={month}>
                                    
                                    {/* Month Title */}
                                    <p className="text-sm font-semibold text-gray-900 mb-3">
                                        {month}
                                    </p>

                                    {/* Dates Grid */}
                                    <div className="flex flex-wrap gap-2">
                                        {dates.map((date, index) => (
                                            <span
                                                key={index}
                                                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                                            >
                                                {formatDate(date.startDate)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </section>
    )
}