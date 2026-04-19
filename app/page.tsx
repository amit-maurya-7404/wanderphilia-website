import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { TripTypesSection } from '@/components/trip-types-section'
import { FeaturedTripsSection } from '@/components/featured-trips-section'
import { DestinationsSection } from '@/components/destinations-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { CTASection } from '@/components/cta-section'
import { UpcomingGroupToursSection } from '@/components/upcoming-group-tours-section'
import { HoneymoonPackagesSection } from '@/components/honeymoon-packages-section'
import { BlogsPreviewSection } from '@/components/blogs-preview-section'
import { InstagramSection } from '@/components/instagram-section'
import { ReviewsSection } from '@/components/reviews-section'
import { PhotoGallerySection } from '@/components/photo-gallery-section'
import { VideoTestimonialsSection } from '@/components/video-testimonials-section'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="grow">
        <HeroSection />
        {/* <TripTypesSection /> */}
        <FeaturedTripsSection />
        <UpcomingGroupToursSection />
        <HoneymoonPackagesSection />
        <DestinationsSection />
        <BlogsPreviewSection />
        <PhotoGallerySection />
        <InstagramSection />
        <ReviewsSection />
        <VideoTestimonialsSection />
        {/* <FeaturesSection /> */}
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
