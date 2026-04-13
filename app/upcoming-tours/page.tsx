import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { UpcomingGroupToursSection } from '@/components/upcoming-group-tours-section'

export default function UpcomingToursPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.28),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.18),_transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Upcoming Tours
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Join our next curated small-group adventures.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-200 leading-8">
                Discover handcrafted itineraries for travelers who want immersive experiences, expert guides, and seamless planning.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/trips?type=Group" className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90">
                  Browse Tours
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Plan a group trip
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">What to expect</p>
                <h2 className="mt-5 text-3xl font-bold text-slate-950">Group journeys built for comfort, connection, and discovery.</h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Every tour blends expert local guides, carefully paced itineraries, and premium stays so you can travel with confidence and joy.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Small groups</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Comfortable group sizes for easy movement and deeper cultural access.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Handpicked routes</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Journeys that combine iconic sights with hidden local favorites.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Expert support</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">From planning to departure, you have a dedicated team at every step.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Flexible dates</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Choose the best schedule for your group with customizable options.</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { title: 'Next departure', value: 'May 2026' },
                  { title: 'Top route', value: 'Leh Ladakh & Kashmir' },
                  { title: 'Group size', value: '10-16 travelers' },
                  { title: 'Includes', value: 'Travel, stay, transport, guide' },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{item.title}</p>
                    <p className="mt-4 text-2xl font-bold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UpcomingGroupToursSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
