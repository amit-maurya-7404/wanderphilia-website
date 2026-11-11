export const sectionMappings: Record<string, Record<string, string[]>> = {
  'rajasthan': {
    available: ['WNDPI-RAJ-001'],
    group: [],
    family: ['WNDPI-RAJ-001'],
    honeymoon: [],
    custom: ['WNDPI-RAJ-001'],
    related: ['22', '19', '1']
  },
  'leh-ladakh': {
    available: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '29', '30'],
    group: ['1', '2', '3', '4', '5'],
    family: ['1', '2', '3', '4', '5', '6', '29', '30'],
    honeymoon: ['2', '6'],
    custom: ['7'],
    related: ['8', '9']
  },
  'kashmir': {
    available: ['22'],
    group: [],
    family: ['22'],
    honeymoon: ['22'],
    custom: ['22'],
    related: ['19', '10', '1']
  },
  'switzerland': {
    available: ['1', '9'],
    group: [],
    family: ['10', '11'],
    honeymoon: [],
    custom: ['12', '13'],
    related: ['14', '15']
  },
  'indonesia': {
    available: ['1', '17'],
    group: [],
    family: ['18', '19'],
    honeymoon: [],
    custom: ['20', '21'],
    related: ['22', '23']
  },
  'bali': {
    available: ['57', '58', '59', '60'],
    group: ['57'],
    family: ['57'],
    honeymoon: ['58', '59'],
    custom: ['58', '59', '60'],
    related: ['23', '40', '31']
  },
  'bhutan': {
    available: ['15', '16', '17', '18'],
    group: ['15', '16'],
    family: ['15', '17'],
    honeymoon: [],
    custom: ['16', '18'],
    related: ['59', '23']
  },
  'himachal': {
    available: ['19', '20', '21'],
    group: ['19', '20'],
    family: ['19', '20'],
    honeymoon: ['21'],
    custom: ['21'],
    related: ['38', '39']
  },
  'iceland': {
    available: ['1', '41'],
    group: [],
    family: ['42', '43'],
    honeymoon: [],
    custom: ['44', '45'],
    related: ['46', '47']
  },
  'japan': {
    available: ['1', '49'],
    group: [],
    family: ['50', '51'],
    honeymoon: [],
    custom: ['52', '53'],
    related: ['54', '55']
  },
  'meghalaya': {
    available: ['meghalaya-kaziranga-7n-8d'],
    group: [],
    family: ['meghalaya-kaziranga-7n-8d'],
    honeymoon: [],
    custom: ['meghalaya-kaziranga-7n-8d'],
    related: ['WNDPI-RAJ-001', '1']
  },
  'nepal': {
    available: ['1', '77'],
    group: [],
    family: ['78', '79'],
    honeymoon: [],
    custom: ['80', '81'],
    related: ['82', '83']
  },
  'singapore': {
    available: ['23'],
    group: [],
    family: ['23'],
    honeymoon: [],
    custom: ['23'],
    related: ['1', '15']
  },
  'peru': {
    available: ['1', '85'],
    group: [],
    family: ['86', '87'],
    honeymoon: [],
    custom: ['88', '89'],
    related: ['90', '91']
  },
  'spiti': {
    available: ['WNDPI-WSP-001', 'WNDPI-SSP-001', 'WNDPI-SSP-002', 'WNDPI-SSP-003', 'WNDPI-SSP-004'],
    group: ['WNDPI-WSP-001', 'WNDPI-SSP-001'],
    family: ['WNDPI-WSP-001', 'WNDPI-SSP-001', 'WNDPI-SSP-002', 'WNDPI-SSP-003', 'WNDPI-SSP-004'],
    honeymoon: [],
    custom: [],
    related: ['19', '20', '1']
  },
  'sikkim': {
    available: ['24', '25', '26', '27', '28'],
    group: ['24', '26'],
    family: ['24', '26'],
    honeymoon: ['25'],
    custom: ['25', '27', '28'],
    related: ['1', '10', '22']
  },
  'thailand': {
    available: ['31', '32', '33', '34', '35', '36', '37', '38', '39'],
    group: ['31'],
    family: ['36', '37', '38', '39'],
    honeymoon: ['32', '33', '34', '35'],
    custom: ['32', '33', '34', '35'],
    related: ['17', '1']
  },
  'vietnam': {
    available: ['61', '62', '63', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56'],
    group: ['61', '62', '63', '40', '41', '42', '43', '44', '45', '46'],
    family: ['53', '54', '55', '56'],
    honeymoon: ['41', '42', '43', '44'],
    custom: ['47', '48', '49', '50', '51', '52'],
    related: ['39', '1']
  },
  'sri-lanka': {
    available: ['sri-lanka-7n-8d'],
    group: [],
    family: ['sri-lanka-7n-8d'],
    honeymoon: [],
    custom: ['sri-lanka-7n-8d'],
    related: ['40', '61', '31']
  },
  // Default fallback
  default: {
    available: ['1'],
    group: [],
    family: [],
    honeymoon: [],
    custom: [],
    related: []
  }
};

