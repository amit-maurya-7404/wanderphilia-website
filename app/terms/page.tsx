import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        {/* Hero Section */}
        <section className="border-slate-200 bg-linear-to-r from-slate-900 via-slate-950 to-sky-950 p-10 text-white py-12 px-4 pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold   mb-4">
              Terms & Conditions
            </h1>
            <p className="">Last updated: April 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="space-y-10">
            {/* Hero Card */}
            <div className="rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-950 to-sky-950 p-10 text-white shadow-xl shadow-slate-900/10">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">
                Terms of Use
              </span>
              <h2 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight">
                Travel with confidence and clarity.
              </h2>
              <p className="mt-4 max-w-3xl text-slate-300 leading-relaxed">
                These Terms & Conditions outline the complete framework for booking travel services with Wanderphilia. They cover payments, cancellations, responsibilities, and how we handle changes or unforeseen events.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-5 text-slate-100 ring-1 ring-white/10">
                  <h3 className="text-base font-semibold">Clear Terms</h3>
                  <p className="mt-2 text-sm text-slate-300">Transparent policies and conditions for all bookings.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 text-slate-100 ring-1 ring-white/10">
                  <h3 className="text-base font-semibold">Fair Practices</h3>
                  <p className="mt-2 text-sm text-slate-300">Balanced rights and responsibilities for everyone.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 text-slate-100 ring-1 ring-white/10">
                  <h3 className="text-base font-semibold">Legal Compliance</h3>
                  <p className="mt-2 text-sm text-slate-300">Governed by Indian law with structured arbitration.</p>
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mb-4">
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Introduction
                  </h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Wanderphilia Experiences Private Limited is a company incorporated under the Companies Act, 2013. We're excited to help you explore the world through our curated group tours, custom holidays, backpacking and biking trips across India and International destinations.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    These Terms of Use and Booking Conditions explain how our services work, what you can expect from us and what we ask of you in return. <strong>By booking a trip or using our platform, you agree to these terms.</strong>
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Key Documents:</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-slate-400 mt-1">•</span>
                      <span><strong>PART A:</strong> General Platform Use & Terms of Service</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-slate-400 mt-1">•</span>
                      <span><strong>PART B:</strong> Travel Service Terms & Conditions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-slate-400 mt-1">•</span>
                      <span><strong>PART C:</strong> Legal Relationship & User Agreement</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl bg-blue-50 border border-blue-200 p-6">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Legal Binding:</strong> These Terms constitute a binding legal agreement between you and Wanderphilia Experiences Private Limited governed by the laws of India.
                  </p>
                </div>
              </div>
            </div>

            {/* PART A */}
            <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
              <div className="space-y-6">
                <div className="pb-6 border-b border-slate-200">
                  <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    PART A: General Platform Use & Terms of Service
                  </h2>
                  <p className="text-slate-600 mt-2">Rules for accessing and using Wanderphilia's platform and digital services</p>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">1</span>
                    Client Responsibility
                  </h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-3 text-slate-700">
                    <p>
                      By accessing or using Wanderphilia's website, WhatsApp support line or by confirming a booking with us through any channel you acknowledge and agree to be bound by these terms. These Terms apply to all users regardless of how they interact with our services.
                    </p>
                    <p>
                      The services are provided on an <strong>"as is" and "as available" basis</strong>. Wanderphilia may change the features or functionality of services at any time without prior notice.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">2</span>
                    Eligibility to Use
                  </h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-3 text-slate-700">
                    <p>By accessing our platform, you confirm that:</p>
                    <ul className="space-y-2 ml-4">
                      <li>✓ You are at least 18 years of age with legal capacity to enter binding contracts, <strong>OR</strong></li>
                      <li>✓ You are acting as a parent/legal guardian for a minor with proper authorization.</li>
                    </ul>
                    <p className="pt-2">
                      Wanderphilia reserves the right to restrict or deny access to any user who does not meet these eligibility conditions or who violates these Terms.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">3</span>
                    Permitted and Prohibited Conduct
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-green-50 border border-green-200 p-6">
                      <h4 className="font-semibold text-green-900 mb-3">✓ Permitted:</h4>
                      <ul className="space-y-2 text-green-800 text-sm">
                        <li>• Make genuine travel inquiries and bookings</li>
                        <li>• Communicate with our team for support</li>
                        <li>• Share accurate and complete information</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl bg-red-50 border border-red-200 p-6">
                      <h4 className="font-semibold text-red-900 mb-3">✗ Not Permitted:</h4>
                      <ul className="space-y-2 text-red-800 text-sm">
                        <li>• Submit false bookings or fake information</li>
                        <li>• Spam, harass staff, or spread misinformation</li>
                        <li>• Misuse content without permission</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PART B */}
            <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
              <div className="space-y-6">
                <div className="pb-6 border-b border-slate-200">
                  <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    PART B: Travel Service Terms & Conditions
                  </h2>
                  <p className="text-slate-600 mt-2">Commercial terms governing your travel bookings</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Our Services</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "Group Tours", desc: "Pre-designed, scheduled trips with fixed itineraries" },
                      { title: "Customized Holidays", desc: "Tailor-made travel plans based on your preferences" },
                      { title: "Adventure Trips", desc: "Backpacking, biking, and outdoor experiences" },
                      { title: "Travel Support", desc: "Flights, visas, and transfers coordination" }
                    ].map((service, idx) => (
                      <div key={idx} className="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                        <h4 className="font-semibold text-slate-900">{service.title}</h4>
                        <p className="text-sm text-slate-600 mt-2">{service.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Payment Schedule</h3>
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-4">Short-Haul Packages</h4>
                      <div className="space-y-2 text-slate-700 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span>At booking:</span>
                          <span className="font-semibold">25% (Non-refundable)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span>Within 45 days:</span>
                          <span className="font-semibold">50% (Non-refundable)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span>Within 30 days:</span>
                          <span className="font-semibold">75% (Non-refundable)</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span>20 days or less:</span>
                          <span className="font-semibold">100% (Forfeited)</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-4">Long-Haul Packages</h4>
                      <div className="space-y-2 text-slate-700 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span>At booking:</span>
                          <span className="font-semibold">₹40,000/person (Non-refundable)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span>Within 60 days:</span>
                          <span className="font-semibold">50% (Non-refundable)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span>Within 45 days:</span>
                          <span className="font-semibold">75% (Non-refundable)</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span>30 days or less:</span>
                          <span className="font-semibold">100% (Forfeited)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Accepted Payment Methods</h3>
                  <div className="rounded-3xl bg-blue-50 border border-blue-200 p-6">
                    <ul className="grid md:grid-cols-2 gap-3 text-slate-700">
                      <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">✓</span> UPI</li>
                      <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">✓</span> Net Banking</li>
                      <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">✓</span> Credit/Debit Cards</li>
                      <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">✓</span> Bank Transfer</li>
                      <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">✓</span> Cheque (with prior confirmation)</li>
                      <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">✓</span> Cash (rare cases only)</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Cancellation Policy</h3>
                  <div className="rounded-3xl bg-red-50 border border-red-200 p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-red-900 mb-3">Short-Haul Packages</h4>
                      <ul className="space-y-2 text-red-800 text-sm">
                        <li>• At booking: 25% booking advance is non-refundable</li>
                        <li>• Within 45 days: Minimum 50% deduction</li>
                        <li>• Within 30 days: Minimum 75% deduction</li>
                        <li>• 20 days or less: 100% forfeited</li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-red-200">
                      <h4 className="font-semibold text-red-900 mb-3">Long-Haul Packages</h4>
                      <ul className="space-y-2 text-red-800 text-sm">
                        <li>• At booking: ₹40,000 advance is non-refundable</li>
                        <li>• Within 60 days: Minimum 50% deduction</li>
                        <li>• Within 45 days: Minimum 75% deduction</li>
                        <li>• 30 days or less: 100% forfeited</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Travel Documents & Visas</h3>
                  <div className="rounded-3xl bg-yellow-50 border border-yellow-200 p-6 space-y-3">
                    <p className="text-slate-700">
                      Each traveller is solely responsible for ensuring their passport, visa(s) and travel permissions are valid and compliant with destination requirements.
                    </p>
                    <ul className="space-y-2 text-slate-700 text-sm">
                      <li>✓ Passport must be valid for at least 6 months from return date</li>
                      <li>✓ All applicable visas and e-visas must be secured</li>
                      <li>✓ Health documents or vaccination proofs (if required)</li>
                      <li>✓ Government-issued photo ID for domestic travel</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Travel Insurance & Medical Fitness</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Travel Insurance</h4>
                      <ul className="space-y-2 text-slate-700 text-sm">
                        <li>• Strongly recommended</li>
                        <li>• Not provided by Wanderphilia</li>
                        <li>• Client's responsibility</li>
                        <li>• Claims made to insurer directly</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Medical Fitness</h4>
                      <ul className="space-y-2 text-slate-700 text-sm">
                        <li>• Disclose pre-existing conditions</li>
                        <li>• Medical certificate may be required</li>
                        <li>• Participation in activities is voluntary</li>
                        <li>• Adventure activities at own risk</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PART C */}
            <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
              <div className="space-y-6">
                <div className="pb-6 border-b border-slate-200">
                  <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 8a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    PART C: Legal Relationship & User Agreement
                  </h2>
                  <p className="text-slate-600 mt-2">Legal framework and dispute resolution</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Limitation of Liability</h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-3 text-slate-700 border border-slate-200">
                    <p>
                      Wanderphilia acts as a travel organizer and booking facilitator. The actual execution of services is carried out by independent third-party service providers.
                    </p>
                    <p className="font-semibold">Wanderphilia shall not be liable for:</p>
                    <ul className="space-y-2 ml-4 text-sm">
                      <li>• Acts or omissions of independent contractors</li>
                      <li>• Delays, cancellations, or force majeure events</li>
                      <li>• Personal injury, illness, death, or property damage</li>
                      <li>• Loss arising from client's non-compliance with regulations</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Force Majeure</h3>
                  <div className="rounded-3xl bg-purple-50 border border-purple-200 p-6">
                    <p className="text-slate-700 mb-4">
                      Wanderphilia is not liable for failures resulting from circumstances beyond reasonable control, including:
                    </p>
                    <ul className="grid md:grid-cols-2 gap-2 text-purple-800 text-sm">
                      <li>• Natural disasters</li>
                      <li>• Epidemics or pandemics</li>
                      <li>• Strikes or civil unrest</li>
                      <li>• Government restrictions</li>
                      <li>• Technical failures</li>
                      <li>• Political emergencies</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Grievance Redressal</h3>
                  <div className="space-y-3">
                    <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-3">Level 1: Customer Success Team</h4>
                      <ul className="space-y-2 text-slate-700 text-sm">
                        <li>📧 Email through official communication channels</li>
                        <li>💬 WhatsApp for mid-travel support</li>
                        <li>📞 Phone support during business hours</li>
                        <li>✓ Response within 48 business hours</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-3">Escalation Process</h4>
                      <ul className="space-y-2 text-slate-700 text-sm">
                        <li>→ Destination Manager for contextual review</li>
                        <li>→ VP - Sales for final resolution authority</li>
                        <li>✓ Decisions based on policies and vendor terms</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Governing Law & Dispute Resolution</h3>
                  <div className="rounded-3xl bg-blue-50 border border-blue-200 p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Step 1: Mutual Amicable Resolution</h4>
                      <p className="text-blue-800 text-sm">Parties attempt to resolve disputes through good-faith negotiations.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Step 2: Mediation or Arbitration</h4>
                      <p className="text-blue-800 text-sm">If unresolved for 30 days, either party may opt for mediation or arbitration under the Arbitration and Conciliation Act, 1996.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Jurisdiction: Gurugram, Haryana, India</h4>
                      <p className="text-blue-800 text-sm">All disputes subject to exclusive jurisdiction of competent courts in Gurugram.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">4</span>
                    Termination or Suspension of Access
                  </h3>
                  <div className="rounded-3xl bg-red-50 border border-red-200 p-6 space-y-3 text-slate-700">
                    <p>
                      Wanderphilia reserves the right to suspend, restrict or permanently terminate your access if you:
                    </p>
                    <ul className="space-y-2 ml-4 text-sm">
                      <li>• Violate these Terms or applicable laws</li>
                      <li>• Provide false, incomplete or misleading information</li>
                      <li>• Misuse the platform or harass staff</li>
                      <li>• Engage in conduct that harms Wanderphilia or others</li>
                    </ul>
                    <p className="pt-3 border-t border-red-200">
                      In such cases, future bookings may be denied without liability or refund.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PART B - Extended */}
            <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">5</span>
                    Modifications & Rescheduling
                  </h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-4 border border-slate-200">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Rescheduling by Traveller</h4>
                      <p className="text-slate-700 text-sm mb-3">Must be requested before:</p>
                      <ul className="space-y-1 text-slate-700 text-sm ml-4">
                        <li>• Weekend Trips: 15 days before departure</li>
                        <li>• Domestic Trips: 30 days before departure</li>
                        <li>• International Trips: 45 days before departure</li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Important Notes:</h4>
                      <ul className="space-y-1 text-slate-700 text-sm ml-4">
                        <li>• Only 1 free reschedule permitted per booking</li>
                        <li>• Subject to availability and vendor approval</li>
                        <li>• Must be used within 12 months</li>
                        <li>• Medical/Force Majeure rescheduling may result in credit note</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">6</span>
                    Flight Ticket Issuance & Airline Terms
                  </h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-3 border border-slate-200 text-slate-700">
                    <p>
                      Wanderphilia acts as a facilitator for flight bookings and does not control airline operations.
                    </p>
                    <ul className="space-y-2 text-sm ml-4">
                      <li>✓ Full payment required at ticket issuance</li>
                      <li>✓ Tickets are non-refundable unless airline allows</li>
                      <li>✓ Post-issuance changes subject to airline charges</li>
                      <li>✓ Wanderphilia not liable for delays or cancellations</li>
                      <li>✓ Baggage handling is airline's responsibility</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">7</span>
                    Accommodation Terms
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Check-In & Check-Out</h4>
                      <ul className="space-y-2 text-slate-700 text-sm">
                        <li>📅 Check-in: 3:00 PM</li>
                        <li>📅 Check-out: 11:00 AM</li>
                        <li>⚠️ Early/late subject to hotel availability</li>
                        <li>💰 Additional charges apply for early/late</li>
                      </ul>
                    </div>
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Room Allocation</h4>
                      <ul className="space-y-2 text-slate-700 text-sm">
                        <li>🏨 Room types vary by destination</li>
                        <li>🔄 Subject to hotel availability</li>
                        <li>💵 Incidentals (mini-bar, room service) not included</li>
                        <li>⚠️ Client liable for property damage</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">8</span>
                    Transfers & Sightseeing Services
                  </h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-3 border border-slate-200 text-slate-700">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Scheduled Transfers:</h4>
                      <p className="text-sm">
                        Transfers are organized per itinerary and not available on-call basis. Delays caused by client may result in missed services without refund.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Activity Disruptions:</h4>
                      <p className="text-sm">
                        Sightseeing and transfers subject to weather, road closures, strikes or mechanical issues. No refund for missed activities due to external factors.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">9</span>
                    Luggage & Personal Property
                  </h3>
                  <div className="rounded-3xl bg-orange-50 border border-orange-200 p-6 space-y-3">
                    <p className="text-orange-900">
                      <strong>Client Responsibility:</strong> You are solely responsible for your belongings throughout the tour.
                    </p>
                    <ul className="space-y-2 text-orange-800 text-sm ml-4">
                      <li>✗ Wanderphilia not liable for loss or theft</li>
                      <li>✗ Not responsible for items left unattended</li>
                      <li>✗ Not liable for porterage services by third parties</li>
                      <li>⚠️ Label baggage clearly to avoid misplacement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* PART C - Extended */}
            <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">5</span>
                    Code of Conduct During Travel
                  </h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-3 border border-slate-200 text-slate-700">
                    <p><strong>Expected Behaviour:</strong></p>
                    <ul className="space-y-2 text-sm ml-4">
                      <li>✓ Be courteous to fellow travellers, guides and locals</li>
                      <li>✓ Respect cultural norms and local laws</li>
                      <li>✓ Comply with safety instructions</li>
                      <li>✗ Disruptive behaviour = immediate removal without refund</li>
                    </ul>
                    <p className="pt-3 border-t border-slate-200">
                      <strong>Damage Responsibility:</strong> You are solely liable for any loss or damage caused to property during the trip.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">6</span>
                    Indemnification
                  </h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-3 border border-slate-200 text-slate-700">
                    <p>
                      By booking, you agree to indemnify and hold harmless Wanderphilia from any claims arising from:
                    </p>
                    <ul className="space-y-2 text-sm ml-4">
                      <li>• Your breach of these Terms</li>
                      <li>• Your misconduct or negligence</li>
                      <li>• Unauthorized use of third-party information</li>
                      <li>• Actions resulting in damage to persons or property</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">7</span>
                    Credit Note Terms
                  </h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-3 border border-slate-200 text-slate-700">
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Validity:</h4>
                        <p>12 months from issuance</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Transferable:</h4>
                        <p>Yes (Non-refundable for cash)</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Applicable To:</h4>
                        <p>Wanderphilia packages only</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Full Redemption:</h4>
                        <p>Entire value in one booking</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">8</span>
                    Intellectual Property Rights
                  </h3>
                  <div className="rounded-3xl bg-purple-50 border border-purple-200 p-6 space-y-3">
                    <p className="text-purple-900">
                      All content on Wanderphilia's platforms is exclusive property and protected by law.
                    </p>
                    <ul className="space-y-2 text-purple-800 text-sm ml-4">
                      <li>✗ No reproduction without permission</li>
                      <li>✗ No commercial use or competitive purposes</li>
                      <li>✗ No modification or distribution</li>
                      <li>⚠️ Unauthorized use may result in legal action</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">9</span>
                    Amendment of Terms
                  </h3>
                  <div className="rounded-3xl bg-slate-50 p-6 space-y-2 border border-slate-200 text-slate-700">
                    <p>
                      Wanderphilia reserves the right to modify these Terms at any time without prior notice.
                    </p>
                    <p className="text-sm">
                      The latest version is available on our website. Continued use after updates means you accept the revised Terms. It is your responsibility to review regularly.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">10</span>
                    Entire Agreement & Severability
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Entire Agreement</h4>
                      <p className="text-slate-700 text-sm">
                        These Terms constitute the complete agreement and supersede all prior communications or agreements.
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Severability</h4>
                      <p className="text-slate-700 text-sm">
                        If any provision is found unenforceable, it shall be severed without affecting the remaining Terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Summary Card */}
            <div className="rounded-4xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white shadow-xl">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Ready to Start Your Journey?</h2>
                <p className="text-slate-300 leading-relaxed">
                  By proceeding with a booking on Wanderphilia, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you have any questions or concerns, please contact our team before confirming your booking.
                </p>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-sm">
                    For inquiries or concerns regarding these terms, contact: <span className="text-sky-300 font-semibold">experiences@wanderphilia.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
