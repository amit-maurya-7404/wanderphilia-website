// Central mapping system for trip sections by category
// This controls which trips appear in which sections on category pages
export const sectionMappings: Record<string, Record<string, string[]>> = {
  'leh-ladakh': {
    available: ['13', '14', '15', '16', '17', '18', '19', '20', '21', '41', '42'], // Available Packages - Leh Ladakh trips
    family: ['13', '14', '15', '16', '17', '18', '41', '42'], // Family Packages
    custom: ['19'], // Customized Packages
    related: ['20'], // Other India Destinations
    related2: ['21'] // Additional Related Packages
  },
  'kashmir': {
    available: ['34'],
    family: ['34'],
    custom: ['34'],
    related: ['31', '22', '13']
  },
  'switzerland': {
    available: ['13', '21'],
    family: ['22', '23'],
    custom: ['24', '25'],
    related: ['26', '27']
  },
  'indonesia': {
    available: ['13', '29'],
    family: ['30', '31'],
    custom: ['32', '33'],
    related: ['34', '35']
  },
  'bhutan': {
    available: ['27', '28', '29', '30'],
    family: ['27', '29'],
    custom: ['28', '30'],
    related: ['12']
  },
  'himachal': {
    available: ['31', '32', '33'],
    family: ['31', '32'],
    custom: ['33'],
    related: ['50', '51']
  },
  'iceland': {
    available: ['13', '53'],
    family: ['54', '55'],
    custom: ['56', '57'],
    related: ['58', '59']
  },
  'japan': {
    available: ['13', '61'],
    family: ['62', '63'],
    custom: ['64', '65'],
    related: ['66', '67']
  },
  'meghalaya': {
    available: ['13', '69'],
    family: ['70', '71'],
    custom: ['72', '73'],
    related: ['74', '75']
  },
  'nepal': {
    available: ['13', '77'],
    family: ['78', '79'],
    custom: ['80', '81'],
    related: ['82', '83']
  },
  'singapore': {
    available: ['35'],
    family: ['35'],
    custom: ['35'],
    related: ['13', '27']
  },
  'peru': {
    available: ['13', '85'],
    family: ['86', '87'],
    custom: ['88', '89'],
    related: ['90', '91']
  },
  'spiti': {
    available: ['22', '23', '24', '25', '26'],
    family: ['22', '23', '24', '25', '26'],
    custom: [],
    related: []
  },
  'sikkim': {
    available: ['36', '37', '38', '39', '40'],
    family: ['36', '38'],
    custom: ['37', '39', '40'],
    related: ['13', '22', '34']
  },
  'thailand': {
    available: ['43', '44'],
    family: ['44'],
    custom: ['43', '44'],
    related: ['29', '13']
  },
  // Default fallback
  default: {
    available: ['13', '2'],
    family: ['3', '4'],
    custom: ['5', '6'],
    related: ['7', '8']
  }
}

// Page-specific trip card mappings for standalone pages
export const pageSectionMappings: Record<string, string[]> = {
  upcomingTours: ['13', '14', '15', '16', '17', '18', '19', '20', '21', '41', '42', '43'],
  honeymoonPackages: ['2', '5', '6', '9', '10', '11', '12', '14', '18', '33', '34', '37', '44'],
  featured: ['13', '12', '21']
}

// Helper function to get section mapping for a category
export const getSectionMapping = (categoryId: string) => {
  return sectionMappings[categoryId] || sectionMappings.default
}

// Helper function to get page-specific mappings for non-category pages
export const getPageSectionMapping = (pageName: string) => {
  return pageSectionMappings[pageName] || []
}