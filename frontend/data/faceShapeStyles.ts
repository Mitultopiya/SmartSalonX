// Static mapping of hairstyles and beards by face shape
export interface StyleData {
  id: string;
  name: string;
  category: 'hairstyle' | 'beard';
  description: string;
  image: string;
  tags: string[];
  price: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  maintenance: 'low' | 'medium' | 'high';
  suitability: string;
  whyItWorks: string;
}

export interface FaceShapeStyles {
  hairstyles: StyleData[];
  beards: StyleData[];
}

export const FACE_SHAPE_STYLES: Record<string, FaceShapeStyles> = {
  // OVAL FACE - Most versatile, can pull off most styles
  oval: {
    hairstyles: [
      {
        id: 'oval_pompadour',
        name: 'Classic Pompadour',
        category: 'hairstyle',
        description: 'Timeless style with volume on top and shorter sides, perfect for oval faces',
        image: '/styles/downloads/men/classic-pompadour-oval.jpg',
        tags: ['classic', 'versatile', 'professional', 'voluminous'],
        price: 600,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Oval faces have balanced proportions that complement the height and volume of a pompadour'
      },
      {
        id: 'oval_quiff',
        name: 'Modern Textured Quiff',
        category: 'hairstyle',
        description: 'Contemporary textured style with height and movement',
        image: '/styles/downloads/men/modern-quiff-oval.jpg',
        tags: ['modern', 'textured', 'trendy', 'versatile'],
        price: 500,
        duration: 40,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'The quiff adds height while maintaining the natural balance of oval face proportions'
      },
      {
        id: 'oval_side_part',
        name: 'Professional Side Part',
        category: 'hairstyle',
        description: 'Clean, professional look with deep side part',
        image: '/styles/downloads/men/professional-side-part-oval.jpg',
        tags: ['professional', 'classic', 'clean', 'workplace'],
        price: 400,
        duration: 30,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Side parts enhance the natural symmetry of oval faces'
      },
      {
        id: 'oval_crew_cut',
        name: 'Short Crew Cut',
        category: 'hairstyle',
        description: 'Classic short style that\'s easy to maintain',
        image: '/styles/downloads/men/short-crew-oval.jpg',
        tags: ['short', 'classic', 'low-maintenance', 'clean'],
        price: 300,
        duration: 20,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '85%',
        whyItWorks: 'The clean lines of a crew cut complement oval face proportions'
      }
    ],
    beards: [
      {
        id: 'oval_full_beard',
        name: 'Full Beard',
        category: 'beard',
        description: 'Complete beard growth for mature, distinguished look',
        image: '/styles/downloads/men/full-beard-oval.jpg',
        tags: ['full', 'mature', 'classic', 'distinguished'],
        price: 300,
        duration: 30,
        difficulty: 'medium',
        maintenance: 'high',
        suitability: '90%',
        whyItWorks: 'Full beards add character without overwhelming oval face proportions'
      },
      {
        id: 'oval_goatee',
        name: 'Classic Goatee',
        category: 'beard',
        description: 'Chin hair with mustache combination',
        image: '/styles/downloads/men/classic-goatee-oval.jpg',
        tags: ['classic', 'versatile', 'clean', 'professional'],
        price: 200,
        duration: 20,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Goatees add definition to the chin area of oval faces'
      },
      {
        id: 'oval_designer_stubble',
        name: 'Designer Stubble',
        category: 'beard',
        description: 'Precisely trimmed stubble for sophisticated look',
        image: '/styles/downloads/men/designer-stubble-oval.jpg',
        tags: ['designer', 'trimmed', 'sophisticated', 'modern'],
        price: 180,
        duration: 15,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '100%',
        whyItWorks: 'Light stubble enhances jawline definition without hiding natural oval shape'
      }
    ]
  },

  // ROUND FACE - Need styles that add height and angles
  round: {
    hairstyles: [
      {
        id: 'round_pompadour',
        name: 'High Volume Pompadour',
        category: 'hairstyle',
        description: 'Tall pompadour to add height and elongate the face',
        image: '/styles/downloads/men/high-volume-pompadour-round.jpg',
        tags: ['volume', 'height', 'elongating', 'modern'],
        price: 650,
        duration: 50,
        difficulty: 'hard',
        maintenance: 'high',
        suitability: '95%',
        whyItWorks: 'The height creates vertical lines that elongate round face features'
      },
      {
        id: 'round_quiff',
        name: 'Angular Quiff',
        category: 'hairstyle',
        description: 'Sharp, angular quiff to add definition',
        image: '/styles/downloads/men/angular-quiff-round.jpg',
        tags: ['angular', 'definition', 'modern', 'textured'],
        price: 550,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Angular texture breaks up the roundness and adds structure'
      },
      {
        id: 'round_spiky',
        name: 'Textured Spiky Style',
        category: 'hairstyle',
        description: 'Upward spikes to create vertical lines',
        image: '/styles/downloads/men/textured-spiky-round.jpg',
        tags: ['spiky', 'vertical', 'edgy', 'youthful'],
        price: 450,
        duration: 35,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Vertical spikes create elongating effect for round faces'
      },
      {
        id: 'round_undercut',
        name: 'High Fade Undercut',
        category: 'hairstyle',
        description: 'High undercut with volume on top',
        image: '/styles/downloads/men/high-fade-undercut-round.jpg',
        tags: ['undercut', 'fade', 'volume', 'modern'],
        price: 500,
        duration: 40,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '80%',
        whyItWorks: 'The contrast between short sides and voluminous top elongates the face'
      }
    ],
    beards: [
      {
        id: 'round_angular_beard',
        name: 'Angular Beard',
        category: 'beard',
        description: 'Beard with sharp angles to add definition',
        image: '/styles/downloads/men/angular-beard-round.jpg',
        tags: ['angular', 'definition', 'structured', 'modern'],
        price: 250,
        duration: 25,
        difficulty: 'medium',
        maintenance: 'high',
        suitability: '90%',
        whyItWorks: 'Angular lines counteract the softness of round faces'
      },
      {
        id: 'round_extended_goatee',
        name: 'Extended Goatee',
        category: 'beard',
        description: 'Longer goatee to elongate the face',
        image: '/styles/downloads/men/extended-goatee-round.jpg',
        tags: ['elongating', 'extended', 'modern', 'defined'],
        price: 220,
        duration: 20,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'The vertical length of an extended goatee elongates round face proportions'
      },
      {
        id: 'round_stubble',
        name: 'Heavy Stubble',
        category: 'beard',
        description: 'Denser stubble to add angular definition',
        image: '/styles/downloads/men/heavy-stubble-round.jpg',
        tags: ['heavy', 'stubble', 'definition', 'masculine'],
        price: 150,
        duration: 15,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '95%',
        whyItWorks: 'Heavy stubble adds shadow and definition to soften round features'
      }
    ]
  },

  // SQUARE FACE - Strong jawline, need styles that soften angles
  square: {
    hairstyles: [
      {
        id: 'square_textured_crop',
        name: 'Textured Crop',
        category: 'hairstyle',
        description: 'Soft textured crop to balance strong jawline',
        image: '/styles/downloads/men/textured-crop-square.jpg',
        tags: ['textured', 'soft', 'balanced', 'modern'],
        price: 450,
        duration: 35,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '95%',
        whyItWorks: 'Texture softens the angular features of square faces'
      },
      {
        id: 'square_wavy_quiff',
        name: 'Wavy Modern Quiff',
        category: 'hairstyle',
        description: 'Soft waves with quiff to add movement',
        image: '/styles/downloads/men/wavy-modern-quiff-square.jpg',
        tags: ['wavy', 'soft', 'movement', 'contemporary'],
        price: 500,
        duration: 40,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Waves add softness and movement to balance strong jawline'
      },
      {
        id: 'square_side_swept',
        name: 'Side Swept Fringe',
        category: 'hairstyle',
        description: 'Longer fringe swept to one side',
        image: '/styles/downloads/men/side-swept-fringe-square.jpg',
        tags: ['fringe', 'swept', 'softening', 'versatile'],
        price: 400,
        duration: 30,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Side-swept fringe breaks up the square face lines'
      },
      {
        id: 'square_layered',
        name: 'Layered Medium Style',
        category: 'hairstyle',
        description: 'Medium length with layers for softness',
        image: '/styles/downloads/men/layered-medium-square.jpg',
        tags: ['layered', 'medium', 'soft', 'professional'],
        price: 550,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '80%',
        whyItWorks: 'Layers create movement and soften angular features'
      }
    ],
    beards: [
      {
        id: 'square_rounded_beard',
        name: 'Rounded Beard',
        category: 'beard',
        description: 'Beard with rounded edges to soften jawline',
        image: '/styles/downloads/men/rounded-beard-square.jpg',
        tags: ['rounded', 'soft', 'balanced', 'professional'],
        price: 280,
        duration: 30,
        difficulty: 'medium',
        maintenance: 'high',
        suitability: '95%',
        whyItWorks: 'Rounded edges complement and soften the strong square jawline'
      },
      {
        id: 'square_short_boxed',
        name: 'Short Boxed Beard',
        category: 'beard',
        description: 'Neatly trimmed boxed beard',
        image: '/styles/downloads/men/short-boxed-beard-square.jpg',
        tags: ['boxed', 'neat', 'structured', 'classic'],
        price: 250,
        duration: 25,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Boxed shape works with square face structure while maintaining balance'
      },
      {
        id: 'square_van_dyke',
        name: 'Van Dyke Style',
        category: 'beard',
        description: 'Pointed beard with floating mustache',
        image: '/styles/downloads/men/van-dyke-square.jpg',
        tags: ['van-dyke', 'pointed', 'classic', 'elegant'],
        price: 200,
        duration: 20,
        difficulty: 'medium',
        maintenance: 'high',
        suitability: '85%',
        whyItWorks: 'The pointed shape adds vertical lines to balance square proportions'
      }
    ]
  },

  // HEART FACE - Wider forehead, need styles that balance proportions
  heart: {
    hairstyles: [
      {
        id: 'heart_textured_fringe',
        name: 'Textured Fringe Style',
        category: 'hairstyle',
        description: 'Textured fringe to balance wider forehead',
        image: '/styles/downloads/men/textured-fringe-heart.jpg',
        tags: ['fringe', 'textured', 'balancing', 'modern'],
        price: 450,
        duration: 35,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Fringe reduces the appearance of a wider forehead'
      },
      {
        id: 'heart_side_part',
        name: 'Deep Side Part',
        category: 'hairstyle',
        description: 'Side part with volume on sides',
        image: '/styles/downloads/men/deep-side-part-heart.jpg',
        tags: ['side-part', 'volume', 'balancing', 'classic'],
        price: 400,
        duration: 30,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '90%',
        whyItWorks: 'Side part creates asymmetry that balances heart face proportions'
      },
      {
        id: 'heart_wavy_shag',
        name: 'Modern Wavy Shag',
        category: 'hairstyle',
        description: 'Layered wavy style for balance',
        image: '/styles/downloads/men/modern-wavy-shag-heart.jpg',
        tags: ['wavy', 'shag', 'layered', 'contemporary'],
        price: 550,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Layers and waves add width at the jaw to balance forehead'
      },
      {
        id: 'heart_curls',
        name: 'Soft Curls',
        category: 'hairstyle',
        description: 'Gentle curls to add softness and balance',
        image: '/styles/downloads/men/soft-curls-heart (2).jpg',
        tags: ['curls', 'soft', 'balanced', 'romantic'],
        price: 600,
        duration: 50,
        difficulty: 'hard',
        maintenance: 'high',
        suitability: '80%',
        whyItWorks: 'Curls add width at the jawline to balance the wider forehead'
      }
    ],
    beards: [
      {
        id: 'heart_full_beard',
        name: 'Full Rounded Beard',
        category: 'beard',
        description: 'Full beard with rounded shape to balance jaw',
        image: '/styles/downloads/men/full-rounded-beard-heart.jpg',
        tags: ['full', 'rounded', 'balancing', 'mature'],
        price: 320,
        duration: 35,
        difficulty: 'medium',
        maintenance: 'high',
        suitability: '95%',
        whyItWorks: 'Full beard adds width to the jaw area to balance wider forehead'
      },
      {
        id: 'heart_anchored',
        name: 'Anchor Beard',
        category: 'beard',
        description: 'Anchor shape to define jawline',
        image: '/styles/downloads/men/anchor-beard-heart.jpg',
        tags: ['anchor', 'defined', 'modern', 'clean'],
        price: 200,
        duration: 20,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Anchor shape adds definition to the narrower jaw area'
      },
      {
        id: 'heart_circle_beard',
        name: 'Circle Beard',
        category: 'beard',
        description: 'Rounded circle beard for balance',
        image: '/styles/downloads/men/circle-beard-heart.jpg',
        tags: ['circle', 'rounded', 'balanced', 'classic'],
        price: 250,
        duration: 25,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Circle shape adds width to the jaw to balance heart proportions'
      }
    ]
  },

  // DIAMOND FACE - Prominent cheekbones, need styles that complement angles
  diamond: {
    hairstyles: [
      {
        id: 'diamond_side_swept',
        name: 'Side Swept Style',
        category: 'hairstyle',
        description: 'Side swept to complement prominent cheekbones',
        image: '/styles/downloads/men/side-swept-diamond.jpg',
        tags: ['side-swept', 'elegant', 'cheekbones', 'sophisticated'],
        price: 500,
        duration: 40,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Side sweeping highlights and complements diamond face cheekbones'
      },
      {
        id: 'diamond_textured_medium',
        name: 'Textured Medium Length',
        category: 'hairstyle',
        description: 'Medium length with texture for balance',
        image: '/styles/downloads/men/textured-medium-diamond.jpg',
        tags: ['textured', 'medium', 'balanced', 'versatile'],
        price: 550,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Medium length adds balance without hiding cheekbone structure'
      },
      {
        id: 'diamond_classic_cut',
        name: 'Classic Short Cut',
        category: 'hairstyle',
        description: 'Clean short cut to showcase features',
        image: '/styles/downloads/men/classic-short-diamond.jpg',
        tags: ['classic', 'short', 'clean', 'showcases'],
        price: 350,
        duration: 25,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '85%',
        whyItWorks: 'Short cut showcases the beautiful diamond face structure'
      },
      {
        id: 'diamond_layered',
        name: 'Soft Layered Style',
        category: 'hairstyle',
        description: 'Gentle layers to soften angles',
        image: '/styles/downloads/men/soft-layered-diamond.jpg',
        tags: ['layered', 'soft', 'angles', 'elegant'],
        price: 600,
        duration: 50,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '80%',
        whyItWorks: 'Layers soften the angles while maintaining diamond face beauty'
      }
    ],
    beards: [
      {
        id: 'diamond_stubble',
        name: 'Designer Stubble',
        category: 'beard',
        description: 'Light stubble to enhance features',
        image: '/styles/downloads/men/designer-stubble-diamond.jpg',
        tags: ['designer', 'light', 'enhancing', 'modern'],
        price: 180,
        duration: 15,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Light stubble enhances features without hiding diamond face structure'
      },
      {
        id: 'diamond_goatee',
        name: 'Sleek Goatee',
        category: 'beard',
        description: 'Clean goatee for definition',
        image: '/styles/downloads/men/sleek-goatee-diamond.jpg',
        tags: ['sleek', 'clean', 'defined', 'modern'],
        price: 200,
        duration: 20,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Clean goatee adds definition without overwhelming diamond proportions'
      },
      {
        id: 'diamond_soul_patch',
        name: 'Soul Patch Style',
        category: 'beard',
        description: 'Small soul patch for subtle definition',
        image: '/styles/downloads/men/soul-patch-diamond.jpg',
        tags: ['soul-patch', 'subtle', 'minimal', 'clean'],
        price: 150,
        duration: 15,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '85%',
        whyItWorks: 'Minimal style adds subtle definition without hiding features'
      }
    ]
  },

  // OBLONG FACE - Longer face, need styles that add width
  oblong: {
    hairstyles: [
      {
        id: 'oblong_wavy_crew',
        name: 'Wavy Crew Cut',
        category: 'hairstyle',
        description: 'Crew cut with waves to add width',
        image: '/styles/downloads/men/wavy-crew-oblong.jpg',
        tags: ['wavy', 'width', 'balanced', 'modern'],
        price: 450,
        duration: 35,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Waves add horizontal width to balance the longer face shape'
      },
      {
        id: 'oblong_side_part',
        name: 'Full Side Part',
        category: 'hairstyle',
        description: 'Side part with volume on sides',
        image: '/styles/downloads/men/full-side-part-oblong.jpg',
        tags: ['side-part', 'volume', 'width', 'classic'],
        price: 400,
        duration: 30,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Side volume creates horizontal lines to balance face length'
      },
      {
        id: 'oblong_textured_crop',
        name: 'Wide Textured Crop',
        category: 'hairstyle',
        description: 'Textured crop with horizontal emphasis',
        image: '/styles/downloads/men/wide-textured-crop-oblong.jpg',
        tags: ['wide', 'textured', 'horizontal', 'contemporary'],
        price: 500,
        duration: 40,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Wide crop adds horizontal width to balance vertical length'
      },
      {
        id: 'oblong_curly',
        name: 'Curly Side Style',
        category: 'hairstyle',
        description: 'Curly style with side volume',
        image: '/styles/downloads/men/curly-side-oblong.jpg',
        tags: ['curly', 'volume', 'width', 'natural'],
        price: 600,
        duration: 50,
        difficulty: 'hard',
        maintenance: 'high',
        suitability: '80%',
        whyItWorks: 'Natural curl volume adds width to balance oblong proportions'
      }
    ],
    beards: [
      {
        id: 'oblong_full_beard',
        name: 'Full Wide Beard',
        category: 'beard',
        description: 'Full beard with width emphasis',
        image: '/styles/downloads/men/full-wide-beard-oblong.jpg',
        tags: ['full', 'wide', 'balancing', 'substantial'],
        price: 350,
        duration: 35,
        difficulty: 'medium',
        maintenance: 'high',
        suitability: '95%',
        whyItWorks: 'Full beard adds horizontal width to balance the longer face'
      },
      {
        id: 'oblong_boxed_beard',
        name: 'Extended Boxed Beard',
        category: 'beard',
        description: 'Boxed beard with extended width',
        image: '/styles/downloads/men/extended-boxed-beard-oblong.jpg',
        tags: ['boxed', 'extended', 'width', 'structured'],
        price: 280,
        duration: 30,
        difficulty: 'medium',
        maintenance: 'high',
        suitability: '90%',
        whyItWorks: 'Extended width adds horizontal balance to oblong face'
      },
      {
        id: 'oblong_circle_beard',
        name: 'Wide Circle Beard',
        category: 'beard',
        description: 'Circle beard with width emphasis',
        image: '/styles/downloads/men/wide-circle-beard-oblong.jpg',
        tags: ['circle', 'wide', 'balanced', 'rounded'],
        price: 250,
        duration: 25,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Wide circle adds horizontal dimension to balance face length'
      }
    ]
  }
};

// Helper function to get styles by face shape
export const getStylesByFaceShape = (faceShape: string): FaceShapeStyles => {
  return FACE_SHAPE_STYLES[faceShape.toLowerCase()] || FACE_SHAPE_STYLES.oval;
};

// Helper function to get all styles for a face shape
export const getAllStylesForFaceShape = (faceShape: string): StyleData[] => {
  const faceShapeStyles = getStylesByFaceShape(faceShape);
  return [...faceShapeStyles.hairstyles, ...faceShapeStyles.beards];
};

// Helper function to get hairstyles only
export const getHairstylesForFaceShape = (faceShape: string): StyleData[] => {
  return getStylesByFaceShape(faceShape).hairstyles;
};

// Helper function to get beards only
export const getBeardsForFaceShape = (faceShape: string): StyleData[] => {
  return getStylesByFaceShape(faceShape).beards;
};
