'use client'

import { useState, useEffect } from 'react'
import { Zap, CheckCircle2, Shield, Star, MessageSquare } from 'lucide-react'

interface ChatBubble {
  id: number
  sender: 'user' | 'support'
  message: string
  time: string
  avatar: string
}

export function UnexpectedSupportSection() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)

  const chatMessages: ChatBubble[] = [
    {
      id: 1,
      sender: 'user',
      message: 'Hi, I need some help with my booking.',
      time: '09:41 AM',
      avatar: 'U'
    },
    {
      id: 2,
      sender: 'support',
      message: "Hi 👋 We're here to help. Please share your booking ID so we can check the details.",
      time: '09:41 AM',
      avatar: 'W'
    },
    {
      id: 3,
      sender: 'user',
      message: 'Here is my booking PNR - BKD93735638',
      time: '09:42 AM',
      avatar: 'U'
    },
    {
      id: 4,
      sender: 'support',
      message: 'Got it! Your Bali booking details are loaded. Connecting you with our local on-ground officer in Ubud right now.',
      time: '09:42 AM',
      avatar: 'W'
    }
  ]

  // Animate chat bubble appearance on scroll/load
  useEffect(() => {
    const timers = chatMessages.map((_, i) => {
      return setTimeout(() => {
        setVisibleMessages(i + 1)
      }, (i + 1) * 1500)
    })

    // Reset and replay loop every 12 seconds for dynamic look
    const replayTimer = setInterval(() => {
      setVisibleMessages(0)
      chatMessages.forEach((_, i) => {
        setTimeout(() => {
          setVisibleMessages(i + 1)
        }, (i + 1) * 1500)
      })
    }, 15000)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(replayTimer)
    }
  }, [])

  return (
    <section className="py-20 bg-[#FAF9F5] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Interactive Mobile Mockup */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative w-[300px] h-[580px] bg-slate-950 rounded-[44px] border-[10px] border-slate-900 shadow-2xl flex flex-col overflow-hidden">

              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900 absolute right-4" />
              </div>

              {/* Mockup Screen Content */}
              <div 
                className="flex-1 bg-[#F5F7FA] flex flex-col pt-10 pb-4 px-4 select-none" 
                style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              >

                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                    W
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Wanderphilia Support</h5>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] text-slate-500 font-semibold">On-ground Support Active</span>
                    </div>
                  </div>
                </div>

                {/* Chat History Panel */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide py-2 flex flex-col justify-end">
                  {chatMessages.slice(0, visibleMessages).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 items-end max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                        }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 shadow-xs ${msg.sender === 'user'
                          ? 'bg-slate-300 text-slate-800'
                          : 'bg-primary text-white'
                          }`}
                      >
                        {msg.avatar}
                      </div>

                      {/* Msg bubble */}
                      <div
                        className={`p-2.5 px-3 rounded-2xl text-[11.5px] font-medium leading-relaxed shadow-xs ${msg.sender === 'user'
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                          }`}
                        style={{ letterSpacing: '-0.015em' }}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Footer Mock Input */}
                <div className="mt-2 pt-2 border-t border-slate-250 flex items-center gap-2">
                  <div className="flex-1 bg-white border border-slate-200 rounded-full py-1.5 px-3 text-[10.5px] text-slate-400 font-medium flex items-center justify-between">
                    Type a message...
                    <MessageSquare size={12} className="text-slate-400" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="text-[10px] font-bold">➔</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Value Props */}
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">

            {/* Title Block */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                When Something Unexpected Happens, We're There
              </h2>
              <p className="text-sm md:text-lg text-gray-600 font-medium max-w-2xl leading-relaxed">
                On-ground teams and real humans supporting you, before, during, and after your tour. Help when it truly matters.
              </p>
            </div>

            {/* List Cards */}
            <div className="space-y-6">

              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                  <Zap size={24} className="fill-orange-500/10" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    Human Support, Not Ticket Numbers
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    You're assisted by real people who understand your booking, not automated responses or disconnected vendors.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 shrink-0">
                  <CheckCircle2 size={24} className="fill-emerald-500/10" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    On-Ground Coordination in Critical Situations
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Support during delays, missed confirmations, medical issues, or other unforeseen events while travelling.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-500 shrink-0">
                  <Shield size={24} className="fill-blue-500/10" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    24/7 Verified Safe Travels
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Constant security check-ins, local emergency contacts, and vetted logistics partners to keep you safe throughout your trip.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