// Page-specific trip card mappings for standalone pages
export const pageSectionMappings: Record<string, string[]> = {
  upcomingTours: ['WNDPI-RAJ-001', '61', '62', '63', '1', '2', '3', '4', '5', '6', '7', '8', '9', '29', '30', '31', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56'],
  honeymoonPackages: ['2', '6', '21', '22', '25', '32', '33', '34', '35', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56'],
  featured: ['61', '62', '63', '1', '9', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56']
}

// Helper function to get section mapping for a category
export const getSectionMapping = (categoryId: string) => {
  return sectionMappings[categoryId] || sectionMappings.default
}

// Helper function to get page-specific mappings for non-category pages
export const getPageSectionMapping = (pageName: string) => {
  return pageSectionMappings[pageName] || []
}

// Mapping of destination categories to 4 custom images to show on the right side of the itinerary/detail page gallery collage
export const destinationItineraryImages: Record<string, string[]> = {
  'himachal': [
    '/images/Himachal1.jpg',
    '/images/himachal2.jpg',
    '/images/himachal3.jpg',
    '/images/himachal4.jpg'
  ],
  'leh-ladakh': [
    '/images/LL1.PNG',
    '/images/LL2.jpg',
    '/images/LL3.jpg',
    '/images/LL4.PNG'
  ],
  'spiti': [
    '/images/spiti1.JPG',
    '/images/spiti2.JPG',
    '/images/spiti3.jpg',
    '/images/spiti5.JPG'
  ],
  'bhutan': [
    '/images/bhutan1.jpg',
    '/images/bhutan2.jpg',
    '/images/bhutan3.jpg',
    '/images/bhutan-cover3.PNG'
  ],
  'rajasthan': [
    '/images/Rajasthan/jaipur/amer-fort-jaipur.webp',
    '/images/Rajasthan/jaipur/hawa-mahal-jaipur.webp',
    '/images/Rajasthan/jaipur/nahargarh-fort-sunset.webp',
    '/images/Rajasthan/jaipur/city-palace-jaipur.webp',
    '/images/Rajasthan/jaipur/jal-mahal-sunset.webp',
    '/images/Rajasthan/udaipur/udaipur-city-palace-aerial.jpg',
    '/images/Rajasthan/udaipur/lake-pichola-view.jpg',
    '/images/Rajasthan/udaipur/lake-pichola-boat-ride.jpg',
    '/images/Rajasthan/jodhpur/jodhpur-overview-sunset.jpg',
    '/images/Rajasthan/jodhpur/mehrangarh-fort-jodhpur.jpg',
    '/images/Rajasthan/jaisalmer-city/jaisalmer-golden-fort.jpg',
    '/images/Rajasthan/jaisalmer-city/gadisar-lake-sunset.webp',
    '/images/Rajasthan/jaisalmer-desert/sam-sand-dunes-sunset.jpg',
    '/images/Rajasthan/jaisalmer-desert/camel-safari-desert.webp',
    '/images/Rajasthan/jawai/jawai-leopard-jeep-safari.jpg',
    '/images/Rajasthan/jawai/jawai-granite-hills-landscape.jpg'
  ],
  'singapore': [
    '/images/singapore1.jpg',
    '/images/singapore2.jpg',
    '/images/singapore3.jpg',
    '/images/singapore4.jpg'
  ],
  'vietnam': [
    '/images/vietnam.png',
    '/images/vietnam-beauty.png',
    '/images/vietnam-best.png',
    '/images/vietnam-dreamy.png'
  ],
  'bali': [
    '/images/bali.jpg',
    '/images/bali-group-trip.png',
    '/images/romantic-bali-getaway.png',
    '/images/honeymoon-special-bali.png'
  ],
  'thailand': [
    '/images/tomorrowland-thailand.jpg',
    '/images/thailand.jpg',
    '/images/tomorrowland-thailand-mobile.jpg',
    '/images/thailand-couple-leisure.png'
  ],
  'kashmir': [
    '/images/kashmir.jpg',
    '/images/dummy1.jpg',
    '/images/dummy2.jpg',
    '/images/dummy3.jpg'
  ],
  'sikkim': [
    '/images/sikkim.png',
    '/images/dummy1.jpg',
    '/images/dummy2.jpg',
    '/images/dummy3.jpg'
  ],
  'meghalaya': [
    '/images/meghalaya.jpg',
    'https://images.unsplash.com/photo-1565716665452-2a4e3445b378?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1654788111018-9096236d54ac?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521437620269-f477f5437820?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1698429358246-807d8972da9a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1613644383947-26a22b8c04f2?auto=format&fit=crop&w=1200&q=80'
  ],
  'sri-lanka': [
    '/images/srilanka/sigiriya-rock.jpg',
    '/images/srilanka/nine-arches-bridge.jpg',
    '/images/srilanka/nuwara-eliya.jpg',
    '/images/srilanka/mirissa-beach.jpg'
  ],
  'nepal': [
    '/images/nepal-dest.jpg',
    '/images/everest.jpg',
    '/images/dummy1.jpg',
    '/images/dummy2.jpg'
  ],
  'indonesia': [
    '/images/indonesia-dest.jpg',
    '/images/dummy1.jpg',
    '/images/dummy2.jpg',
    '/images/dummy3.jpg'
  ],
  'switzerland': [
    '/images/switzerland-dest.jpg',
    '/images/swiss.jpg',
    '/images/dummy1.jpg',
    '/images/dummy2.jpg'
  ],
  'peru': [
    '/images/peru-dest.jpg',
    '/images/dummy1.jpg',
    '/images/dummy2.jpg',
    '/images/dummy3.jpg'
  ],
  'japan': [
    '/images/japan.jpg',
    '/images/dummy1.jpg',
    '/images/dummy2.jpg',
    '/images/dummy3.jpg'
  ]
}