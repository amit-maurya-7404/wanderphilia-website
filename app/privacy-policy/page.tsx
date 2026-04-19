import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { contactPhoneDisplayInternational } from '@/lib/contact'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        {/* Hero Section */}
        <section className="bg-primary border-b border-gray-200 py-12 px-4 pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-white">Last updated: April 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="space-y-10">
            <div className="rounded-4xl border border-slate-200 bg-linear-to-r from-slate-900 via-slate-950 to-sky-950 p-10 text-white shadow-xl shadow-slate-900/10">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">
                Privacy Policy
              </span>
              <h2 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight">
                Your data is trusted, protected, and handled with care.
              </h2>
              <p className="mt-4 max-w-3xl text-slate-300 leading-relaxed">
                Wanderphilia collects only what is necessary, shares data only with trusted travel partners, and gives you clear control over how your information is used across our website, app, WhatsApp, email, and booking channels.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-5 text-slate-100 ring-1 ring-white/10">
                  <h3 className="text-base font-semibold">Transparent</h3>
                  <p className="mt-2 text-sm text-slate-300">Clear definitions, purposes, and lawful processing bases.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 text-slate-100 ring-1 ring-white/10">
                  <h3 className="text-base font-semibold">Secure</h3>
                  <p className="mt-2 text-sm text-slate-300">Encrypted storage, access controls, and breach response.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 text-slate-100 ring-1 ring-white/10">
                  <h3 className="text-base font-semibold">Control</h3>
                  <p className="mt-2 text-sm text-slate-300">Rights to access, correct, delete, and opt out of marketing.</p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
              <div className="space-y-6">
                <p>
                  Wanderphilia Experiences Private Limited ("Wanderphilia", "Company", "we", "us", "our") values the trust you place in us when you choose our services. This Privacy Policy ("Policy") explains how we collect, use, store, share and protect your personal data when you engage with our website, mobile application, booking channels (including WhatsApp and email) or otherwise interact with us.
                </p>
                <p>
                  This Policy applies to our customers, travellers, website visitors, prospective clients, and any other individuals whose information is received or processed by Wanderphilia in connection with our services.
                </p>

                <h2 id="section-1" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  1. Definitions
                </h2>
                <ul>
                  <li><strong>Personal Data</strong>: any information relating to an identified or identifiable person, such as name, contact details, government identification, or online identifiers.</li>
                  <li><strong>Sensitive Personal Data</strong>: passport numbers, health details, financial information, or information relating to minors.</li>
                  <li><strong>Processing</strong>: collection, storage, use, disclosure, or deletion of personal data.</li>
                  <li><strong>Cookies</strong>: small text files stored on your device to recognise repeat users and improve functionality.</li>
                  <li><strong>Minor</strong>: an individual under 18 years of age.</li>
                </ul>

                <h2 id="section-2" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  2. Collection of Personal Data
                </h2>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <p className="mb-4">We collect data when you:</p>
                  <ul>
                    <li>book or enquire about trips;</li>
                    <li>use our website, mobile app, WhatsApp, email, or phone channels;</li>
                    <li>provide details through authorised sales representatives or enquiry forms.</li>
                  </ul>
                </div>
                <div className="mt-6 rounded-3xl bg-slate-50 p-6">
                  <p className="mb-4">The information we collect may include:</p>
                  <ul>
                    <li>name, email, phone number, postal address, and date of birth;</li>
                    <li>passport and visa details, ID proofs, travel history, and payment information;</li>
                    <li>health or medical details, dietary preferences, and emergency contact information;</li>
                    <li>details of co-travellers for group bookings.</li>
                  </ul>
                </div>
                <div className="mt-6 rounded-3xl bg-slate-50 p-6">
                  <p className="mb-4">We also automatically collect technical data such as:</p>
                  <ul>
                    <li>IP address, browser type, operating system, device identifiers, and session IDs;</li>
                    <li>referral URLs, cookies, geolocation (approximate), and clickstream data;</li>
                    <li>analytics data from tools like Google Analytics, Facebook Pixel, Mixpanel, and Google Tag Manager.</li>
                  </ul>
                </div>
                <p className="mt-6">
                  We do not buy data from third-party brokers or affiliates. Leads generated through our enquiry or advertising campaigns may be routed into our CRM systems.
                </p>
                <p>
                  Sensitive personal data such as passport details, visa forms, or health certificates is collected only when strictly necessary and with your explicit consent.
                </p>

                <h2 id="section-3" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  3. Categories of Data Collected
                </h2>
                <ul>
                  <li><strong>Contact Information</strong>: full name, email, phone number, and emergency contacts.</li>
                  <li><strong>Identity Information</strong>: passport details, government ID, nationality, date of birth, and gender.</li>
                  <li><strong>Financial Information</strong>: billing address, limited payment details via secure gateways, and tax-related details where required.</li>
                  <li><strong>Travel & Booking Information</strong>: destination preferences, accommodation details, flight schedules, co-traveller information, and booking history.</li>
                  <li><strong>Health & Medical Information</strong>: voluntary disclosures of medical conditions, allergies, and fitness declarations for travel suitability.</li>
                  <li><strong>Children's Information</strong>: limited minor data such as name, age, and identity proof, collected only with verified parental or guardian consent.</li>
                  <li><strong>Technical & Usage Information</strong>: IP address, browser, device type, cookies, and online identifiers.</li>
                </ul>
                <p>
                  These categories reflect our current practices and may change with technology, business needs, or legal requirements. Material changes will be updated here and notified where required.
                </p>

                <h2 id="section-4" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="8" cy="8" r="1" />
                    <circle cx="16" cy="8" r="1" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6M9 9h6" />
                  </svg>
                  4. Use of Cookies and Session Data
                </h2>
                <p>
                  We use cookies, pixels, tags, and similar tracking technologies to enhance our website experience, analyse traffic, personalise content, and measure marketing performance.
                </p>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <ul>
                    <li><strong>Essential cookies</strong> support website functionality, session security, and payment processing.</li>
                    <li><strong>Performance and analytics cookies</strong> help us understand user behaviour and improve our services.</li>
                    <li><strong>Functional cookies</strong> remember preferences like language settings or saved itineraries.</li>
                    <li><strong>Marketing cookies</strong> deliver relevant promotions and manage advertising frequency.</li>
                  </ul>
                </div>
                <p>
                  You can manage or disable cookies in your browser settings, but this may reduce website functionality. Continued use of the website without disabling cookies means you consent to our cookie use.
                </p>
                <p>
                  We also collect technical session data such as IP address, device identifiers, operating system, referral URLs, session duration, clickstream data, and log information for analytics, fraud prevention, and security.
                </p>

                <h2 id="section-5" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  5. Purpose and Use of Data
                </h2>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <ul>
                    <li>facilitate and manage travel bookings including hotels, flights, transfers, insurance, and visas;</li>
                    <li>provide trip communications, pre-departure support, and on-trip assistance;</li>
                    <li>offer customer service, dispute resolution, and grievance handling;</li>
                    <li>comply with legal obligations such as tax reporting, TCS declarations, and RBI remittance rules.</li>
                  </ul>
                </div>
                <p>
                  Lawful bases for processing include your consent, contract performance, legal compliance, and our legitimate interests in fraud prevention, service improvement, and security.
                </p>
                <p>
                  With your consent, we may send newsletters, promotional offers, personalised recommendations, and marketing communications via email, WhatsApp, or SMS. You may opt out at any time.
                </p>
                <p>
                  We also aggregate and anonymise data to analyse trends, run surveys, and develop services. Anonymised data cannot identify you personally.
                </p>

                <h2 id="section-6" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  6. Sharing and Disclosure of Data
                </h2>
                <p>
                  We share data with trusted travel partners only as needed to deliver services. This may include airlines, hotels, transport operators, insurers, visa consultants, local guides, and destination management companies.
                </p>
                <p>
                  Third parties are required to keep your information confidential and process it only for the service they provide. Wanderphilia is not responsible for misuse or breaches caused by third-party vendors.
                </p>
                <p>
                  Cross-border transfers of personal data are protected by contractual safeguards and aligned with international standards, including GDPR principles where applicable.
                </p>
                <p>
                  We do not sell or rent your data to advertisers or marketing agencies. Any retargeting or campaign analytics are based on aggregated and anonymised tracking data.
                </p>
                <p>
                  We may disclose your information if required by law or valid legal process to comply with regulatory authorities or protect our operations.
                </p>

                <h2 id="section-7" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  7. Storage, Retention and Security
                </h2>
                <p>
                  Your data is stored securely in cloud services and CRM systems with access limited to authorised team members in marketing, technology, and operations.
                </p>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <ul>
                    <li>Technical safeguards include encryption, secure API logging, and intrusion monitoring.</li>
                    <li>Organisational safeguards include role-based access, password protection, and confidentiality undertakings.</li>
                  </ul>
                </div>
                <p>
                  We retain data only as long as necessary for the purpose it was collected and longer if required by law. Typical retention lasts until the end of the client relationship and for statutory record-keeping.
                </p>
                <p>
                  While we work to keep your data secure, no system is completely immune to cyber threats. In case of a breach, we will investigate promptly, mitigate impact, and notify affected parties and regulators as required by law.
                </p>

                <h2 id="section-8" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  8. User Rights and Choices
                </h2>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <ul>
                    <li>You can review, correct, or request deletion of your personal data.</li>
                    <li>You may withdraw marketing consent by unsubscribing or contacting us, while still receiving essential booking communications.</li>
                    <li>Where GDPR applies, you may request processing restrictions, data portability, and objection to significant automated decisions.</li>
                  </ul>
                </div>
                <p>
                  If you wish to restrict or object to processing in specific cases, including sensitive health information, we will review your request based on feasibility and legal requirements.
                </p>
                <p>
                  We do not knowingly collect personal data from minors under 18 without verified parental or guardian consent. If you believe a minor’s data has been collected without consent, please contact us to take corrective action.
                </p>

                <h2 id="section-9" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  9. Protection of Data of Overseas Clients
                </h2>
                <p>
                  For overseas clients, we apply safeguards consistent with Indian law and international best practices. Personal data is processed only for travel services and shared with partners as needed for bookings or when required by law.
                </p>
                <p>
                  Where stricter standards like GDPR apply, we aim to provide equivalent protections, including enhanced rights around access, correction, and deletion.
                </p>

                <h2 id="section-10" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  10. Use of Images, Testimonials and Media
                </h2>
                <p>
                  During trips, photographs or videos may be captured for operational or promotional purposes. Participation in our trips indicates consent for reasonable use of this media by Wanderphilia.
                </p>
                <p>
                  If you want to opt out of identifiable image use, notify us in writing before your trip begins.
                </p>

                <h2 id="section-11" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1v13h3V7l3-1V4a2 2 0 00-2-2H5a2 2 0 00-2 2v2zM16 6l3 1v13h3V7l3-1V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2zM8 8v12h8V8H8z" />
                  </svg>
                  11. Compliance with Law
                </h2>
                <p>
                  We comply with Indian privacy and data protection laws, including the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000. For overseas clients, we also align with GDPR where applicable.
                </p>

                <h2 id="section-12" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  12. Changes to this Policy
                </h2>
                <p>
                  This Policy may change over time to reflect new technology, business operations, or legal requirements. Updates are published on our website with an updated "Last Updated" date.
                </p>

                <h2 id="section-13" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  13. Contact and Grievance Redressal
                </h2>
                <div className="rounded-3xl bg-slate-50 p-6">
                  <p className="font-semibold">For concerns, requests, or grievances regarding your personal data, contact our Grievance Officer:</p>
                  <p className="mt-3">
                    <strong>Grievance Officer:</strong> Bhavin Thakker<br />
                    <strong>Email:</strong> experiences@wanderphilia.com<br />
                    <strong>Phone:</strong> {contactPhoneDisplayInternational}
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
