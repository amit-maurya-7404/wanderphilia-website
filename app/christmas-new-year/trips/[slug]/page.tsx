'use client'

import { useState, useMemo, useEffect, useRef, use } from 'react'
import { useRouter, useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { DownloadTourPdfDialog } from '@/components/download-tour-pdf-dialog'
import { TripReviewsSection } from '@/components/trip-reviews-section'
import { TripGallerySection } from '@/components/trip-gallery-section'
import { ChristmasSnowfall } from '@/components/christmas-snowfall'
import { trips } from '@/lib/data'
import { destinationItineraryImages } from '@/lib/section-mappings'
import { contactEmail, contactPhone, contactPhoneDisplay, instagramUrl } from '@/lib/contact'
import { RiWhatsappLine } from 'react-icons/ri'
import {
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  ChevronDown,
  Download,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Car,
  Hotel,
  Utensils,
  Share2,
  Sparkles,
  ArrowLeft,
  Gift,
} from 'lucide-react'

function cleanLocation(loc: string): string {
  let clean = loc
    .trim()
    .replace(
      /^(in|at|near|into|stay in|stay at|stay near|camps near|camp near|hotel in|hotel at|homestay in|homestay at|campsite near|resort in|resort at|camps in|camps at|camp at|camp in|hotels in|hotels at)\s+/i,
      ''
    )
    .replace(/\s+(camps?|hotels?|resorts?|homestays?|cottages?|deluxe camps?)$/i, '')
    .replace(/\.$/, '')
    .trim()

  const lower = clean.toLowerCase()

  if (lower.includes('leh')) return 'Leh'
  if (lower.includes('nubra')) return 'Nubra'
  if (lower.includes('pangong')) return 'Pangong'
  if (lower.includes('turtuk')) return 'Turtuk'
  if (lower.includes('kargil')) return 'Kargil'
  if (lower.includes('srinagar')) return 'Srinagar'
  if (lower.includes('jispa')) return 'Jispa'
  if (lower.includes('sarchu')) return 'Sarchu'
  if (lower.includes('manali')) return 'Manali'
  if (lower.includes('kasol')) return 'Kasol'
  if (lower.includes('kheerganga')) return 'Kheerganga'
  if (lower.includes('tirthan')) return 'Tirthan'
  if (lower.includes('jibhi')) return 'Jibhi'
  if (lower.includes('tosh')) return 'Tosh'
  if (/\bbir\b/i.test(lower)) return 'Bir'
  if (lower.includes('shangarh')) return 'Shangarh'
  if (lower.includes('shimla')) return 'Shimla'
  if (lower.includes('kalpa')) return 'Kalpa'
  if (lower.includes('kaza')) return 'Kaza'
  if (lower.includes('chandra') || lower.includes('chandratal')) return 'Chandratal'
  if (lower.includes('rampur')) return 'Rampur'
  if (lower.includes('tabo')) return 'Tabo'
  if (lower.includes('guwahati')) return 'Guwahati'
  if (lower.includes('cherrapunji')) return 'Cherrapunji'
  if (lower.includes('shnongpdeng')) return 'Shnongpdeng'
  if (lower.includes('shillong')) return 'Shillong'
  if (lower.includes('hanoi')) return 'Hanoi'
  if (lower.includes('ha long') || lower.includes('halong')) return 'Ha Long Bay'
  if (lower.includes('da nang') || lower.includes('danang')) return 'Da Nang'
  if (lower.includes('ho chi minh')) return 'Ho Chi Minh'
  if (lower.includes('hoi an')) return 'Hoi An'
  if (lower.includes('saigon')) return 'Saigon'
  if (lower.includes('phu quoc') || lower === 'phu') return 'Phu Quoc'
  if (lower.includes('sapa')) return 'Sapa'
  if (lower.includes('ubud')) return 'Ubud'
  if (lower.includes('seminyak')) return 'Seminyak'
  if (lower.includes('nusa penida') || lower.includes('nusa')) return 'Nusa Penida'
  if (lower.includes('thimphu')) return 'Thimphu'
  if (lower.includes('punakha')) return 'Punakha'
  if (lower.includes('paro')) return 'Paro'
  if (lower.includes('lataguri')) return 'Lataguri'
  if (lower.includes('gangtok')) return 'Gangtok'
  if (lower.includes('lachen')) return 'Lachen'
  if (lower.includes('lachung')) return 'Lachung'
  if (lower.includes('gulmarg')) return 'Gulmarg'
  if (lower.includes('pahalgam')) return 'Pahalgam'
  if (lower.includes('munnar')) return 'Munnar'
  if (lower.includes('thekkady')) return 'Thekkady'
  if (lower.includes('alleppey')) return 'Alleppey'
  if (lower.includes('kovalam')) return 'Kovalam'
  if (lower.includes('cochin') || lower.includes('kochi')) return 'Kochi'
  if (lower.includes('udaipur')) return 'Udaipur'
  if (lower.includes('jodhpur')) return 'Jodhpur'
  if (lower.includes('jaisalmer')) return 'Jaisalmer'
  if (lower.includes('jaipur')) return 'Jaipur'
  if (lower.includes('pushkar')) return 'Pushkar'
  if (lower.includes('port blair')) return 'Port Blair'
  if (lower.includes('havelock')) return 'Havelock'
  if (lower.includes('neil')) return 'Neil Island'
  if (lower.includes('dharamshala') || lower.includes('dharmshala')) return 'Dharamshala'
  if (lower.includes('dalhousie')) return 'Dalhousie'
  if (lower.includes('amritsar')) return 'Amritsar'
  if (lower.includes('rishikesh')) return 'Rishikesh'
  if (lower.includes('chopta')) return 'Chopta'
  if (lower.includes('joshimath')) return 'Joshimath'
  if (lower.includes('mussoorie')) return 'Mussoorie'
  if (lower.includes('haridwar')) return 'Haridwar'
  if (lower.includes('barkot')) return 'Barkot'
  if (lower.includes('uttarkashi')) return 'Uttarkashi'
  if (lower.includes('guptkashi')) return 'Guptkashi'
  if (lower.includes('kedarnath')) return 'Kedarnath'
  if (lower.includes('badrinath')) return 'Badrinath'
  if (lower.includes('ooty')) return 'Ooty'
  if (lower.includes('kodaikanal')) return 'Kodaikanal'
  if (lower.includes('coimbatore')) return 'Coimbatore'
  if (lower.includes('north goa')) return 'North Goa'
  if (lower.includes('south goa')) return 'South Goa'
  if (lower.includes('goa')) return 'Goa'
  if (lower.includes('pelling')) return 'Pelling'
  if (lower.includes('darjeeling')) return 'Darjeeling'
  if (lower.includes('hanle')) return 'Hanle'
  if (lower.includes('phuentsholing') || lower.includes('phuntsholing')) return 'Phuentsholing'
  if (lower.includes('siliguri')) return 'Siliguri'
  if (lower.includes('gili')) return 'Gili Island'
  if (lower.includes('kuta')) return 'Kuta'
  if (lower.includes('pattaya')) return 'Pattaya'
  if (lower.includes('bangkok')) return 'Bangkok'
  if (lower.includes('phuket')) return 'Phuket'
  if (lower.includes('krabi')) return 'Krabi'
  if (lower.includes('koh phangan') || lower === 'koh') return 'Koh Phangan'
  if (lower.includes('singapore')) return 'Singapore'
  if (lower.includes('gushaini')) return 'Gushaini'
  if (lower.includes('chitkul')) return 'Chitkul'
  if (lower.includes('nako')) return 'Nako'
  if (lower.includes('tso moriri')) return 'Tso Moriri'
  if (lower.includes('aritar')) return 'Aritar'
  if (lower.includes('rishikhola')) return 'Rishikhola'

  if (clean.length < 15) {
    return clean.charAt(0).toUpperCase() + clean.slice(1)
  }
  return clean.split(' ')[0]
}

function getStaySummary(itinerary: any[]): string {
  if (!itinerary || !itinerary.length) return ''

  const stays: string[] = []
  itinerary.forEach((day, index) => {
    let descLines: string[] = []
    if (typeof day.description === 'string') {
      descLines = [day.description]
    } else if (Array.isArray(day.description)) {
      descLines = day.description
    }

    const hasOvernightJourney =
      descLines.some((line) =>
        /overnight journey|overnight travel|overnight transit|overnight volvo/i.test(line)
      ) ||
      /overnight journey|overnight travel|overnight transit|overnight volvo/i.test(day.title)

    if (hasOvernightJourney) {
      return
    }

    let stayFound = false
    for (const line of descLines) {
      const match = line.match(
        /(?:overnight\s*(?:stay)?|night\s*stay|stay\s*overnight)\s*(?:in|at|near|into|to|hotel in|hotel at|camp in|camps at|camps in)?\s+([^.]+)/i
      )
      if (match) {
        const loc = cleanLocation(match[1])
        if (
          loc &&
          ![
            'the',
            'your',
            'hotel',
            'camp',
            'camps',
            'resort',
            'homestay',
            'similar',
          ].includes(loc.toLowerCase())
        ) {
          stays.push(loc)
          stayFound = true
          break
        }
      }
    }
    if (!stayFound) {
      const titleMatch = day.title.match(
        /(?:overnight\s*(?:stay)?|night\s*stay|stay\s*overnight)\s*(?:in|at|near|into|to|hotel in|hotel at)?\s+([^.]+)/i
      )
      if (titleMatch) {
        const loc = cleanLocation(titleMatch[1])
        if (
          loc &&
          ![
            'the',
            'your',
            'hotel',
            'camp',
            'camps',
            'resort',
            'homestay',
            'similar',
          ].includes(loc.toLowerCase())
        ) {
          stays.push(loc)
          stayFound = true
        }
      }
    }
    if (!stayFound && index < itinerary.length - 1) {
      for (const line of descLines) {
        const match = line.match(
          /(?:check[- ]?in\s+(?:to|at)\s+(?:your\s+)?(?:hotel\s+in|hotel\s+at|camp\s+in|resort\s+in)?|reach|arrive\s+in)\s+([^.]+)/i
        )
        if (match) {
          const loc = cleanLocation(match[1])
          if (
            loc &&
            ![
              'the',
              'your',
              'hotel',
              'camp',
              'camps',
              'resort',
              'homestay',
              'airport',
            ].includes(loc.toLowerCase())
          ) {
            stays.push(loc)
            stayFound = true
            break
          }
        }
      }
    }
  })

  const grouped: { loc: string; nights: number }[] = []
  stays.forEach((loc) => {
    if (grouped.length > 0 && grouped[grouped.length - 1].loc === loc) {
      grouped[grouped.length - 1].nights++
    } else {
      grouped.push({ loc, nights: 1 })
    }
  })

  return grouped.map((g) => `${g.nights}N ${g.loc}`).join(' - ')
}

function getFirstNarrativeParagraph(description: string | string[]): string {
  if (!Array.isArray(description)) {
    return description
  }

  let inHighlights = false
  for (let i = 0; i < description.length; i++) {
    const item = description[i].trim()
    const lowerItem = item.toLowerCase()

    if (lowerItem.startsWith('highlights of the')) {
      inHighlights = true
      continue
    }

    if (inHighlights) {
      const isNarrative =
        item.length > 80 ||
        lowerItem.startsWith('arrive') ||
        lowerItem.startsWith('after') ||
        lowerItem.startsWith('today') ||
        lowerItem.startsWith('check out') ||
        lowerItem.startsWith('for ')

      if (isNarrative) {
        return item
      }
      continue
    }

    const isExcluded =
      lowerItem.startsWith('meals') ||
      lowerItem.startsWith('overnight') ||
      lowerItem === 'dinner' ||
      lowerItem === ' dinner' ||
      lowerItem.includes('breakfast')

    if (!isExcluded) {
      return item
        .replace(
          /^(transfer|transfers|accommodation|hotels?|sightseeing(?:\s*&\s*experiences)?|activities|experiences|meals?)\s*:\s*/i,
          ''
        )
        .trim()
    }
  }

  return description[0]
    ? description[0]
        .replace(
          /^(transfer|transfers|accommodation|hotels?|sightseeing(?:\s*&\s*experiences)?|activities|experiences|meals?)\s*:\s*/i,
          ''
        )
        .trim()
    : ''
}

function parseDayForSummary(description: string | string[]) {
  const result = {
    transfers: [] as string[],
    hotels: [] as string[],
    sightseeing: [] as string[],
    meals: [] as string[],
  }

  if (!Array.isArray(description)) {
    return result
  }

  description.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    const lower = trimmed.toLowerCase()

    if (lower.startsWith('highlights of the')) return

    if (
      lower.startsWith('meals:') ||
      lower.startsWith('meals :') ||
      lower.includes('meals') ||
      lower.includes('breakfast') ||
      lower.includes('lunch') ||
      lower.includes('dinner')
    ) {
      const foundMeals: string[] = []
      if (lower.includes('breakfast')) foundMeals.push('Breakfast')
      if (lower.includes('lunch')) foundMeals.push('Lunch')
      if (lower.includes('dinner')) foundMeals.push('Dinner')
      if (foundMeals.length > 0) {
        foundMeals.forEach((m) => {
          if (!result.meals.includes(m)) result.meals.push(m)
        })
      } else {
        result.meals.push(trimmed.replace(/^meals\s*:\s*/i, '').trim())
      }
    } else if (
      lower.startsWith('accommodation:') ||
      lower.startsWith('accommodation :') ||
      lower.startsWith('hotel:') ||
      lower.startsWith('hotels:') ||
      lower.includes('overnight stay') ||
      lower.includes('stay in') ||
      lower.includes('hotel') ||
      lower.includes('resort') ||
      lower.includes('check-in') ||
      lower.includes('check in') ||
      lower.includes('check out') ||
      lower.includes('check-out') ||
      lower.includes('camp')
    ) {
      const rawName = trimmed
        .replace(/^accommodation\s*:\s*/i, '')
        .replace(/^hotels?\s*:\s*/i, '')
        .replace(/overnight stay near/i, '')
        .replace(/overnight stay in/i, '')
        .replace(/overnight stay at/i, '')
        .replace(/overnight stay/i, '')
        .replace(/stay in/i, '')
        .replace(/check.in at/i, '')
        .replace(/^[:\s\-\.\,]+/, '')
        .replace(/[.\s]+$/, '')
        .trim()
      const hotelName = rawName || 'Hotel'
      if (!result.hotels.includes(hotelName)) result.hotels.push(hotelName)
    } else if (
      lower.startsWith('transfer:') ||
      lower.startsWith('transfer :') ||
      lower.startsWith('transfers:') ||
      lower.includes('transfer') ||
      lower.includes('pick you up') ||
      lower.includes('pick up') ||
      lower.includes('airport') ||
      lower.includes('drive to') ||
      lower.includes('travel to') ||
      lower.includes('proceed to') ||
      lower.includes('reach') ||
      lower.includes('railway') ||
      lower.includes('station') ||
      lower.includes('cab')
    ) {
      const clean = trimmed.replace(/^transfers?\s*:\s*/i, '').trim()
      if (!result.transfers.includes(clean)) result.transfers.push(clean)
    } else {
      const clean = trimmed
        .replace(/^(sightseeing(?:\s*&\s*experiences)?|activities|experiences)\s*:\s*/i, '')
        .trim()
      if (!result.sightseeing.includes(clean)) result.sightseeing.push(clean)
    }
  })

  return result
}

