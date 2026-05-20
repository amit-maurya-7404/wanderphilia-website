import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'
import { trips } from '@/lib/data'

function parsePriceValue(value: string) {
  return Number(value.replace(/[^0-9]/g, '')) || 0
}

export async function POST(req: Request) {
  try {
    const { slug, quantities = [], startDate, endDate, currency } = await req.json()

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Trip slug is required.' }, { status: 400 })
    }

    const trip = trips.find((trip) => trip.slug === slug)
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found.' }, { status: 404 })
    }

    const normalizedQuantities = Array.isArray(quantities)
      ? quantities.map((value: any) => Number(value) || 0)
      : []

    let subtotal = 0
    if (trip.costingDetails && trip.costingDetails.length > 0 && normalizedQuantities.length > 0) {
      subtotal = trip.costingDetails.reduce((sum, item, idx) => {
        const qty = normalizedQuantities[idx] || 0
        return sum + parsePriceValue(item.value) * qty
      }, 0)
    }

    if (subtotal === 0) {
      subtotal = trip.price || 0
    }

    const gst = Math.round(subtotal * 0.05)
    const amount = subtotal + gst

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay keys are missing from environment variables.')
      return NextResponse.json(
        { error: 'Razorpay keys are not configured.' },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })

    // amount should be in paise (e.g. INR 100 = 10000 paise)
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
      receipt: `receipt_${slug}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        tripSlug: slug,
        startDate: startDate || '',
        endDate: endDate || '',
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
