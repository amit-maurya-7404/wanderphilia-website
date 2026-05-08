import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-20 text-slate-900">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary mb-6">Page Not Found</p>
        <h1 className="text-5xl font-bold mb-6">404 — Page does not exist</h1>
        <p className="text-base leading-7 text-slate-600 mb-8">
          The page you were looking for cannot be found. Please return to the homepage or explore our latest trips.
        </p>
        <Link href="/" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white font-semibold shadow-lg hover:bg-primary/90 transition">
          Go Back Home
        </Link>
      </div>
    </main>
  )
}
