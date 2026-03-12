// Local style data with base64 encoded images or local paths
export const localHairstyles = [
  {
    id: 'hair_classic_professional',
    name: 'Classic Professional Cut',
    category: 'hairstyle' as const,
    type: 'professional' as const,
    imageUrl: '/styles/hairstyles/classic-professional.jpg',
    description: 'Timeless professional hairstyle suitable for business settings',
    price: 1500,
    duration: 45,
    popularity: 85,
    compatibleFaceShapes: ['oval', 'square']
  },
  {
    id: 'hair_executive_trim',
    name: 'Executive Trim',
    category: 'hairstyle' as const,
    type: 'professional' as const,
    imageUrl: '/styles/hairstyles/executive-trim.jpg',
    description: 'Sharp executive look with clean lines',
    price: 1200,
    duration: 30,
    popularity: 78,
    compatibleFaceShapes: ['square', 'oval']
  },
  {
    id: 'hair_business_professional',
    name: 'Business Professional',
    category: 'hairstyle' as const,
    type: 'professional' as const,
    imageUrl: '/styles/hairstyles/business-professional.jpg',
    description: 'Professional style for corporate environment',
    price: 1400,
    duration: 40,
    popularity: 82,
    compatibleFaceShapes: ['oval', 'heart']
  },
  {
    id: 'hair_modern_trendy',
    name: 'Modern Trendy Style',
    category: 'hairstyle' as const,
    type: 'trendy' as const,
    imageUrl: '/styles/hairstyles/modern-trendy.jpg',
    description: 'Contemporary style for fashion-forward individuals',
    price: 2000,
    duration: 60,
    popularity: 92,
    compatibleFaceShapes: ['oval', 'heart', 'diamond']
  },
  {
    id: 'hair_fashion_forward',
    name: 'Fashion Forward Cut',
    category: 'hairstyle' as const,
    type: 'trendy' as const,
    imageUrl: '/styles/hairstyles/fashion-forward.jpg',
    description: 'Edgy urban style for modern lifestyle',
    price: 2500,
    duration: 75,
    popularity: 88,
    compatibleFaceShapes: ['round', 'diamond']
  },
  {
    id: 'hair_celebrity_style',
    name: 'Celebrity Inspired',
    category: 'hairstyle' as const,
    type: 'trendy' as const,
    imageUrl: '/styles/hairstyles/celebrity-style.jpg',
    description: 'Celebrity-inspired trendy hairstyle',
    price: 2200,
    duration: 70,
    popularity: 90,
    compatibleFaceShapes: ['oval', 'square']
  }
];

export const localBeardStyles = [
  {
    id: 'beard_professional_trim',
    name: 'Professional Beard Trim',
    category: 'beard' as const,
    type: 'professional' as const,
    imageUrl: '/styles/beards/professional-trim.jpg',
    description: 'Well-groomed professional beard style',
    price: 800,
    duration: 30,
    popularity: 82,
    compatibleFaceShapes: ['oval', 'square']
  },
  {
    id: 'beard_executive_beard',
    name: 'Executive Beard',
    category: 'beard' as const,
    type: 'professional' as const,
    imageUrl: '/styles/beards/executive-beard.jpg',
    description: 'Sophisticated beard for corporate environment',
    price: 1000,
    duration: 35,
    popularity: 75,
    compatibleFaceShapes: ['square', 'round']
  },
  {
    id: 'beard_business_beard',
    name: 'Business Beard',
    category: 'beard' as const,
    type: 'professional' as const,
    imageUrl: '/styles/beards/business-beard.jpg',
    description: 'Professional business beard style',
    price: 900,
    duration: 32,
    popularity: 78,
    compatibleFaceShapes: ['oval', 'heart']
  },
  {
    id: 'beard_modern_design',
    name: 'Modern Beard Design',
    category: 'beard' as const,
    type: 'trendy' as const,
    imageUrl: '/styles/beards/modern-design.jpg',
    description: 'Contemporary beard with sharp lines',
    price: 1200,
    duration: 45,
    popularity: 90,
    compatibleFaceShapes: ['heart', 'diamond']
  },
  {
    id: 'beard_celebrity_beard',
    name: 'Celebrity Beard Style',
    category: 'beard' as const,
    type: 'trendy' as const,
    imageUrl: '/styles/beards/celebrity-beard.jpg',
    description: 'Celebrity-inspired trendy beard',
    price: 1500,
    duration: 50,
    popularity: 87,
    compatibleFaceShapes: ['oval', 'heart']
  },
  {
    id: 'beard_fashion_beard',
    name: 'Fashion Forward Beard',
    category: 'beard' as const,
    type: 'trendy' as const,
    imageUrl: '/styles/beards/fashion-beard.jpg',
    description: 'Stylish beard for fashion-conscious individuals',
    price: 1300,
    duration: 48,
    popularity: 85,
    compatibleFaceShapes: ['square', 'diamond']
  }
];

// Fallback SVG-based style images (base64 encoded simple representations)
export const fallbackStyleImages = {
  'hair_classic_professional': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iIzMzNzMzMyIvPgo8cGF0aCBkPSJNMTAwIDE1MCBRMTUwIDEwMCAyMDAgMTUwIiBzdHJva2U9IiMyMjIyMjIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTEwMCAxNTAgTDEwMCAyMjAiIHN0cm9rZT0iIzIyMjIyMiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwIEwyMDAgMjIwIiBzdHJva2U9IiMyMjIyMjIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSIxMCIgZmlsbD0iIzY2NjY2NiIvPgo8L3N2Zz4K',
  'hair_modern_trendy': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkY2QzYiLz4KPHBhdGggZD0iTTEwMCAxMjAgTDE1MCAxMDAgTDIwMCAxMjAgTDIwMCAxODAgTDE1MCAyMDAgTDEwMCAxODAgWiIgZmlsbD0iIzMzMzMzMyIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjEwMCIgZmlsbD0iIzY2NjY2NiIvPgo8L3N2Zz4K',
  'beard_professional_trim': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMTgwIFEyMDAgMTgwIDIwMCAyMjAgTDEyMCAyMjAgWiIgZmlsbD0iIzMzMzMzMyIvPgo8Y2lyY2xlIGN4PSIxNjAiIGN5PSIxNjAiIHI9IjgwIiBmaWxsPSIjNjY2NjY2Ii8+CjwvZG9jPgo8L3N2Zz4K'
};
