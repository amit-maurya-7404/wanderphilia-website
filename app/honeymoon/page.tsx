import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HoneymoonPackagesSection } from '@/components/honeymoon-packages-section'

export default function HoneymoonPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.28),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Honeymoon Escapes
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Romantic journeys designed for unforgettable couple adventures.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-200 leading-8">
                From intimate stays to dreamy sunsets, every package is crafted to make your honeymoon feel magical and effortless.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/trips?type=Honeymoon" className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90">
                  View Packages
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Talk to us
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Plan your escape</p>
                <h2 className="mt-5 text-3xl font-bold text-slate-950">Luxury experiences for couples who want privacy and romance.</h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Every honeymoon package blends serene accommodations, local experiences, and thoughtful details so you can focus on each other.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Private stays</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Handpicked boutique hotels and quiet resorts.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Curated experiences</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Romantic dinners, couples’ spa days, and unforgettable moments.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Flexible pace</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Relaxed itineraries with optional adventure and downtime.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Romantic details</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Special touches built into every journey.</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { title: 'Signature stay', value: 'Boutique resorts' },
                  { title: 'Best season', value: 'Oct - Feb' },
                  { title: 'Highlights', value: 'Sunsets, private dining' },
                  { title: 'Perfect for', value: 'Couples & honeymooners' },
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
            <HoneymoonPackagesSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