function parseDayItinerarySummary(day: { day: number; title: string; description: string | string[] }) {
  const transfers: string[] = []
  const experiences: string[] = []

  const lines = Array.isArray(day.description)
    ? day.description
    : typeof day.description === 'string'
      ? day.description.split('\n').filter((l) => l.trim().length > 0)
      : []

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    const lower = trimmed.toLowerCase()

    if (lower.startsWith('highlights of the')) return

    if (
      lower.startsWith('accommodation:') ||
      lower.startsWith('accommodation :') ||
      lower.startsWith('hotel:') ||
      lower.startsWith('hotels:') ||
      lower.startsWith('stay:') ||
      lower.startsWith('stay in') ||
      lower.startsWith('overnight')
    ) {
      return
    }

    if (
      lower.startsWith('meals:') ||
      lower.startsWith('meal:') ||
      lower.startsWith('meals :') ||
      lower === 'meals included' ||
      lower === 'dinner' ||
      lower === 'breakfast'
    ) {
      return
    }

    if (
      lower.startsWith('transfer:') ||
      lower.startsWith('transfer :') ||
      lower.startsWith('transfers:') ||
      lower.startsWith('transfers :') ||
      lower.startsWith('pickup:') ||
      lower.startsWith('drop:') ||
      lower.startsWith('flight:') ||
      lower.startsWith('train:') ||
      lower.includes('airport transfer') ||
      lower.includes('private transfer') ||
      lower.includes('sleeper bus transfer') ||
      lower.includes('overnight train to') ||
      lower.includes('pick you up') ||
      lower.includes('drop off at') ||
      lower.startsWith('drive to') ||
      lower.startsWith('drive from') ||
      lower.startsWith('travel to') ||
      lower.startsWith('scenic drive') ||
      lower.startsWith('scenic mountain drive') ||
      lower.includes('drive towards') ||
      lower.includes('drive back to') ||
      lower.includes('transfer to hotel') ||
      lower.includes('transfer to leh airport') ||
      lower.includes('transfer to airport')
    ) {
      const clean = trimmed.replace(/^(transfer|transfers|pickup|drop|flight|train)\s*:\s*/i, '').trim()
      if (clean && !transfers.includes(clean)) {
        transfers.push(clean)
      }
      return
    }

    const clean = trimmed
      .replace(/^(sightseeing(?:\s*&\s*experiences)?|activities|experiences|activity|experience)\s*:\s*/i, '')
      .trim()

    const isNonSightseeingLogistics =
      lower.startsWith('overnight') ||
      lower.startsWith('hotel check-in') ||
      lower.startsWith('check-in') ||
      lower.startsWith('check in') ||
      lower.startsWith('hotel check-out') ||
      lower.startsWith('check-out') ||
      lower.startsWith('trip briefing') ||
      lower.startsWith('fly to') ||
      lower.startsWith('board flight') ||
      lower.startsWith('board departure flight') ||
      lower.startsWith('arrive at kushok') ||
      lower.startsWith('enjoy morning breakfast') ||
      lower.startsWith('enjoy final breakfast') ||
      lower.startsWith('wake up early')

    if (clean && !isNonSightseeingLogistics && !experiences.includes(clean)) {
      experiences.push(clean)
    }
  })

  if (
    transfers.length === 0 &&
    experiences.length === 0 &&
    typeof day.description === 'string' &&
    day.description.trim()
  ) {
    experiences.push(day.description.trim())
  }

  return { transfers, experiences }
}

function getTripSummaryDetails(trip: typeof trips[0]) {
  if (trip.summaryDetails) {
    return {
      accommodation: trip.summaryDetails.accommodation || [],
      meals: trip.summaryDetails.meals || [],
      transfers: trip.summaryDetails.transfers || [],
      activities: trip.summaryDetails.activities || [],
    }
  }

  const hotelsList: string[] = []
  const transfersList: string[] = []
  const mealsList: string[] = []
  const activitiesList: string[] = []

  if (trip.itinerary && Array.isArray(trip.itinerary)) {
    trip.itinerary.forEach((day) => {
      const summary = parseDayForSummary(day.description)
      summary.hotels.forEach((h) => {
        if (!hotelsList.includes(h)) hotelsList.push(h)
      })
      summary.transfers.forEach((t) => {
        if (!transfersList.includes(t)) transfersList.push(t)
      })
      summary.meals.forEach((m) => {
        if (!mealsList.includes(m)) mealsList.push(m)
      })
      summary.sightseeing.forEach((s) => {
        if (!activitiesList.includes(s)) activitiesList.push(s)
      })
    })
  }

  const accommodation =
    trip.stays && trip.stays.length > 0
      ? trip.stays
      : hotelsList.length > 0
        ? hotelsList
        : trip.staySummary
          ? [trip.staySummary]
          : [`${Math.max(1, trip.duration - 1)} Nights Hotel Accommodation`]

  const meals =
    mealsList.length > 0
      ? mealsList
      : [`${Math.max(1, trip.duration - 1)} Breakfasts included as per plan`]

  const transfers =
    transfersList.length > 0
      ? transfersList
      : ['Airport pick-up, drop-off and all sightseeing transfers in private vehicle']

  const activities =
    trip.highlights && trip.highlights.length > 0 ? trip.highlights : activitiesList

  return { accommodation, meals, transfers, activities }
}

