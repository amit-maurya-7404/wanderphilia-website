'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Sparkles, Send, ArrowRight, Compass } from 'lucide-react'
import { trips, getLowestPriceForTrip, getLowestPriceForTrips } from '@/lib/data'
import { sectionMappings } from '@/lib/section-mappings'
import Link from 'next/link'
import Image from 'next/image'

interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
  type?: 'text' | 'options' | 'results' | 'custom-dest-input' | 'calendar' | 'contact-form'
  options?: string[]
  results?: Array<{
    id: string
    title: string
    price: number
    image: string
    slug: string
  }>
}

export function AITripPlanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasPulse, setHasPulse] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({})
  
  // Selection states
  const [selections, setSelections] = useState({
    zone: '',
    vibe: '',
    budget: '',
    month: '',
    destination: '',
    travelDate: ''
  })

  const [submitLoading, setSubmitLoading] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  // Track window scroll coordinates for positioning animation
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const getNext6Months = () => {
    const months = []
    const date = new Date()
    for (let i = 0; i < 6; i++) {
      const d = new Date(date.getFullYear(), date.getMonth() + i, 1)
      months.push(d.toLocaleString('en-US', { month: 'long' }))
    }
    return months
  }

  // Initialize chat when opened
  const initChat = () => {
    setSelections({ zone: '', vibe: '', budget: '', month: '', destination: '', travelDate: '' })
    setExpandedMessages({})
    setIsTyping(true)
    setMessages([])
    
    setTimeout(() => {
      setIsTyping(false)
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "Hello! I am your AI Travel Planner assistant. ✈️ Where are you planning to travel next?",
          type: 'options',
          options: ['Domestic India 🇮🇳', 'International 🌍', 'Customise Trip 🎨']
        }
      ])
    }, 1000)
  }

  const handleOpen = () => {
    setIsOpen(true)
    setHasPulse(false)
    if (messages.length === 0) {
      initChat()
    }
  }

  const handleCustomDestinationSubmit = (dest: string) => {
    const newMessages = [...messages]
    if (newMessages.length > 0) {
      const last = { ...newMessages[newMessages.length - 1] }
      if (last.type === 'custom-dest-input') {
        last.type = 'text'
        newMessages[newMessages.length - 1] = last
      }
    }

    setMessages([
      ...newMessages,
      {
        id: `user-dest-${Date.now()}`,
        sender: 'user',
        text: dest
      }
    ])

    setSelections(prev => ({ ...prev, destination: dest }))
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: `calendar-q`,
          sender: 'ai',
          text: `Great choice! ✈️ Please select your travel date from the calendar below: 📅`,
          type: 'calendar'
        }
      ])
    }, 1000)
  }

  const handleDateConfirm = (dateStr: string) => {
    const newMessages = [...messages]
    if (newMessages.length > 0) {
      const last = { ...newMessages[newMessages.length - 1] }
      if (last.type === 'calendar') {
        last.type = 'text'
        newMessages[newMessages.length - 1] = last
      }
    }

    setMessages([
      ...newMessages,
      {
        id: `user-date-${Date.now()}`,
        sender: 'user',
        text: `Travel Date: ${dateStr}`
      }
    ])

    setSelections(prev => ({ ...prev, travelDate: dateStr }))
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: `contact-q`,
          sender: 'ai',
          text: `Perfect! 📅 Please share your contact details to get a customized itinerary & quote from our travel experts:`,
          type: 'contact-form'
        }
      ])
    }, 1000)
  }

  const handleContactFormSubmit = async (details: { name: string; email: string; phone: string }) => {
    const newMessages = [...messages]
    if (newMessages.length > 0) {
      const last = { ...newMessages[newMessages.length - 1] }
      if (last.type === 'contact-form') {
        last.type = 'text'
        newMessages[newMessages.length - 1] = last
      }
    }

    setMessages([
      ...newMessages,
      {
        id: `user-contact-${Date.now()}`,
        sender: 'user',
        text: `Name: ${details.name}\nEmail: ${details.email}\nPhone: ${details.phone}`
      }
    ])

    setIsTyping(true)
    setSubmitLoading(true)

    try {
      const res = await fetch('/api/chatbot-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          phone: details.phone,
          destination: selections.destination,
          travelDate: selections.travelDate
        })
      })

      if (!res.ok) throw new Error('API submission failed')

      setTimeout(() => {
        setIsTyping(false)
        setSubmitLoading(false)
        setMessages(prev => [
          ...prev,
          {
            id: `success-msg`,
            sender: 'ai',
            text: `Thank you, ${details.name}! 🎉 Your custom trip request to **${selections.destination}** on **${selections.travelDate}** has been received successfully.\n\nOur travel expert will connect with you shortly. You can also chat with us directly on WhatsApp!`,
            type: 'results',
            results: []
          }
        ])
      }, 1200)
    } catch (err) {
      console.error(err)
      setTimeout(() => {
        setIsTyping(false)
        setSubmitLoading(false)
        setMessages(prev => [
          ...prev,
          {
            id: `error-msg`,
            sender: 'ai',
            text: `Oops! We encountered an error submitting your details. Please try again or connect with us directly on WhatsApp.`,
            type: 'results',
            results: []
          }
        ])
      }, 1200)
    }
  }

  const selectOption = (option: string) => {
    // 1. Add user reply
    const newMessages = [...messages]
    // Disable previous options buttons
    if (newMessages.length > 0) {
      const last = { ...newMessages[newMessages.length - 1] }
      if (last.type === 'options') {
        last.type = 'text' // removes options layout from previous bubble
        newMessages[newMessages.length - 1] = last
      }
    }

    const updated = [
      ...newMessages,
      {
        id: `user-${Date.now()}`,
        sender: 'user' as const,
        text: option
      }
    ]
    setMessages(updated)
    setIsTyping(true)

    // 2. Determine next step based on selection length
    setTimeout(() => {
      setIsTyping(false)

      if (!selections.zone) {
        if (option.includes('Customise')) {
          setSelections(prev => ({ ...prev, zone: 'Customise' }))
          setMessages(prev => [
            ...prev,
            {
              id: `dest-q`,
              sender: 'ai',
              text: "Awesome! Let's customize your perfect getaway. ✈️ What destination do you have in mind?",
              type: 'options',
              options: ['Leh Ladakh 🏔️', 'Spiti Valley ❄️', 'Kashmir 🌸', 'Bali 🌴', 'Thailand 🏖️', 'Other Location ✏️']
            }
          ])
        } else {
          setSelections(prev => ({ ...prev, zone: option }))
          setMessages(prev => [
            ...prev,
            {
              id: `month-q`,
              sender: 'ai',
              text: "Which month are you planning to travel? 📅",
              type: 'options',
              options: getNext6Months()
            }
          ])
        }
      } else if (selections.zone === 'Customise') {
        if (option.includes('Other Location')) {
          setMessages(prev => [
            ...prev,
            {
              id: `custom-dest-q`,
              sender: 'ai',
              text: "Please type your preferred destination:",
              type: 'custom-dest-input'
            }
          ])
        } else {
          const cleanDest = option.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "").trim()
          setSelections(prev => ({ ...prev, destination: cleanDest }))
          setMessages(prev => [
            ...prev,
            {
              id: `calendar-q`,
              sender: 'ai',
              text: `Great choice! ✈️ Please select your travel date from the calendar below: 📅`,
              type: 'calendar'
            }
          ])
        }
      } else if (!selections.month) {
        setSelections(prev => ({ ...prev, month: option }))
        setMessages(prev => [
          ...prev,
          {
            id: `vibe-q`,
            sender: 'ai',
            text: "Awesome choice! What is your travel style/vibe? 🏔️🌴",
            type: 'options',
            options: ['Adventure & Peaks 🏔️', 'Beaches & Relax 🌴', 'Romantic & Honeymoon 💖']
          }
        ])
      } else if (!selections.vibe) {
        setSelections(prev => ({ ...prev, vibe: option }))
        setMessages(prev => [
          ...prev,
          {
            id: `budget-q`,
            sender: 'ai',
            text: "Perfect! What is your expected budget range per person?",
            type: 'options',
            options: ['Under ₹20,000', '₹20,000 - ₹50,000', 'Above ₹50,000']
          }
        ])
      } else {
        const finalSelections = { ...selections, budget: option }
        setSelections(prev => ({ ...prev, budget: option }))
        
        // Filter logical trips from database
        const matching = getMatchingTrips(finalSelections.zone, finalSelections.vibe, finalSelections.month, option)
        
        setMessages(prev => [
          ...prev,
          {
            id: `results`,
            sender: 'ai',
            text: matching.length > 0 
              ? "Here are the best matching trips for you! 👇 Tap to view or chat on WhatsApp to customize." 
              : "I couldn't find exact matches for this combo, but check out our best-selling packages! 👇",
            type: 'results',
            results: matching
          }
        ])
      }
    }, 1200)
  }

  // Filter trips based on parameters
  const getMatchingTrips = (zone: string, vibe: string, month: string, budget: string) => {
    const isIntl = zone.includes('International')
    
    // Categorize destinations based on zones
    const indiaCategories = ['leh-ladakh', 'spiti', 'kashmir', 'himachal', 'sikkim']
    const intlCategories = ['singapore', 'thailand', 'bhutan', 'vietnam', 'bali']
    
    let candidates = trips.filter(trip => {
      const cat = trip.category?.toLowerCase() || ''
      const matchedZone = isIntl 
        ? intlCategories.includes(cat) || !indiaCategories.includes(cat)
        : indiaCategories.includes(cat)
      
      // Vibe filtering
      let matchedVibe = true
      if (vibe.includes('Honeymoon')) {
        matchedVibe = trip.title?.toLowerCase().includes('honeymoon') || trip.title?.toLowerCase().includes('romantic') || cat === 'bali' || cat === 'thailand'
      } else if (vibe.includes('Beaches')) {
        matchedVibe = cat === 'bali' || cat === 'thailand' || cat === 'singapore' || trip.destination?.toLowerCase().includes('gili')
      } else if (vibe.includes('Adventure')) {
        matchedVibe = cat === 'spiti' || cat === 'leh-ladakh' || cat === 'himachal' || trip.title?.toLowerCase().includes('trek')
      }

      return matchedZone && matchedVibe
    })

    // Apply month filtering if month is selected
    if (month) {
      const selectedMonthLower = month.toLowerCase()
      const withMonth = candidates.filter(trip => {
        if (!trip.batchDates || trip.batchDates.length === 0) return true
        return trip.batchDates.some(bd => 
          bd.month.toLowerCase().includes(selectedMonthLower) || 
          selectedMonthLower.includes(bd.month.toLowerCase())
        )
      })
      if (withMonth.length > 0) {
        candidates = withMonth
      }
    }

    // If candidates are empty, fall back to matching zone only
    if (candidates.length === 0) {
      candidates = trips.filter(trip => {
        const cat = trip.category?.toLowerCase() || ''
        return isIntl ? intlCategories.includes(cat) : indiaCategories.includes(cat)
      })
    }

    // Budget filtering
    const numericBudget = budget.includes('Under') 
      ? 20000 
      : budget.includes('50,000') 
        ? 50000 
        : 999999
    
    const targetPrice = budget.includes('Under')
      ? 20000
      : budget.includes('50,000')
        ? 35000
        : 60000

    const filtered = candidates.filter(trip => {
      const price = getLowestPriceForTrip(trip) || 15000
      if (numericBudget === 20000) return price <= 20000
      if (numericBudget === 50000) return price > 20000 && price <= 50000
      return price > 50000
    })

    // If filtered is empty, sort all candidates by absolute distance to target price
    let finalSelection = []
    if (filtered.length > 0) {
      // Sort matching ones by closeness to target
      filtered.sort((a, b) => {
        const priceA = getLowestPriceForTrip(a) || 15000
        const priceB = getLowestPriceForTrip(b) || 15000
        return Math.abs(priceA - targetPrice) - Math.abs(priceB - targetPrice)
      })
      finalSelection = filtered
    } else {
      // Sort candidates by closeness to target
      candidates.sort((a, b) => {
        const priceA = getLowestPriceForTrip(a) || 15000
        const priceB = getLowestPriceForTrip(b) || 15000
        return Math.abs(priceA - targetPrice) - Math.abs(priceB - targetPrice)
      })
      finalSelection = candidates
    }

    // Map to result format and limit to top 10
    return finalSelection.slice(0, 10).map(trip => {
      const categoryId = trip.category?.toLowerCase().replace(/\s+/g, '-') || 'bali'
      const imagePath = `/images/${categoryId}.jpg`
      const resolvedPrice = getLowestPriceForTrip(trip) || trip.price || 15000
      return {
        id: trip.id,
        title: trip.title || 'Epic Tour Package',
        price: resolvedPrice,
        image: trip.image || imagePath,
        slug: trip.slug || ''
      }
    })
  }

  // Construct WhatsApp Link dynamically based on choices
  const getWhatsAppLink = () => {
    if (selections.zone === 'Customise') {
      const text = encodeURIComponent(
        `Hi Wanderphilia! I want to plan a custom trip to ${selections.destination || 'destination'} in ${selections.travelDate || 'date'}. Please share the best custom itineraries.`
      )
      return `https://wa.me/919217664099?text=${text}`
    }
    const text = encodeURIComponent(
      `Hi Wanderphilia! I used your AI Planner and I am planning a ${selections.zone || 'group'} trip to go in ${selections.month || 'month'} with a ${selections.vibe || 'adventure'} vibe and budget of ${selections.budget || 'budget'}. Please share the best itineraries.`
    )
    return `https://wa.me/919217664099?text=${text}`
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <div 
        className={`fixed ${showScrollToTop ? 'bottom-36 md:bottom-24' : 'bottom-20 md:bottom-8'} right-8 z-[9999] flex flex-col items-end transition-all duration-500 ease-in-out`}
        style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      >
        {hasPulse && (
          <div className="bg-slate-900 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg mb-2 animate-bounce border border-slate-800">
            🤖 Ask AI Planner
          </div>
        )}
        <button
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          className="w-14 h-14 rounded-full bg-linear-to-r from-primary to-orange-500 hover:from-primary/95 hover:to-orange-600 text-white flex items-center justify-center shadow-[0_8px_30px_rgb(255,138,0,0.4)] hover:scale-110 transition duration-300 relative border border-white/20 cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Compass size={26} className="animate-spin-slow" />}
          {hasPulse && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* Glassmorphic Chat Widget Window */}
      {isOpen && (
        <div 
          className="fixed bottom-20 md:bottom-24 right-4 left-4 md:left-auto md:right-[96px] z-[99999] w-auto md:w-[340px] h-[460px] md:h-[500px] bg-white/95 backdrop-blur-md rounded-[32px] shadow-[0_24px_50px_rgba(0,0,0,0.18)] border border-slate-200/80 overflow-hidden flex flex-col animate-fade-in"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          
          {/* Header */}
          <div className="bg-linear-to-r from-orange-500 via-primary to-orange-500 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Sparkles size={18} className="text-yellow-300" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight leading-none">Wanderphilia Assistant</h4>
                <span className="text-[10px] text-white/80 font-semibold block mt-1">Instant Itinerary Planner</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:scale-110 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-55/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                {/* Bubble Text */}
                <div
                  className={`p-3.5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-linear-to-r from-primary to-orange-500 text-white rounded-tr-none shadow-sm'
                      : 'bg-linear-to-b from-white to-slate-50 text-slate-800 rounded-tl-none border border-slate-200/50 shadow-xs'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>

                {/* Option Buttons */}
                {msg.type === 'options' && msg.options && (
                  <div className="mt-3 flex flex-wrap gap-2 w-full">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => selectOption(opt)}
                        className="px-4 py-2 rounded-full border border-primary/30 bg-white hover:bg-primary hover:text-white text-primary font-semibold text-xs transition duration-200 cursor-pointer shadow-xs hover:shadow-sm"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Custom Destination Input */}
                {msg.type === 'custom-dest-input' && (
                  <CustomDestinationInput onSubmit={handleCustomDestinationSubmit} />
                )}

                {/* Calendar Picker */}
                {msg.type === 'calendar' && (
                  <CalendarPicker onConfirm={handleDateConfirm} />
                )}

                {/* Contact Form */}
                {msg.type === 'contact-form' && (
                  <ContactForm onSubmit={handleContactFormSubmit} loading={submitLoading} />
                )}

                {/* Travel Recommendation Cards */}
                {msg.type === 'results' && msg.results && (
                  <div className="mt-3.5 space-y-3.5 w-full max-w-[280px]">
                    {msg.results.slice(0, expandedMessages[msg.id] ? undefined : 3).map((trip) => (
                      <Link
                        key={trip.id}
                        href={`/trips/${trip.slug}`}
                        target="_blank"
                        className="flex flex-col bg-white rounded-2xl border border-slate-150 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition duration-300 overflow-hidden block"
                      >
                        {/* Image Header */}
                        <div className="relative w-full h-24 bg-slate-100 overflow-hidden">
                          <img
                            src={trip.image}
                            alt={trip.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        {/* Text Block */}
                        <div className="p-3 flex flex-col justify-between grow">
                          <h5 className="text-[12px] font-bold text-slate-800 line-clamp-2 leading-tight">
                            {trip.title}
                          </h5>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <div>
                              <span className="text-[9px] text-slate-400 font-semibold block uppercase tracking-wider">Starting Price</span>
                              <span className="text-xs font-black text-primary">
                                ₹{trip.price > 0 ? trip.price.toLocaleString('en-IN') : '23,999'}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                              View Trip <ArrowRight size={10} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {/* Show More Button */}
                    {msg.results.length > 3 && !expandedMessages[msg.id] && (
                      <button
                        onClick={() => setExpandedMessages(prev => ({ ...prev, [msg.id]: true }))}
                        className="w-full py-2.5 rounded-full border border-primary/30 bg-white hover:bg-primary/5 text-primary font-bold text-xs transition duration-200 cursor-pointer text-center"
                      >
                        Show More Packages (+{msg.results.length - 3}) ➔
                      </button>
                    )}
                    
                    {/* Final Action CTA Button */}
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition duration-200 text-center"
                    >
                      Chat on WhatsApp for Quote 💬
                    </a>

                    <button
                      onClick={initChat}
                      className="w-full py-2 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 font-semibold text-xs transition duration-200"
                    >
                      Reset and Plan Again 🔄
                    </button>
                  </div>
                )}

              </div>
            ))}

            {/* Simulated typing bubble */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-150 p-3 rounded-2xl rounded-bl-none shadow-xs w-16">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Footer branding */}
          <div className="p-3 bg-slate-50 border-t border-slate-200/60 text-center">
            <span className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase">Powered by Wanderphilia Local AI</span>
          </div>

        </div>
      )}
    </>
  )
}

function CustomDestinationInput({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2 w-full max-w-[280px]">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter destination (e.g. Maldives)..."
        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-800 bg-white"
        autoFocus
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className={`px-3 py-2 rounded-xl font-bold text-xs transition duration-200 cursor-pointer ${
          value.trim()
            ? 'bg-primary text-white hover:bg-primary/95'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </form>
  )
}

function CalendarPicker({ onConfirm }: { onConfirm: (dateStr: string) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  const monthName = currentDate.toLocaleString('en-US', { month: 'long' })

  const handlePrevMonth = () => {
    const today = new Date()
    if (year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth())) {
      setCurrentDate(new Date(year, month - 1, 1))
      setSelectedDay(null)
    }
  }

  const handleNextMonth = () => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), 1)
    if (currentDate < maxDate) {
      setCurrentDate(new Date(year, month + 1, 1))
      setSelectedDay(null)
    }
  }

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />)
  }

  const today = new Date()
  for (let d = 1; d <= totalDays; d++) {
    const isPast = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const isSelected = selectedDay === d
    days.push(
      <button
        key={`day-${d}`}
        type="button"
        disabled={isPast}
        onClick={() => setSelectedDay(d)}
        className={`w-8 h-8 text-xs font-bold rounded-full flex items-center justify-center transition-all ${
          isPast 
            ? 'text-slate-200 cursor-not-allowed' 
            : isSelected
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-700 hover:bg-orange-50 cursor-pointer'
        }`}
      >
        {d}
      </button>
    )
  }

  const handleConfirm = () => {
    if (selectedDay) {
      const selected = new Date(year, month, selectedDay)
      const dateStr = selected.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      onConfirm(dateStr)
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs w-full max-w-[280px] mt-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer text-slate-600 font-bold"
        >
          &larr;
        </button>
        <span className="text-xs font-black text-slate-800">{monthName} {year}</span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer text-slate-600 font-bold"
        >
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((label) => (
          <span key={label} className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days}
      </div>

      <button
        type="button"
        disabled={!selectedDay}
        onClick={handleConfirm}
        className={`mt-3 w-full py-2 rounded-xl font-bold text-xs transition duration-200 cursor-pointer text-center ${
          selectedDay
            ? 'bg-primary text-white hover:bg-primary/95 shadow-xs'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        Confirm Date
      </button>
    </div>
  )
}

function ContactForm({ 
  onSubmit, 
  loading 
}: { 
  onSubmit: (details: { name: string; email: string; phone: string }) => void
  loading: boolean
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('All fields are required.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (phone.trim().length < 10) {
      setError('Please enter a valid phone number.')
      return
    }
    setError('')
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs w-full max-w-[280px] space-y-3 animate-fade-in">
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-800 bg-white"
          required
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-800 bg-white"
          required
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="E.g., +91 9876543210"
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-slate-800 bg-white"
          required
        />
      </div>

      {error && <p className="text-[11px] font-bold text-red-500 leading-tight">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2.5 rounded-xl font-bold text-xs transition duration-200 cursor-pointer text-center text-white bg-primary hover:bg-primary/95 shadow-sm ${
          loading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  )
}
