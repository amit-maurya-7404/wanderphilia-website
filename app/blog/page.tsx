import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BlogCard } from '@/components/blog-card'
import { blogs } from '@/lib/data'
import { Input } from '@/components/ui/input'

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.24),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.16),_transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Travel stories
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Inspiration, guides, and travel tips for modern explorers.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-200 leading-8">
                Read curated articles that help you plan better trips, find hidden gems, and travel with confidence.
              </p>
              <div className="mt-10 max-w-md">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="bg-white text-gray-900 placeholder-gray-500 rounded-full px-6 py-3 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-12  lg:items-start">
              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Latest Insights</p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-950">The latest travel advice from Wanderphilia.</h2>
                  <p className="mt-4 text-base leading-8 text-slate-600">
                    Discover stories, destination guides, and planning tips to inspire your next trip.
                  </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} {...blog} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Destinations', count: 24, icon: '🗺️' },
                { name: 'Travel Tips', count: 18, icon: '💡' },
                { name: 'Budget Travel', count: 12, icon: '💰' },
                { name: 'Adventure', count: 15, icon: '🏔️' },
              ].map((category, idx) => (
                <div key={idx} className="rounded-3xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} articles</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center shadow-sm">
              <h2 className="text-4xl font-bold text-slate-950 mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-lg text-slate-600 mb-8">
                Get weekly travel tips, destination guides, and exclusive offers directly in your inbox.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Input type="email" placeholder="your@email.com" className="flex-1 rounded-full px-6 py-3" />
                <button className="rounded-full bg-primary px-8 py-3 text-white font-semibold hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