function renderItineraryDescription(
  description: string | string[],
  day?: { day: number; title: string; description: string | string[]; image?: string },
  trip?: any
) {
  const lines = Array.isArray(description)
    ? description
    : typeof description === 'string'
      ? description.split('\n').map((s) => s.trim()).filter(Boolean)
      : []

  const timelinePoints: { text: string; type: 'transfer' | 'experience' | 'activity' }[] = []
  let accommodation: string | null = null
  const meals: string[] = []

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    const lower = trimmed.toLowerCase()

    if (lower.startsWith('highlights of the')) return

    if (
      lower.startsWith('meals:') ||
      lower.startsWith('meal:') ||
      lower.startsWith('meals :') ||
      lower === 'meals included' ||
      lower === 'dinner' ||
      lower === 'breakfast'
    ) {
      const clean = trimmed.replace(/^meals?\s*:\s*/i, '').trim()
      if (clean) {
        if (clean.toLowerCase().includes('breakfast') && !meals.includes('Breakfast'))
          meals.push('Breakfast')
        if (clean.toLowerCase().includes('lunch') && !meals.includes('Lunch'))
          meals.push('Lunch')
        if (clean.toLowerCase().includes('dinner') && !meals.includes('Dinner'))
          meals.push('Dinner')
        if (meals.length === 0) meals.push(clean)
      }
      return
    }

    if (
      lower.startsWith('accommodation:') ||
      lower.startsWith('accommodation :') ||
      lower.startsWith('hotel:') ||
      lower.startsWith('hotels:') ||
      lower.startsWith('stay:') ||
      lower.startsWith('stay in')
    ) {
      const hotel = trimmed
        .replace(/^(accommodation|hotels?|stay)\s*:\s*/i, '')
        .replace(/^[:\s\-\.\,]+/, '')
        .replace(/[.\s]+$/, '')
        .trim()
      if (hotel && !accommodation) {
        accommodation = hotel
      }
      return
    }

    if (
      lower.startsWith('transfer:') ||
      lower.startsWith('transfer :') ||
      lower.startsWith('transfers:') ||
      lower.startsWith('transfers :') ||
      lower.startsWith('pickup:') ||
      lower.startsWith('drop:') ||
      lower.startsWith('flight:') ||
      lower.startsWith('train:')
    ) {
      const clean = trimmed.replace(/^(transfer|transfers|pickup|drop|flight|train)\s*:\s*/i, '').trim()
      if (clean) {
        timelinePoints.push({ text: clean, type: 'transfer' })
      }
      return
    }

    if (
      lower.startsWith('sightseeing:') ||
      lower.startsWith('sightseeing & experiences:') ||
      lower.startsWith('sightseeing & experiences :') ||
      lower.startsWith('activities:') ||
      lower.startsWith('experiences:') ||
      lower.startsWith('activity:') ||
      lower.startsWith('experience:')
    ) {
      const clean = trimmed
        .replace(
          /^(sightseeing(?:\s*&\s*experiences)?|activities|experiences|activity|experience)\s*:\s*/i,
          ''
        )
        .trim()
      if (clean) {
        timelinePoints.push({ text: clean, type: 'experience' })
      }
      return
    }

    if (
      !accommodation &&
      (lower.startsWith('overnight stay') ||
        lower.includes('overnight stay in') ||
        lower.includes('overnight stay at') ||
        lower.includes('overnight stay near'))
    ) {
      const match = trimmed.match(/overnight stay\s+(?:in|at|near|into)?\s+([^.]+)/i)
      if (match && match[1]) {
        accommodation = match[1].trim()
      }
    }

    const clean = trimmed
      .replace(
        /^(transfer|transfers|accommodation|hotels?|sightseeing(?:\s*&\s*experiences)?|activities|experiences|meals?)\s*:\s*/i,
        ''
      )
      .trim()
    if (clean) {
      const isTransferLike =
        lower.includes('pick you up') ||
        lower.includes('airport transfer') ||
        lower.includes('drive to') ||
        lower.includes('proceed to') ||
        lower.includes('travel to')
      timelinePoints.push({ text: clean, type: isTransferLike ? 'transfer' : 'activity' })
    }
  })

  if (timelinePoints.length === 0 && typeof description === 'string' && description.trim()) {
    const sentences = description.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0)
    sentences.forEach((s) => {
      timelinePoints.push({ text: s.trim(), type: 'activity' })
    })
  }

  if (!accommodation && day && trip) {
    const dayNum = day.day || 1
    const duration = trip.duration || trip.itinerary?.length || 1
    if (dayNum < duration) {
      if (trip.stays && Array.isArray(trip.stays) && trip.stays.length > 0) {
        const stayIdx = Math.min(dayNum - 1, trip.stays.length - 1)
        const stayItem = trip.stays[stayIdx]
        if (typeof stayItem === 'string') {
          accommodation = stayItem
        } else if (typeof stayItem === 'object' && stayItem !== null && (stayItem as any).hotel) {
          accommodation = `${(stayItem as any).hotel}${
            (stayItem as any).city ? ` (${(stayItem as any).city})` : ''
          }`
        }
      }
    }
  }

  let dayImage: string | null = day?.image || null
  if (!dayImage && day && trip) {
    const catId =
      trip?.category?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-') || ''
    const customImages = destinationItineraryImages[catId]
    if (customImages && customImages.length > 0) {
      dayImage = customImages[(day.day - 1) % customImages.length]
    } else if (trip?.images && trip.images.length > 0) {
      dayImage = trip.images[(day.day - 1) % trip.images.length]
    } else if (trip?.galleryImages && trip.galleryImages.length > 0) {
      dayImage = trip.galleryImages[(day.day - 1) % trip.galleryImages.length]?.src
    } else if (trip?.image) {
      dayImage = trip.image
    }
  }

  if (timelinePoints.length === 0 && !accommodation) {
    return (
      <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
        {lines.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    )
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden pt-3 pb-1 space-y-3.5">
      {/* Flowchart Timeline (Left) + Horizontal Day Image (Right) */}
      <div className="w-full min-w-0 max-w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="w-full min-w-0 max-w-full space-y-0 relative pl-1 sm:pl-2">
          {timelinePoints.map((item, idx) => {
            const isLast = idx === timelinePoints.length - 1
            return (
              <div
                key={idx}
                className="relative flex items-start gap-2.5 sm:gap-3.5 group min-w-0 w-full max-w-full"
              >
                <div className="flex flex-col items-center self-stretch shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-500 group-hover:bg-[#ff5d09] group-hover:scale-125 transition-all mt-1.5 shrink-0 ring-4 ring-slate-900 group-hover:ring-orange-950/60" />
                  {!isLast && (
                    <div className="w-0.5 grow border-l-2 border-dashed border-slate-700 my-1 group-hover:border-orange-500/80 transition-colors" />
                  )}
                </div>

                <div className={`min-w-0 flex-1 max-w-full ${isLast ? 'pb-1' : 'pb-3.5 sm:pb-4'}`}>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed group-hover:text-amber-300 transition-colors break-words">
                    {item.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {dayImage && (
          <div className="w-full md:w-64 lg:w-72 shrink-0 aspect-[16/10] relative rounded-2xl overflow-hidden shadow-md border border-slate-800 bg-slate-900 group max-w-full">
            <Image
              src={dayImage}
              alt={day?.title || `Day ${day?.day || 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {/* Accommodation Card */}
      {accommodation && (
        <div className="w-full min-w-0 max-w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-sm flex items-center justify-between gap-2.5 sm:gap-3 flex-wrap mt-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 max-w-full">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <img
                src="/images/hotel-icon.png"
                alt="Hotel"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
                Accommodation
              </span>
              <p className="font-bold text-white text-xs sm:text-sm truncate break-words">
                {accommodation}
              </p>
            </div>
          </div>

          {meals.length > 0 && (
            <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-800 text-emerald-300 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shrink-0">
              <Utensils size={12} className="shrink-0 text-emerald-400" />
              <span>Meals: {meals.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const SwipeButton = ({
  onSwipeComplete,
  text = 'Slide to Book',
}: {
  onSwipeComplete: () => void
  text?: string
}) => {
  const [isSwiped, setIsSwiped] = useState(false)
  const [dragX, setDragX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSwiped) return
    isDragging.current = true
    startX.current = e.touches[0].clientX - dragX
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSwiped) return
    isDragging.current = true
    startX.current = e.clientX - dragX
  }

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging.current || !containerRef.current || !thumbRef.current) return
      const containerWidth = containerRef.current.clientWidth
      const thumbWidth = thumbRef.current.clientWidth
      const maxDrag = containerWidth - thumbWidth - 8

      let currentDrag = clientX - startX.current
      if (currentDrag < 0) currentDrag = 0
      if (currentDrag > maxDrag) currentDrag = maxDrag

      setDragX(currentDrag)

      if (currentDrag >= maxDrag * 0.9) {
        setIsSwiped(true)
        isDragging.current = false
        setDragX(maxDrag)
        onSwipeComplete()
        setTimeout(() => {
          setIsSwiped(false)
          setDragX(0)
        }, 3000)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX)
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX)
    }

    const handleEnd = () => {
      if (!isDragging.current) return
      isDragging.current = false
      if (!isSwiped) {
        setDragX(0)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isSwiped, onSwipeComplete])

  return (
    <div
      ref={containerRef}
      className="relative h-14 bg-slate-900 rounded-full p-1 flex items-center justify-start overflow-hidden border border-slate-800 select-none w-full shadow-inner"
    >
      <style>{`
        @keyframes shimmer-festive {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer-festive {
          background-image: linear-gradient(120deg, #64748b 25%, #f59e0b 50%, #64748b 75%);
          background-size: 200% auto;
          animation: shimmer-festive 2s infinite linear;
        }
      `}</style>

      <div
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-25 transition-all duration-75"
        style={{ width: `${dragX + 28}px` }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-amber-300 to-slate-400 bg-[length:200%_auto] animate-shimmer-festive text-center">
          {isSwiped ? 'Redirecting...' : text}
        </span>
      </div>

      <div
        ref={thumbRef}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        style={{ transform: `translateX(${dragX}px)` }}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing z-10 transition-transform duration-75 select-none"
      >
        {isSwiped ? (
          <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <ChevronRight className="w-6 h-6 text-white animate-pulse" />
        )}
      </div>
    </div>
  )
}

interface PageProps {
  params?: Promise<{ slug: string }> | { slug: string }
}

export default function ChristmasNewYearTripDetailPage({ params }: PageProps = {}) {
  type SelectionItem = {
    name: string
    price: number
  }

  const [selections] = useState<SelectionItem[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const clientParams = useParams()

  let resolvedParams: any = null
  if (params) {
    if (params instanceof Promise || typeof (params as any).then === 'function') {
      resolvedParams = use(params as Promise<any>)
    } else {
      resolvedParams = params
    }
  }

  const slug = (resolvedParams?.slug || clientParams?.slug) as string | undefined
  const trip = useMemo(() => (slug ? trips.find((t) => t.slug === slug) : undefined), [slug])

  const lowestPrice = useMemo(() => {
    if (!trip?.costingDetails || trip.costingDetails.length === 0) {
      return trip?.price || 0
    }

    const prices = trip.costingDetails
      .map((item) => {
        const match = item.value.match(/[\d,]+/)
        return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0
      })
      .filter((price) => price > 0)

    return prices.length > 0 ? Math.min(...prices) : trip.price || 0
  }, [trip])

  const [callbackOpen, setCallbackOpen] = useState(false)
  const [expandedDays, setExpandedDays] = useState<number[]>([1])
  const [expandedSummaryDays, setExpandedSummaryDays] = useState<number[]>([1])
  const [activeSummaryDropdown, setActiveSummaryDropdown] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [activeDay, setActiveDay] = useState(1)
  const tabContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Sidebar Callback Form
  const [inquiryPhone, setInquiryPhone] = useState('')
  const [inquiryEmail, setInquiryEmail] = useState('')
  const [inquiryAgreed, setInquiryAgreed] = useState(false)
  const [inquirySubmitting, setInquirySubmitting] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState(false)

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inquiryPhone) return
    setInquirySubmitting(true)
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: inquiryPhone,
          email: inquiryEmail,
          tripTitle: trip?.title,
          tripSlug: trip?.slug,
          price: lowestPrice || trip?.price,
          source: 'Christmas & New Year Itinerary Details',
        }),
      })
      if (res.ok) {
        setInquirySuccess(true)
        setInquiryPhone('')
        setInquiryEmail('')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setInquirySubmitting(false)
    }
  }

  const [notification, setNotification] = useState<string | null>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [downloadPdfModalOpen, setDownloadPdfModalOpen] = useState(false)

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleShare = async () => {
    const shareText = `Check out ${trip?.title} on Wanderphilia.`
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: trip?.title,
          text: shareText,
          url: shareUrl,
        })
        return
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    }

    if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        showNotification('Link copied to clipboard!')
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        if (typeof window !== 'undefined') {
          window.prompt('Copy this link:', shareUrl)
        }
      }
    } else {
      if (typeof window !== 'undefined') {
        window.prompt('Copy this link:', shareUrl)
      }
    }
  }

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return resolve()
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve()
      }
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = () => resolve()
      script.onerror = (err) => reject(err)
      document.body.appendChild(script)
    })
  }

  const handleDownloadPDF = async (options?: {
    selectedMonth?: string
    dateRange?: { from: string; to: string }
    language?: string
  }) => {
    if (isGeneratingPdf || !trip) return
    setIsGeneratingPdf(true)
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      const globalWindow = window as any
      if (!globalWindow.jspdf || !globalWindow.jspdf.jsPDF) {
        throw new Error('jsPDF UMD global not found')
      }
      const jsPDFClass = globalWindow.jspdf.jsPDF
      const { generateItineraryPDF } = await import('@/lib/pdf-generator')
      await generateItineraryPDF(trip, jsPDFClass, options)
      showNotification('Itinerary PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      showNotification('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleBookNow = () => {
    if (!slug) return
    router.push(`/booking/package/${encodeURIComponent(slug)}`)
  }

  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [activeInclCat, setActiveInclCat] = useState('inclusions')

  useEffect(() => {
    if (!trip) return
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery')
        if (response.ok) {
          const data = await response.json()
          const filtered = data.filter((img: any) => img.category === trip?.category?.toLowerCase())
          setGalleryImages(filtered.map((item: any) => item.image))
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchGallery()
  }, [trip])

  const heroMedia = useMemo(() => {
    if (!trip) return []
    return trip.heroMedia || [{ type: 'image' as const, src: trip.image, alt: trip.title }]
  }, [trip])

  const collageImages = useMemo(() => {
    if (!trip) return []

    const catId =
      trip.category?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-') || ''
    const customImages = destinationItineraryImages[catId]

    if (customImages && customImages.length >= 4) {
      const mainImg = heroMedia[0] || { type: 'image' as const, src: trip.image, alt: trip.title }
      return [
        mainImg,
        { type: 'image' as const, src: customImages[0], alt: `${trip.title} gallery 2` },
        { type: 'image' as const, src: customImages[1], alt: `${trip.title} gallery 3` },
        { type: 'image' as const, src: customImages[2], alt: `${trip.title} gallery 4` },
        { type: 'image' as const, src: customImages[3], alt: `${trip.title} gallery 5` },
      ]
    }

    const list = [...heroMedia]

    if (trip.images && trip.images.length > 0) {
      trip.images.forEach((img: string) => {
        if (!list.some((item) => item.src === img)) {
          list.push({ type: 'image' as const, src: img, alt: trip.title })
        }
      })
    }

    if (galleryImages.length > 0) {
      galleryImages.forEach((img: string) => {
        if (!list.some((item) => item.src === img)) {
          list.push({ type: 'image' as const, src: img, alt: trip.title })
        }
      })
    }

    const fallbacks = [trip.image]
    for (const src of fallbacks) {
      if (list.length >= 5) break
      if (!list.some((item) => item.src === src)) {
        list.push({ type: 'image' as const, src, alt: `${trip.title} gallery ${list.length + 1}` })
      }
    }

    while (list.length < 5) {
      list.push({
        type: 'image' as const,
        src: trip.image,
        alt: `${trip.title} gallery ${list.length + 1}`,
      })
    }
    return list.slice(0, 5)
  }, [heroMedia, trip, galleryImages])

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.classList.add('lightbox-open')
    } else {
      document.body.classList.remove('lightbox-open')
    }
    return () => {
      document.body.classList.remove('lightbox-open')
    }
  }, [lightboxIndex])

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    )
  }

  const toggleSummaryDay = (dayNum: number) => {
    setExpandedSummaryDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    )
  }

  const handleDayClick = (dayNum: number) => {
    if (!expandedDays.includes(dayNum)) {
      setExpandedDays((prev) => [...prev, dayNum])
    }
    setActiveDay(dayNum)

    const el = document.getElementById(`itinerary-day-${dayNum}`)
    if (el) {
      const navbarHeight = 140
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    if (activeTab !== 'itinerary') return
    if (typeof window === 'undefined' || !trip?.itinerary) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const dayNum = parseInt(entry.target.id.replace('itinerary-day-', ''), 10)
            if (!isNaN(dayNum)) {
              setActiveDay(dayNum)
            }
          }
        })
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0.1, 0.5, 0.9],
      }
    )

    trip.itinerary.forEach((day) => {
      const el = document.getElementById(`itinerary-day-${day.day}`)
      if (el) {
        observer.observe(el)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [activeTab, trip?.itinerary])

  if (!slug) return null
  if (!trip) return notFound()

  const staySummary =
    trip.route || trip.staySummary || trip.customRoute || getStaySummary(trip.itinerary)

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-primary selection:text-white">
      {/* Ambient Winter Snowfall */}
      <ChristmasSnowfall density={40} />

      <Navbar forceWhiteDesktop={false} />

      {/* STICKY FLOATING TOP-RIGHT ACTION BUTTONS: WHATSAPP, SHARE & DOWNLOAD PDF (MOBILE ONLY) */}
      <div className="fixed top-25 right-6 z-50 flex md:hidden items-center gap-1.5">
        <a
          href={`https://wa.me/919217664099?text=${encodeURIComponent(
            `Hi! I am interested in ${trip.title} (Christmas & New Year Special). Please share more details.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          className="w-9 h-9 rounded-full bg-slate-900/90 backdrop-blur-md shadow-md hover:shadow-lg border border-slate-700/80 flex items-center justify-center transition-all cursor-pointer active:scale-95 hover:border-emerald-400 text-[#25D366] hover:text-emerald-400"
        >
          <RiWhatsappLine size={20} />
        </a>
        <button
          type="button"
          onClick={handleShare}
          title="Share Trip"
          className="w-9 h-9 rounded-full bg-slate-900/90 backdrop-blur-md shadow-md hover:shadow-lg border border-slate-700/80 text-slate-200 hover:text-amber-400 hover:border-amber-400 flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <Share2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => setDownloadPdfModalOpen(true)}
          disabled={isGeneratingPdf}
          title="Download Itinerary PDF"
          className="w-9 h-9 rounded-full bg-slate-900/90 backdrop-blur-md shadow-md hover:shadow-lg border border-slate-700/80 text-slate-200 hover:text-amber-400 hover:border-amber-400 flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-60"
        >
          {isGeneratingPdf ? (
            <svg className="w-4 h-4 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <Download size={16} />
          )}
        </button>
      </div>

      <main className="grow">
        {/* ================= HERO IMAGE / COLLAGE SECTION ================= */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pt-24">
          {/* Back to Christmas & New Year link */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <Link
              href="/christmas-new-year"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-300 hover:text-amber-200 transition-colors font-semibold"
            >
              <ArrowLeft size={16} /> Back to Christmas & New Year Trips
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-primary/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-xs">
              <Sparkles size={13} className="text-amber-300" />
              <span>Holiday Special</span>
            </div>
          </div>

          {(() => {
            const catId =
              trip?.category?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-') || ''
            const customImages = destinationItineraryImages[catId]
            const hasCustomMappedGallery = customImages && customImages.length >= 4

            const hasRealGallery =
              hasCustomMappedGallery ||
              (trip.heroMedia && trip.heroMedia.length > 1) ||
              (trip.images && trip.images.length > 0) ||
              galleryImages.length > 0

            if (!hasRealGallery) {
              /* SINGLE IMAGE */
              return (
                <div
                  className="relative w-full h-64 sm:h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-lg border border-slate-800 cursor-pointer group bg-slate-900"
                  onClick={() => setLightboxIndex(0)}
                >
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </div>
              )
            }

            /* 5-IMAGE COLLAGE */
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-64 sm:h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900">
                {/* Image 1 (Left - Large) */}
                <div
                  onClick={() => setLightboxIndex(0)}
                  className="col-span-1 md:col-span-2 md:row-span-2 relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={collageImages[0].src}
                    alt={collageImages[0].alt || trip.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    priority
                  />
                </div>

                {/* Image 2 (Top Middle) */}
                <div
                  onClick={() => setLightboxIndex(1)}
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={collageImages[1].src}
                    alt={collageImages[1].alt || 'Gallery 2'}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>

                {/* Image 3 (Top Right) */}
                <div
                  onClick={() => setLightboxIndex(2)}
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={collageImages[2].src}
                    alt={collageImages[2].alt || 'Gallery 3'}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>

                {/* Image 4 (Bottom Middle) */}
                <div
                  onClick={() => setLightboxIndex(3)}
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={collageImages[3].src}
                    alt={collageImages[3].alt || 'Gallery 4'}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>

                {/* Image 5 (Bottom Right) */}
                <div
                  onClick={() => setLightboxIndex(4)}
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={collageImages[4].src}
                    alt={collageImages[4].alt || 'Gallery 5'}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>
              </div>
            )
          })()}
        </div>

        {/* ================= MAIN CONTENT SECTION ================= */}
        <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-0 py-4 sm:py-6">
          <div className="grid lg:grid-cols-[2.5fr_1fr] gap-5 sm:gap-6 lg:gap-8">
            {/* LEFT CONTENT */}
            <div className="space-y-4 sm:space-y-5 min-w-0 w-full overflow-hidden">
              {/* HEADER SECTION */}
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
                  {trip.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 text-slate-300 mb-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin size={15} className="shrink-0 text-amber-400" />
                    <span>{trip.destination}</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={15} className="shrink-0 text-amber-400" />
                    <span>
                      {trip.nights ? `${trip.nights}N / ${trip.duration}D` : `${trip.duration}D`}
                    </span>
                  </div>
                </div>

                {/* Stay Summary / Route */}
                {staySummary && (
                  <p className="text-[11px] sm:text-xs font-semibold text-amber-300 mb-2.5 uppercase tracking-wider bg-amber-500/10 w-fit px-3 py-1 rounded-md border border-amber-500/30 shadow-xs">
                    {staySummary.replace(/\s*[-•]\s*/g, ' • ')}
                  </p>
                )}
              </div>

              {/* STICKY TAB NAVBAR */}
              <div className="sticky top-20 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
                <div className="flex items-center justify-between w-full">
                  <div
                    ref={tabContainerRef}
                    className="flex overflow-x-auto gap-2 sm:gap-4 py-0 scrollbar-hide pr-32 md:pr-0"
                  >
                    {[
                      { id: 'summary', label: 'Summary' },
                      { id: 'itinerary', label: 'Itinerary' },
                      { id: 'highlights', label: 'Activities & Experiences' },
                      { id: 'inclusions', label: 'Inclusions & Exclusions' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        data-tab-id={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-2.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                          activeTab === tab.id
                            ? 'border-[#ff5d09] text-amber-400 font-bold'
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="hidden md:flex items-center gap-1 sm:gap-2 pr-2 sm:pr-4 shrink-0">
                    <a
                      href={`https://wa.me/919217664099?text=${encodeURIComponent(
                        `Hi! I am interested in ${trip.title} (Christmas & New Year Special). Please share more details.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 hover:bg-emerald-950/40 rounded-md transition-colors"
                    >
                      <RiWhatsappLine size={17} className="text-[#25D366]" />
                      <span className="hidden md:inline">WhatsApp</span>
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-white hover:bg-slate-800 font-semibold flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm px-2 sm:px-3"
                      onClick={handleShare}
                    >
                      <Share2 size={16} />
                      <span className="hidden md:inline">Share</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isGeneratingPdf}
                      className="text-slate-300 hover:text-white hover:bg-slate-800 font-semibold flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-50"
                      onClick={() => setDownloadPdfModalOpen(true)}
                    >
                      {isGeneratingPdf ? (
                        <svg className="w-4 h-4 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                      ) : (
                        <Download size={16} />
                      )}
                      <span className="hidden md:inline">
                        {isGeneratingPdf ? 'Downloading...' : 'Download'}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* ================= TABS CONTENT ================= */}

              {/* TAB 1: SUMMARY */}
              {activeTab === 'summary' &&
                (() => {
                  const summaryOverview = getTripSummaryDetails(trip)

                  const activitiesCount = (() => {
                    if (
                      trip.inclusionsSummary?.experiences &&
                      typeof trip.inclusionsSummary.experiences === 'number'
                    ) {
                      return trip.inclusionsSummary.experiences
                    }
                    if (summaryOverview.activities && summaryOverview.activities.length > 0) {
                      if (
                        typeof summaryOverview.activities[0] === 'object' &&
                        'items' in (summaryOverview.activities[0] as any)
                      ) {
                        return (summaryOverview.activities as any[]).reduce(
                          (sum, g) => sum + (g.items?.length || 0),
                          0
                        )
                      }
                      return summaryOverview.activities.length
                    }
                    return trip.highlights?.length || 0
                  })()

                  const transfersCount = (() => {
                    if (
                      trip.inclusionsSummary?.transfers &&
                      typeof trip.inclusionsSummary.transfers === 'number'
                    ) {
                      return trip.inclusionsSummary.transfers
                    }
                    if (trip.itinerary && Array.isArray(trip.itinerary)) {
                      const dayTransfers = trip.itinerary.reduce(
                        (sum, day) => sum + parseDayItinerarySummary(day).transfers.length,
                        0
                      )
                      if (dayTransfers > 0) return dayTransfers
                    }
                    return summaryOverview.transfers.length || 0
                  })()

                  const hotelsCount = (() => {
                    if (
                      trip.inclusionsSummary?.hotels &&
                      typeof trip.inclusionsSummary.hotels === 'number'
                    ) {
                      return trip.inclusionsSummary.hotels
                    }
                    return (
                      summaryOverview.accommodation.length ||
                      (trip.stays ? trip.stays.length : 0) ||
                      1
                    )
                  })()

                  const mealsCount = (() => {
                    if (
                      trip.inclusionsSummary?.meals &&
                      typeof trip.inclusionsSummary.meals === 'number'
                    ) {
                      return trip.inclusionsSummary.meals
                    }
                    if (summaryOverview.meals && summaryOverview.meals.length > 0) {
                      const mealNum = summaryOverview.meals[0].match(/\d+/)
                      if (mealNum) return parseInt(mealNum[0], 10)
                      return summaryOverview.meals.length
                    }
                    return Math.max(1, trip.duration - 1)
                  })()

                  return (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      {trip.itinerary && trip.itinerary.length > 0 && (
                        <div className="space-y-3">
                          {/* 4 QUICK COUNT BUTTONS */}
                          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pb-2 border-b border-slate-800">
                            {/* Activities */}
                            <button
                              type="button"
                              onClick={() =>
                                setActiveSummaryDropdown((prev) =>
                                  prev === 'activities' ? null : 'activities'
                                )
                              }
                              className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                                activeSummaryDropdown === 'activities'
                                  ? 'bg-[#ff5d09] text-white border border-[#ff5d09]'
                                  : 'bg-slate-900 text-slate-200 border border-slate-800 hover:border-amber-400/60 hover:text-amber-300'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Sparkles
                                  size={13}
                                  className={`shrink-0 ${
                                    activeSummaryDropdown === 'activities'
                                      ? 'text-white'
                                      : 'text-[#ff5d09]'
                                  }`}
                                />
                                <span className="truncate">{activitiesCount} Activities</span>
                              </div>
                              <ChevronDown
                                size={11}
                                className={`shrink-0 transition-transform duration-200 ${
                                  activeSummaryDropdown === 'activities' ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {/* Transfers */}
                            <button
                              type="button"
                              onClick={() =>
                                setActiveSummaryDropdown((prev) =>
                                  prev === 'transfers' ? null : 'transfers'
                                )
                              }
                              className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                                activeSummaryDropdown === 'transfers'
                                  ? 'bg-blue-600 text-white border border-blue-600'
                                  : 'bg-slate-900 text-slate-200 border border-slate-800 hover:border-blue-400/60 hover:text-blue-300'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Car
                                  size={13}
                                  className={`shrink-0 ${
                                    activeSummaryDropdown === 'transfers'
                                      ? 'text-white'
                                      : 'text-blue-400'
                                  }`}
                                />
                                <span className="truncate">{transfersCount} Transfers</span>
                              </div>
                              <ChevronDown
                                size={11}
                                className={`shrink-0 transition-transform duration-200 ${
                                  activeSummaryDropdown === 'transfers' ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {/* Meals */}
                            <button
                              type="button"
                              onClick={() =>
                                setActiveSummaryDropdown((prev) =>
                                  prev === 'meals' ? null : 'meals'
                                )
                              }
                              className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                                activeSummaryDropdown === 'meals'
                                  ? 'bg-emerald-600 text-white border border-emerald-600'
                                  : 'bg-slate-900 text-slate-200 border border-slate-800 hover:border-emerald-400/60 hover:text-emerald-300'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Utensils
                                  size={13}
                                  className={`shrink-0 ${
                                    activeSummaryDropdown === 'meals'
                                      ? 'text-white'
                                      : 'text-emerald-400'
                                  }`}
                                />
                                <span className="truncate">{mealsCount} Meals</span>
                              </div>
                              <ChevronDown
                                size={11}
                                className={`shrink-0 transition-transform duration-200 ${
                                  activeSummaryDropdown === 'meals' ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {/* Hotels */}
                            <button
                              type="button"
                              onClick={() =>
                                setActiveSummaryDropdown((prev) =>
                                  prev === 'hotels' ? null : 'hotels'
                                )
                              }
                              className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                                activeSummaryDropdown === 'hotels'
                                  ? 'bg-indigo-600 text-white border border-indigo-600'
                                  : 'bg-slate-900 text-slate-200 border border-slate-800 hover:border-indigo-400/60 hover:text-indigo-300'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Hotel
                                  size={13}
                                  className={`shrink-0 ${
                                    activeSummaryDropdown === 'hotels'
                                      ? 'text-white'
                                      : 'text-indigo-400'
                                  }`}
                                />
                                <span className="truncate">{hotelsCount} Hotels</span>
                              </div>
                              <ChevronDown
                                size={11}
                                className={`shrink-0 transition-transform duration-200 ${
                                  activeSummaryDropdown === 'hotels' ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          </div>

                          {/* DROPDOWN POPUP PANEL */}
                          {activeSummaryDropdown && (
                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3 animate-in fade-in duration-200">
                              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                  {activeSummaryDropdown === 'activities' && (
                                    <>
                                      <Sparkles size={16} className="text-[#ff5d09]" />
                                      <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wide">
                                        Activities & Experiences ({activitiesCount})
                                      </h4>
                                    </>
                                  )}
                                  {activeSummaryDropdown === 'transfers' && (
                                    <>
                                      <Car size={16} className="text-blue-400" />
                                      <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wide">
                                        Transfers & Transit ({transfersCount})
                                      </h4>
                                    </>
                                  )}
                                  {activeSummaryDropdown === 'meals' && (
                                    <>
                                      <Utensils size={16} className="text-emerald-400" />
                                      <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wide">
                                        Meal Inclusions ({mealsCount})
                                      </h4>
                                    </>
                                  )}
                                  {activeSummaryDropdown === 'hotels' && (
                                    <>
                                      <Hotel size={16} className="text-indigo-400" />
                                      <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase tracking-wide">
                                        Hotel Accommodations ({hotelsCount})
                                      </h4>
                                    </>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setActiveSummaryDropdown(null)}
                                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                  <X size={15} />
                                </button>
                              </div>

                              {activeSummaryDropdown === 'activities' && (
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                  {summaryOverview.activities.length > 0 &&
                                  typeof summaryOverview.activities[0] === 'object' &&
                                  'items' in (summaryOverview.activities[0] as any) ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {(summaryOverview.activities as any[]).map((group, gIdx) => (
                                        <div
                                          key={gIdx}
                                          className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1"
                                        >
                                          {group.city && (
                                            <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[11px] uppercase tracking-wider pb-1 border-b border-slate-800">
                                              <MapPin size={11} />
                                              <span>{group.city}</span>
                                            </div>
                                          )}
                                          <ul className="space-y-1">
                                            {group.items.map((it: string, itIdx: number) => (
                                              <li
                                                key={itIdx}
                                                className="flex items-start gap-1.5 text-xs text-slate-300"
                                              >
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                                <span>{it}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {(summaryOverview.activities as string[]).map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-2 p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                          <span>{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {activeSummaryDropdown === 'transfers' && (
                                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                  {summaryOverview.transfers.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-2 p-2.5 bg-blue-950/30 border border-blue-900/40 rounded-xl text-xs text-slate-200"
                                    >
                                      <Car size={13} className="text-blue-400 shrink-0 mt-0.5" />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {activeSummaryDropdown === 'meals' && (
                                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                  {summaryOverview.meals.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 p-2.5 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-xs text-slate-200"
                                    >
                                      <Utensils size={13} className="text-emerald-400 shrink-0" />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {activeSummaryDropdown === 'hotels' && (
                                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                  {summaryOverview.accommodation.map((item, idx) => {
                                    const isObj = typeof item === 'object' && item !== null
                                    const city = isObj ? (item as any).city : ''
                                    const hotel = isObj ? (item as any).hotel : item
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between gap-2 p-2.5 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-xs text-slate-200"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <Hotel size={13} className="text-indigo-400 shrink-0" />
                                          {city && (
                                            <span className="font-extrabold text-amber-300 uppercase text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
                                              {city}
                                            </span>
                                          )}
                                          <span className="font-semibold text-white truncate">
                                            {hotel}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* DAY-WISE OVERVIEW ACCORDIONS */}
                          {trip.itinerary.map((day) => {
                            const dayData = parseDayItinerarySummary(day)
                            const isDayOpen = expandedSummaryDays.includes(day.day)
                            return (
                              <div
                                key={day.day}
                                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all"
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleSummaryDay(day.day)}
                                  className="w-full flex items-center justify-between gap-2.5 px-3.5 py-3 bg-slate-900/90 hover:bg-slate-850 transition-colors text-left cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="shrink-0 px-2 py-0.5 rounded bg-gradient-to-r from-orange-600 to-amber-500 text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider">
                                      Day {day.day}
                                    </span>
                                    <span className="font-bold text-white text-xs sm:text-sm leading-snug truncate">
                                      {day.title}
                                    </span>
                                  </div>
                                  <ChevronDown
                                    size={15}
                                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                                      isDayOpen ? 'rotate-180 text-amber-400' : ''
                                    }`}
                                  />
                                </button>

                                {isDayOpen && (
                                  <div className="p-3.5 bg-slate-950/60 space-y-3 border-t border-slate-800">
                                    {dayData.transfers.length > 0 && (
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-blue-400 font-extrabold text-[11px] uppercase tracking-wider">
                                          <Car size={13} className="shrink-0" />
                                          <span>Transfers</span>
                                        </div>
                                        <div className="bg-blue-950/20 rounded-xl p-3 border border-blue-900/40 space-y-0 relative pl-2.5">
                                          {dayData.transfers.map((t, tIdx) => {
                                            const isLast = tIdx === dayData.transfers.length - 1
                                            return (
                                              <div key={tIdx} className="relative flex items-start gap-2.5 group">
                                                <div className="flex flex-col items-center self-stretch shrink-0">
                                                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0 ring-2 ring-blue-950" />
                                                  {!isLast && (
                                                    <div className="w-0.5 grow border-l border-dashed border-blue-700/60 my-0.5" />
                                                  )}
                                                </div>
                                                <div className={`min-w-0 flex-1 ${isLast ? 'pb-0' : 'pb-2'}`}>
                                                  <p className="text-xs text-slate-300 font-medium leading-relaxed break-words">
                                                    {t}
                                                  </p>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    {dayData.experiences.length > 0 && (
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[11px] uppercase tracking-wider">
                                          <Sparkles size={13} className="shrink-0" />
                                          <span>Sightseeing & Experiences</span>
                                        </div>
                                        <div className="bg-amber-950/20 rounded-xl p-3 border border-amber-900/40 space-y-0 relative pl-2.5">
                                          {dayData.experiences.map((exp, eIdx) => {
                                            const isLast = eIdx === dayData.experiences.length - 1
                                            return (
                                              <div key={eIdx} className="relative flex items-start gap-2.5 group">
                                                <div className="flex flex-col items-center self-stretch shrink-0">
                                                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0 ring-2 ring-amber-950" />
                                                  {!isLast && (
                                                    <div className="w-0.5 grow border-l border-dashed border-amber-700/60 my-0.5" />
                                                  )}
                                                </div>
                                                <div className={`min-w-0 flex-1 ${isLast ? 'pb-0' : 'pb-2'}`}>
                                                  <p className="text-xs text-slate-300 font-medium leading-relaxed break-words">
                                                    {exp}
                                                  </p>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* INCLUSIONS & EXCLUSIONS SIDE BY SIDE */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
                        {/* Inclusions */}
                        <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-2xl overflow-hidden shadow-lg flex flex-col">
                          <div className="flex items-center justify-between px-4 py-3 bg-emerald-950/60 border-b border-emerald-900/60 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                            <div className="flex items-center gap-2 text-emerald-300">
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                                <Check size={12} strokeWidth={3} />
                              </div>
                              <span>Inclusions</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full">
                              {trip.included?.length || 0} Included
                            </span>
                          </div>
                          <div className="p-4 space-y-2.5 flex-1 bg-slate-900">
                            {trip.included && trip.included.length > 0 ? (
                              trip.included.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed"
                                >
                                  <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                                    ✓
                                  </span>
                                  <span className="font-medium text-slate-200">{item}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500 italic">No inclusions listed.</p>
                            )}
                          </div>
                        </div>

                        {/* Exclusions */}
                        <div className="bg-slate-900 border-2 border-rose-500/60 rounded-2xl overflow-hidden shadow-lg flex flex-col">
                          <div className="flex items-center justify-between px-4 py-3 bg-rose-950/60 border-b border-rose-900/60 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                            <div className="flex items-center gap-2 text-rose-300">
                              <div className="w-5 h-5 rounded-full bg-rose-500 text-slate-950 flex items-center justify-center shrink-0">
                                <X size={12} strokeWidth={3} />
                              </div>
                              <span>Exclusions</span>
                            </div>
                            <span className="text-[11px] font-bold text-rose-300 bg-rose-900/80 px-2.5 py-0.5 rounded-full">
                              {trip.notIncluded?.length || 0} Excluded
                            </span>
                          </div>
                          <div className="p-4 space-y-2.5 flex-1 bg-slate-900">
                            {trip.notIncluded && trip.notIncluded.length > 0 ? (
                              trip.notIncluded.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed"
                                >
                                  <span className="w-4 h-4 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                                    ✕
                                  </span>
                                  <span className="font-medium text-slate-200">{item}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500 italic">No exclusions listed.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}

              {/* TAB 2: DETAILED DAY-WISE ITINERARY */}
              {activeTab === 'itinerary' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-white mb-4">Detailed Day-wise Itinerary</h2>

                  <div className="flex gap-5 items-start">
                    {/* Left Sticky Vertical Menu */}
                    <div className="hidden md:block w-32 shrink-0 sticky top-36 self-start space-y-1.5 pr-2.5 border-r border-slate-800">
                      {trip.itinerary.map((day) => (
                        <button
                          key={day.day}
                          onClick={() => handleDayClick(day.day)}
                          className={`w-full text-left py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                            activeDay === day.day
                              ? 'bg-amber-500/20 text-amber-300 border-l-4 border-[#ff5d09] pl-2'
                              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          Day {day.day}
                        </button>
                      ))}
                    </div>

                    {/* Right Accordion Cards */}
                    <div className="grow min-w-0 w-full max-w-full space-y-3.5 relative pl-0 border-l border-slate-800 border-dashed md:border-0 md:pl-0 overflow-hidden">
                      {Array.isArray(trip.itinerary) && trip.itinerary.length > 0 ? (
                        trip.itinerary.map((day) => (
                          <div
                            key={day.day}
                            id={`itinerary-day-${day.day}`}
                            className={`border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 bg-slate-900 min-w-0 w-full max-w-full ${
                              activeDay === day.day
                                ? 'border-amber-500/50 shadow-amber-950/30'
                                : 'border-slate-800'
                            }`}
                          >
                            <button
                              onClick={() => toggleDay(day.day)}
                              className="w-full flex items-start justify-between p-3.5 sm:p-5 bg-slate-900 hover:bg-slate-850 transition-colors text-left"
                            >
                              <div className="flex items-start gap-2.5 sm:gap-3.5 grow min-w-0">
                                <div className="shrink-0 mt-0.5">
                                  <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5">
                                    Day {day.day}
                                  </Badge>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-sm sm:text-base text-white break-words">
                                    {day.title}
                                  </h3>
                                  {!expandedDays.includes(day.day) && (
                                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-medium">
                                      {getFirstNarrativeParagraph(day.description)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <ChevronDown
                                size={18}
                                className={`shrink-0 ml-2 mt-1 text-slate-400 transition-transform ${
                                  expandedDays.includes(day.day) ? 'rotate-180 text-amber-400' : ''
                                }`}
                              />
                            </button>

                            {expandedDays.includes(day.day) && (
                              <div className="px-3 sm:px-5 pb-3.5 sm:pb-5 bg-slate-900 border-t border-slate-800 min-w-0 w-full max-w-full overflow-hidden">
                                {renderItineraryDescription(day.description, day, trip)}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-slate-400">
                          Itinerary details will be available shortly.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVITIES & EXPERIENCES */}
              {activeTab === 'highlights' &&
                (() => {
                  const summaryOverview = getTripSummaryDetails(trip)
                  return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="rounded-2xl overflow-hidden border-2 border-[#ff5d09] bg-slate-900 shadow-xl">
                        <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-900 text-white font-extrabold text-sm uppercase tracking-wider border-b border-orange-500/30">
                          <Sparkles size={18} className="text-[#ff5d09]" />
                          <span>Activities & Experiences</span>
                        </div>

                        <div className="p-4 sm:p-6 bg-slate-950/60">
                          {summaryOverview.activities.length > 0 &&
                          typeof summaryOverview.activities[0] === 'object' &&
                          'items' in (summaryOverview.activities[0] as any) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                              {(summaryOverview.activities as any[]).map((group, gIdx) => (
                                <div
                                  key={gIdx}
                                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-sm hover:border-amber-500/40 transition-all flex flex-col"
                                >
                                  {group.city && (
                                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800 text-amber-400 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                                      <MapPin size={16} className="text-amber-400 shrink-0" />
                                      <span>{group.city}</span>
                                    </div>
                                  )}
                                  <ul className="space-y-2.5 flex-1">
                                    {group.items.map((it: string, itIdx: number) => (
                                      <li
                                        key={itIdx}
                                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                        <span className="font-medium text-slate-200">{it}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                              {(summaryOverview.activities as string[]).map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm hover:border-amber-500/40 transition-colors"
                                >
                                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                  <span className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}

              {/* TAB 4: INCLUSIONS & EXCLUSIONS */}
              {activeTab === 'inclusions' &&
                (() => {
                  const inclCategories = [
                    { id: 'inclusions', label: 'Inclusions', icon: '✓' },
                    { id: 'hotels', label: 'Hotels', icon: '🏨' },
                    { id: 'sightseeing', label: 'Sightseeing', icon: '📸' },
                    { id: 'meals', label: 'Meals', icon: '🍽️' },
                    { id: 'transfer', label: 'Transfer', icon: '🚗' },
                    { id: 'exclusions', label: 'Exclusions', icon: '✕' },
                    { id: 'payment', label: 'Payment Policy', icon: '💳' },
                    { id: 'cancellation', label: 'Cancellation Policy', icon: '📝' },
                  ]

                  function categorise(items: string[]) {
                    const r: Record<string, string[]> = {
                      hotels: [],
                      sightseeing: [],
                      meals: [],
                      transfer: [],
                    }
                    items.forEach((item) => {
                      const l = item.toLowerCase()
                      if (
                        l.includes('stay') ||
                        l.includes('hotel') ||
                        l.includes('camp') ||
                        l.includes('resort') ||
                        l.includes('accommodation') ||
                        l.includes('night')
                      ) {
                        r.hotels.push(item)
                      }
                      if (
                        l.includes('sightseeing') ||
                        l.includes('visit') ||
                        l.includes('tour') ||
                        l.includes('excursion') ||
                        l.includes('trek') ||
                        l.includes('safari') ||
                        l.includes('entry') ||
                        l.includes('permit') ||
                        l.includes('guide') ||
                        l.includes('cable car') ||
                        l.includes('ride') ||
                        l.includes('bridge') ||
                        l.includes('cave') ||
                        l.includes('trail') ||
                        l.includes('shooting') ||
                        l.includes('boattrip') ||
                        l.includes('boat')
                      ) {
                        r.sightseeing.push(item)
                      }
                      if (
                        l.includes('meal') ||
                        l.includes('breakfast') ||
                        l.includes('lunch') ||
                        l.includes('dinner') ||
                        l.includes('food') ||
                        l.includes('beverage') ||
                        l.includes('water') ||
                        l.includes('tea') ||
                        l.includes('coffee')
                      ) {
                        r.meals.push(item)
                      }
                      if (
                        l.includes('transfer') ||
                        l.includes('cab') ||
                        l.includes('transport') ||
                        l.includes('vehicle') ||
                        l.includes('driver') ||
                        l.includes('pick') ||
                        l.includes('drop') ||
                        l.includes('taxi') ||
                        l.includes('bus') ||
                        l.includes('flight') ||
                        l.includes('train') ||
                        l.includes('airport') ||
                        l.includes('minibus')
                      ) {
                        r.transfer.push(item)
                      }
                    })
                    return r
                  }

                  const incl = categorise(trip.included)
                  const excl = categorise(trip.notIncluded)
                  const curIncl = (() => {
                    const list = [...(incl[activeInclCat] || [])]
                    if (
                      activeInclCat === 'meals' &&
                      trip.summaryDetails?.meals &&
                      trip.summaryDetails.meals.length > 0
                    ) {
                      trip.summaryDetails.meals.forEach((m: string) => {
                        if (!list.some((existing) => existing.toLowerCase().includes(m.toLowerCase()))) {
                          list.unshift(m)
                        }
                      })
                    }
                    return list
                  })()
                  const curExcl = excl[activeInclCat] || []
                  const activeMeta = inclCategories.find((c) => c.id === activeInclCat)

                  return (
                    <div className="animate-in fade-in duration-300 w-full min-w-0">
                      <div className="flex gap-0 md:gap-6 items-start flex-col md:flex-row w-full min-w-0">
                        {/* LEFT: Category Nav (Desktop) */}
                        <div className="hidden md:flex flex-col w-40 shrink-0 sticky top-36 self-start border-r border-slate-800">
                          {inclCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setActiveInclCat(cat.id)}
                              className={`w-full text-left px-4 py-2.5 text-sm font-semibold border-l-2 transition-all cursor-pointer ${
                                activeInclCat === cat.id
                                  ? 'border-[#ff5d09] text-amber-300 bg-amber-500/10'
                                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>

                        {/* Mobile Accordions */}
                        <div className="block md:hidden space-y-3 w-full min-w-0">
                          {inclCategories.map((cat) => {
                            const isExpanded = activeInclCat === cat.id
                            const curCatIncl = (() => {
                              const list = [...(incl[cat.id] || [])]
                              if (
                                cat.id === 'meals' &&
                                trip.summaryDetails?.meals &&
                                trip.summaryDetails.meals.length > 0
                              ) {
                                trip.summaryDetails.meals.forEach((m: string) => {
                                  if (!list.some((existing) => existing.toLowerCase().includes(m.toLowerCase()))) {
                                    list.unshift(m)
                                  }
                                })
                              }
                              return list
                            })()

                            return (
                              <div
                                key={cat.id}
                                className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 shadow-sm"
                              >
                                <button
                                  onClick={() => setActiveInclCat(activeInclCat === cat.id ? '' : cat.id)}
                                  className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-sm text-white bg-slate-850 hover:bg-slate-800 transition-colors"
                                >
                                  <span className="flex items-center gap-2.5">
                                    <span className="text-base shrink-0 font-bold">{cat.icon}</span>
                                    <span>{cat.label}</span>
                                  </span>
                                  <ChevronDown
                                    size={18}
                                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                                      isExpanded ? 'rotate-180 text-amber-400' : ''
                                    }`}
                                  />
                                </button>

                                {isExpanded && (
                                  <div className="px-5 py-4 space-y-3 border-t border-slate-800 bg-slate-900">
                                    {cat.id === 'inclusions' ? (
                                      trip.included && trip.included.length > 0 ? (
                                        trip.included.map((item, i) => (
                                          <div
                                            key={i}
                                            className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                          >
                                            <span className="text-emerald-400 font-bold shrink-0 mt-0.5">
                                              ✓
                                            </span>
                                            <span>{item}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-sm text-slate-500 italic">No inclusions listed.</p>
                                      )
                                    ) : cat.id === 'hotels' ? (
                                      trip.stays && trip.stays.length > 0 ? (
                                        trip.stays.map((stay, i) => (
                                          <div
                                            key={i}
                                            className="flex gap-2.5 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                          >
                                            <span className="text-indigo-400 shrink-0 mt-0.5">🏨</span>
                                            <span className="font-semibold text-white">{stay}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-sm text-slate-500 italic">
                                          Hotel details will be available shortly.
                                        </p>
                                      )
                                    ) : cat.id === 'exclusions' ? (
                                      trip.notIncluded.map((item, i) => (
                                        <div
                                          key={i}
                                          className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                        >
                                          <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                                          <span>{item}</span>
                                        </div>
                                      ))
                                    ) : cat.id === 'payment' ? (
                                      trip.paymentPolicy && trip.paymentPolicy.length > 0 ? (
                                        trip.paymentPolicy.map((item, i) => (
                                          <div
                                            key={i}
                                            className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                          >
                                            <span className="text-blue-400 font-bold shrink-0 mt-0.5">•</span>
                                            <span>{item}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-sm text-slate-500 italic">
                                          Standard payment terms apply.
                                        </p>
                                      )
                                    ) : cat.id === 'cancellation' ? (
                                      trip.cancellationPolicy && trip.cancellationPolicy.length > 0 ? (
                                        trip.cancellationPolicy.map((item, i) => (
                                          <div
                                            key={i}
                                            className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                          >
                                            <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                                            <span>{item}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-sm text-slate-500 italic">
                                          Standard cancellation policy applies.
                                        </p>
                                      )
                                    ) : curCatIncl.length > 0 ? (
                                      curCatIncl.map((item, i) => (
                                        <div
                                          key={i}
                                          className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                        >
                                          <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                                          <span>{item}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-slate-500 italic">
                                        No specific {cat.label.toLowerCase()} inclusions listed.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Desktop Right Content Cards */}
                        <div className="hidden md:block grow space-y-4 min-w-0 w-full">
                          {activeInclCat === 'inclusions' && (
                            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                              <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
                                <span className="text-base font-bold">✓</span>
                                <h3 className="font-bold text-sm tracking-wide">Inclusions</h3>
                              </div>
                              <div className="bg-slate-900 px-5 py-4 space-y-3">
                                {trip.included && trip.included.length > 0 ? (
                                  trip.included.map((item, i) => (
                                    <div
                                      key={i}
                                      className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                    >
                                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                                      <span>{item}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-slate-500 italic">No inclusions listed.</p>
                                )}
                              </div>
                            </div>
                          )}

                          {activeInclCat === 'hotels' && (
                            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                              <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
                                <span className="text-base">🏨</span>
                                <h3 className="font-bold text-sm tracking-wide">Hotels</h3>
                              </div>
                              <div className="bg-slate-900 px-5 py-4 space-y-3">
                                {trip.stays && trip.stays.length > 0 ? (
                                  trip.stays.map((stay, i) => (
                                    <div
                                      key={i}
                                      className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                    >
                                      <span className="text-indigo-400 shrink-0 mt-0.5">🏨</span>
                                      <span className="font-semibold text-white">{stay}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-slate-500 italic">
                                    Hotel details will be available shortly.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {activeInclCat !== 'inclusions' &&
                            activeInclCat !== 'hotels' &&
                            activeInclCat !== 'exclusions' &&
                            activeInclCat !== 'payment' &&
                            activeInclCat !== 'cancellation' && (
                              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                                <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
                                  <span className="text-base">{activeMeta?.icon}</span>
                                  <h3 className="font-bold text-sm tracking-wide">{activeMeta?.label}</h3>
                                </div>
                                <div className="bg-slate-900 px-5 py-4 space-y-3">
                                  {curIncl.length > 0 ? (
                                    curIncl.map((item, i) => (
                                      <div
                                        key={i}
                                        className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                      >
                                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                                        <span>{item}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-slate-500 italic">
                                      No specific {activeMeta?.label.toLowerCase()} inclusions listed.
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                          {activeInclCat === 'payment' && (
                            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                              <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
                                <span className="text-base">💳</span>
                                <h3 className="font-bold text-sm tracking-wide">Payment Policy</h3>
                              </div>
                              <div className="bg-slate-900 px-5 py-4 space-y-3">
                                {trip.paymentPolicy && trip.paymentPolicy.length > 0 ? (
                                  trip.paymentPolicy.map((item, i) => (
                                    <div
                                      key={i}
                                      className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                    >
                                      <span className="text-blue-400 font-bold shrink-0 mt-0.5">•</span>
                                      <span>{item}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-slate-500 italic">
                                    Standard payment terms apply.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {activeInclCat === 'cancellation' && (
                            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                              <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
                                <span className="text-base">📝</span>
                                <h3 className="font-bold text-sm tracking-wide">Cancellation Policy</h3>
                              </div>
                              <div className="bg-slate-900 px-5 py-4 space-y-3">
                                {trip.cancellationPolicy && trip.cancellationPolicy.length > 0 ? (
                                  trip.cancellationPolicy.map((item, i) => (
                                    <div
                                      key={i}
                                      className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                    >
                                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                                      <span>{item}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-slate-500 italic">
                                    Standard cancellation policy applies.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {(activeInclCat === 'exclusions' || curExcl.length > 0) && (
                            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                              <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-rose-700 to-rose-600 text-white">
                                <span className="text-base">✕</span>
                                <h3 className="font-bold text-sm tracking-wide">Exclusions</h3>
                              </div>
                              <div className="bg-slate-900 px-5 py-4 space-y-3">
                                {(activeInclCat === 'exclusions' ? trip.notIncluded : curExcl).map(
                                  (item, i) => (
                                    <div
                                      key={i}
                                      className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                                    >
                                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                                      <span>{item}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}

              {/* MOBILE CTA */}
              <div className="lg:hidden space-y-3 pt-2">
                <Button
                  size="lg"
                  className="w-full font-bold bg-primary hover:bg-primary/95 text-white"
                  onClick={() => setCallbackOpen(true)}
                >
                  {trip.showGetQuoteOnly ? (
                    <>
                      <MessageCircle size={18} /> Get Quote
                    </>
                  ) : (
                    <>
                      <Phone size={18} /> Enquire Now
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <div className="hidden lg:block space-y-6">
              <div className="lg:sticky lg:top-32 space-y-5">
                {/* PRICE CARD */}
                <Card className="p-6 bg-slate-900 border-slate-800 shadow-xl space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      {selections.length > 0 ? 'Current Selection' : 'Starting Price'}
                    </p>
                    {lowestPrice > 0 ? (
                      <>
                        <p className="text-3xl font-extrabold text-[#ff6e0b] mt-1">
                          ₹{lowestPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-slate-400 mt-2 font-medium">per person</p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-[#ff6e0b] mt-1">Price on Request</p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    {trip.showGetQuoteOnly ? (
                      <Button
                        size="lg"
                        className="w-full justify-center bg-primary hover:bg-primary/95 text-white font-bold"
                        onClick={() => setCallbackOpen(true)}
                      >
                        <MessageCircle size={18} /> Get Quote
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          className="w-full justify-center font-extrabold bg-gradient-to-r from-orange-600 via-[#ff5d09] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg shadow-orange-950/50 hover:shadow-orange-950/70 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-festive-pulse cursor-pointer relative overflow-hidden"
                          onClick={handleBookNow}
                        >
                          <style>{`
                            @keyframes heartbeat-festive {
                              0%, 100% { transform: scale(1); }
                              50% { transform: scale(1.025); }
                            }
                            .animate-festive-pulse {
                              animation: heartbeat-festive 2.5s infinite ease-in-out;
                            }
                          `}</style>
                          <Phone size={18} className="animate-pulse mr-2" /> Book Now
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full justify-center font-bold border-slate-700 bg-slate-900 hover:bg-slate-800 text-white"
                          onClick={() => setCallbackOpen(true)}
                        >
                          <MessageCircle size={18} className="mr-2" /> Request Callback
                        </Button>
                      </>
                    )}
                  </div>
                </Card>

                {/* INLINE CALLBACK CARD */}
                <Card className="p-5 border-slate-800 bg-slate-900/90 shadow-xl">
                  <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
                    📞 Want us to call you?
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-4 font-medium">
                    Share details to get holiday expert assistance
                  </p>

                  {inquirySuccess ? (
                    <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-center animate-in fade-in duration-300">
                      <p className="font-bold text-sm">🎉 Callback Requested!</p>
                      <p className="text-xs mt-1 leading-relaxed text-slate-300">
                        Our holiday travel expert will contact you shortly.
                      </p>
                      <button
                        onClick={() => setInquirySuccess(false)}
                        className="mt-3 text-xs text-amber-300 font-bold hover:underline cursor-pointer"
                      >
                        Request another callback
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                          Mobile Number
                        </label>
                        <div className="flex rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                          <span className="bg-slate-900 border-r border-slate-800 px-3 py-2 text-xs font-bold text-slate-400 flex items-center">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            placeholder="Enter 10-digit number"
                            pattern="[0-9]{10}"
                            value={inquiryPhone}
                            onChange={(e) => setInquiryPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="px-3 py-1.5 text-xs w-full outline-hidden bg-transparent font-medium text-white placeholder:text-slate-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@email.com"
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          className="px-3 py-2 text-xs w-full rounded-xl border border-slate-800 bg-slate-950 outline-hidden font-medium text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="flex items-start gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="agree-checkbox-holiday"
                          required
                          checked={inquiryAgreed}
                          onChange={(e) => setInquiryAgreed(e.target.checked)}
                          className="mt-1 rounded-sm border-slate-700 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                        />
                        <label
                          htmlFor="agree-checkbox-holiday"
                          className="text-[9px] text-slate-400 leading-snug cursor-pointer select-none font-medium"
                        >
                          I accept the{' '}
                          <a href="/privacy-policy" target="_blank" className="text-amber-300 hover:underline font-semibold">
                            Privacy Policy
                          </a>{' '}
                          and authorize Wanderphilia to contact me with details.
                        </label>
                      </div>

                      <Button
                        type="submit"
                        disabled={inquirySubmitting || !inquiryAgreed}
                        className="w-full py-2 rounded-xl font-bold text-xs bg-primary hover:bg-primary/95 text-white shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {inquirySubmitting ? 'Requesting...' : 'Get a Callback ↗'}
                      </Button>
                    </form>
                  )}
                </Card>

                {/* CONTACT CARD */}
                <Card className="p-5 border-slate-800 bg-slate-900/90 text-slate-300">
                  <h3 className="font-bold text-sm text-white mb-1">Need Help?</h3>
                  <p className="text-xs text-slate-400 mb-4 font-medium">
                    Contact our holiday travel experts anytime
                  </p>

                  <div className="space-y-2 text-xs font-semibold">
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-2 text-amber-300 hover:underline"
                    >
                      <span>{contactEmail}</span>
                    </a>
                    <a
                      href={`tel:${contactPhone}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-amber-300"
                    >
                      <Phone size={14} />
                      {contactPhoneDisplay}
                    </a>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-amber-300"
                    >
                      <MessageCircle size={14} />
                      Instagram
                    </a>
                  </div>
                </Card>

                {/* DOWNLOAD ITINERARY */}
                <Button
                  variant="outline"
                  className="w-full font-bold text-xs justify-center cursor-pointer border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200"
                  disabled={isGeneratingPdf}
                  onClick={() => setDownloadPdfModalOpen(true)}
                >
                  {isGeneratingPdf ? (
                    <svg className="w-4 h-4 mr-2 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <Download size={14} className="mr-2" />
                  )}
                  {isGeneratingPdf ? 'Generating PDF...' : 'Download Itinerary'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md lg:hidden border-t border-slate-800 shadow-2xl z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            {lowestPrice > 0 ? (
              <>
                <p className="text-xs text-slate-400">Starting at</p>
                <p className="text-lg font-bold text-white">
                  ₹{lowestPrice.toLocaleString('en-IN')}
                </p>
              </>
            ) : (
              <p className="text-md font-bold text-slate-200">Price on Request</p>
            )}
          </div>
          {trip.showGetQuoteOnly ? (
            <Button
              onClick={() => setCallbackOpen(true)}
              className="shrink-0 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl h-12"
            >
              Get Quote
            </Button>
          ) : (
            <div className="grow min-w-0">
              <SwipeButton onSwipeComplete={handleBookNow} text="Slide to Book" />
            </div>
          )}
        </div>
      </div>

      <div className="h-20 lg:h-0" />

      {/* REVIEWS SECTION */}
      <TripReviewsSection
        tripSlug={trip.slug}
        categoryId={trip.category.toLowerCase()}
        darkTheme={true}
      />

      {/* GALLERY SECTION */}
      <div id="gallery">
        <TripGallerySection
          categoryId={trip.category.toLowerCase()}
          categoryName={trip.destination}
          darkTheme={true}
        />
      </div>

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={`${trip.title} (Christmas & New Year)`}
        price={lowestPrice}
        isQuote={trip.showGetQuoteOnly}
      />

      <DownloadTourPdfDialog
        open={downloadPdfModalOpen}
        onOpenChange={setDownloadPdfModalOpen}
        trip={trip}
        onDownload={handleDownloadPDF}
      />

      {/* FULLSCREEN IMAGE LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-xs select-none">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer z-50"
          >
            <X size={24} />
          </button>

          <button
            onClick={() =>
              setLightboxIndex((prev) => (prev === 0 ? collageImages.length - 1 : prev! - 1))
            }
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer z-50"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="relative w-[90vw] h-[80vh] flex items-center justify-center">
            <Image
              src={collageImages[lightboxIndex].src}
              alt={collageImages[lightboxIndex].alt || 'Gallery'}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={() =>
              setLightboxIndex((prev) => (prev === collageImages.length - 1 ? 0 : prev! + 1))
            }
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer z-50"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-5 text-white/70 text-sm font-semibold z-50">
            {lightboxIndex + 1} / {collageImages.length}
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl z-50 animate-in slide-in-from-bottom-5 font-semibold text-xs flex items-center gap-2 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {notification}
        </div>
      )}
    </div>
  )
}
