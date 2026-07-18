// Central mapping system for trip sections by category
// This controls which trips appear in which sections on category pages
export const sectionMappings: Record<string, Record<string, string[]>> = {
  'leh-ladakh': {
    available: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '29', '30'], // Available Packages - Leh Ladakh trips
    family: ['1', '2', '3', '4', '5', '6', '29', '30'], // Family Packages
    custom: ['7'], // Customized Packages
    related: ['8'], // Other India Destinations
    related2: ['9'] // Additional Related Packages
  },
  'kashmir': {
    available: ['22'],
    family: ['22'],
    custom: ['22'],
    related: ['19', '10', '1']
  },
  'switzerland': {
    available: ['1', '9'],
    family: ['10', '11'],
    custom: ['12', '13'],
    related: ['14', '15']
  },
  'indonesia': {
    available: ['1', '17'],
    family: ['18', '19'],
    custom: ['20', '21'],
    related: ['22', '23']
  },
  'bali': {
    available: ['57', '58', '59', '60'],
    family: ['57'],
    custom: ['58', '59', '60'],
    related: ['23', '40', '31']
  },
  'bhutan': {
    available: ['15', '16', '17', '18'],
    family: ['15', '17'],
    custom: ['16', '18'],
    related: ['59', '23']
  },
  'himachal': {
    available: ['19', '20', '21'],
    family: ['19', '20'],
    custom: ['21'],
    related: ['38', '39']
  },
  'iceland': {
    available: ['1', '41'],
    family: ['42', '43'],
    custom: ['44', '45'],
    related: ['46', '47']
  },
  'japan': {
    available: ['1', '49'],
    family: ['50', '51'],
    custom: ['52', '53'],
    related: ['54', '55']
  },
  'meghalaya': {
    available: ['1', '57'],
    family: ['58', '59'],
    custom: ['60', '73'],
    related: ['74', '75']
  },
  'nepal': {
    available: ['1', '77'],
    family: ['78', '79'],
    custom: ['80', '81'],
    related: ['82', '83']
  },
  'singapore': {
    available: ['23'],
    family: ['23'],
    custom: ['23'],
    related: ['1', '15']
  },
  'peru': {
    available: ['1', '85'],
    family: ['86', '87'],
    custom: ['88', '89'],
    related: ['90', '91']
  },
  'spiti': {
    available: ['WNDPI-WSP-001', 'WNDPI-SSP-001', 'WNDPI-SSP-002', 'WNDPI-SSP-003', 'WNDPI-SSP-004'],
    family: ['WNDPI-WSP-001', 'WNDPI-SSP-001', 'WNDPI-SSP-002', 'WNDPI-SSP-003', 'WNDPI-SSP-004'],
    custom: [],
    related: []
  },
  'sikkim': {
    available: ['24', '25', '26', '27', '28'],
    family: ['24', '26'],
    custom: ['25', '27', '28'],
    related: ['1', '10', '22']
  },
  'thailand': {
    available: ['31', '32', '33', '34', '35', '36', '37', '38', '39'],
    group: ['31'],
    family: ['36', '37', '38', '39'],
    custom: ['32', '33', '34', '35'],
    related: ['17', '1']
  },
  'vietnam': {
    available: ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56'],
    group: ['40', '41', '42', '43', '44', '45', '46'],
    family: ['53', '54', '55', '56'],
    custom: ['47', '48', '49', '50', '51', '52'],
    related: ['39', '1']
  },
  // Default fallback
  default: {
    available: ['1'],
    family: [],
    custom: [],
    related: []
  }
}

// Page-specific trip card mappings for standalone pages
export const pageSectionMappings: Record<string, string[]> = {
  upcomingTours: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '29', '30', '31', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56'],
  honeymoonPackages: ['2', '6', '21', '22', '25', '32', '33', '34', '35', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56'],
  featured: ['1', '9', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56']
}

// Helper function to get section mapping for a category
export const getSectionMapping = (categoryId: string) => {
  return sectionMappings[categoryId] || sectionMappings.default
}

// Helper function to get page-specific mappings for non-category pages
export const getPageSectionMapping = (pageName: string) => {
  return pageSectionMappings[pageName] || []
}