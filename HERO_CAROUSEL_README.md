# How to Add Images to Trip Hero Carousel

## Adding Multiple Images to Trip Hero Section

To enable a carousel with multiple images in the trip hero section, add the `heroMedia` field to any trip object in `lib/data.ts`.

### Basic Usage

```typescript
{
  id: '1',
  title: 'Your Trip Title',
  slug: 'your-trip-slug',
  image: '/images/main-image.jpg', // Fallback image
  // ... other trip fields ...

  // Add this field for carousel
  heroMedia: [
    { type: 'image', src: '/images/image1.jpg', alt: 'Description 1' },
    { type: 'image', src: '/images/image2.jpg', alt: 'Description 2' },
    { type: 'image', src: '/images/image3.jpg', alt: 'Description 3' }
  ]
}
```

### Using the Helper Function

```typescript
import { createHeroMedia } from '@/lib/data'

{
  // ... other trip fields ...
  heroMedia: createHeroMedia([
    { src: '/images/image1.jpg', alt: 'Description 1' },
    { src: '/images/image2.jpg', alt: 'Description 2' },
    { src: '/images/image3.jpg', alt: 'Description 3' }
  ])
}
```

### Adding Videos

```typescript
heroMedia: [
  { type: 'image', src: '/images/image1.jpg', alt: 'Description 1' },
  {
    type: 'video',
    src: '/videos/trip-video.mp4',
    alt: 'Trip Video',
    poster: '/images/video-poster.jpg' // Optional poster image
  },
  { type: 'image', src: '/images/image2.jpg', alt: 'Description 2' }
]
```

### Features

- **Auto-scroll**: Images change every 3 seconds
- **Manual navigation**: Click dots to jump to specific slides
- **Smooth transitions**: 1-second fade transitions
- **Responsive**: Works on mobile and desktop
- **Video support**: Add videos with poster images
- **Per-trip customization**: Each trip can have its own unique hero images

### File Structure

Place your images in the `public/images/` directory:
```
public/
  images/
    trip1-image1.jpg
    trip1-image2.jpg
    trip1-image3.jpg
    video-poster.jpg
  videos/
    trip-video.mp4
```

### Default Behavior

If no `heroMedia` is provided, the carousel will show the trip's main image from the `image` field.

### Example Trip with Carousel

Add heroMedia to any trip in `lib/data.ts`:

```typescript
{
  id: '1',
  title: 'Everest Base Camp Trek',
  slug: 'everest-base-camp',
  image: '/images/everest.jpg',
  // ... other fields ...
  heroMedia: [
    { type: 'image', src: '/images/everest-hero1.jpg', alt: 'Everest Summit' },
    { type: 'image', src: '/images/everest-hero2.jpg', alt: 'Base Camp' },
    { type: 'image', src: '/images/everest-hero3.jpg', alt: 'Mountain Views' },
    { type: 'image', src: '/images/everest-hero4.jpg', alt: 'Sherpa Culture' }
  ]
}
```

This approach allows each trip to have its own unique hero carousel images defined in the data!