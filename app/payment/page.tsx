import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        {/* Hero Section */}
        <section className="bg-gray-50 border-b border-gray-200 py-12 px-4 pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Secure Payment
            </h1>
            <p className="text-gray-600">Complete your booking with our secure payment gateway</p>
          </div>
        </section>

        {/* Payment Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-gray-50 rounded-2xl p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trip Name</span>
                    <span className="font-semibold text-gray-900">Everest Base Camp Trek</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">14 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travelers</span>
                    <span className="font-semibold text-gray-900">2 People</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure</span>
                    <span className="font-semibold text-gray-900">May 1, 2024</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹1,99,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes (18%)</span>
                    <span className="font-semibold text-gray-900">₹35,964</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-primary">₹2,35,764</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Safe & Secure</p>
                    <p className="text-sm text-green-700">Your payment is protected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Details</h2>

                {/* Contact Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                  <Input type="email" placeholder="Email Address" className="mb-4" />
                  <Input type="tel" placeholder="Phone Number" />
                </div>

                {/* Card Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-primary" />
                    Card Details
                  </h3>

                  <Input
                    placeholder="Card Number"
                    className="mb-4"
                    maxLength={16}
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    <Input
                      placeholder="CVV"
                      maxLength={3}
                      type="password"
                    />
                  </div>

                  <Input placeholder="Cardholder Name" />
                </div>

                {/* Billing Address */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
                  <Input placeholder="Street Address" className="mb-4" />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input placeholder="City" />
                    <Input placeholder="State" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Postal Code" />
                    <Input placeholder="Country" />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Payment Options</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'Razorpay', icon: '💳' },
                      { name: 'Google Pay', icon: '🔵' },
                      { name: 'UPI', icon: '📱' },
                    ].map((method, idx) => (
                      <button
                        key={idx}
                        className="border-2 border-gray-200 rounded-lg p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <div className="text-3xl mb-2">{method.icon}</div>
                        <p className="text-sm font-semibold text-gray-900">{method.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded text-primary"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="/terms" className="text-primary font-semibold hover:underline">
                        Terms & Conditions
                      </a>
                      {' '}and{' '}
                      <a href="/privacy-policy" className="text-primary font-semibold hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button size="lg" className="w-full gap-2 flex items-center justify-center">
                  <Lock size={20} />
                  Pay ₹2,35,764 Securely
                </Button>

                {/* Security Badges */}
                <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-600">
                  <span>🔒 SSL Secure</span>
                  <span>✓ Data Protected</span>
                  <span>✓ PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Payment FAQ</h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Is my payment secure?',
                  a: 'Yes, we use industry-standard SSL encryption and PCI compliance to protect your data.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept credit cards, debit cards, UPI, Google Pay, and bank transfers.'
                },
                {
                  q: 'Can I pay in installments?',
                  a: 'Yes, we offer flexible payment plans. Contact us for details.'
                },
                {
                  q: 'What is your refund policy?',
                  a: 'Free cancellation up to 2 weeks before the trip. See our terms for details.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.q}</h3>
                  <p className="text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
