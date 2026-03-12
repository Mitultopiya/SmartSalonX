// Women's Face Shape Styles
export interface WomenStyleData {
  id: string;
  name: string;
  category: 'hairstyle' | 'treatment' | 'coloring' | 'styling';
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

export interface WomenFaceShapeStyles {
  hairstyles: WomenStyleData[];
  treatments: WomenStyleData[];
  coloring: WomenStyleData[];
  styling: WomenStyleData[];
}

export const WOMEN_FACE_SHAPE_STYLES: Record<string, WomenFaceShapeStyles> = {
  // OVAL FACE - Most versatile, can pull off most styles
  oval: {
    hairstyles: [
      {
        id: 'oval_long_layers',
        name: 'Long Layered Hair',
        category: 'hairstyle',
        description: 'Beautiful long layers that frame the face perfectly',
        image: '/styles/downloads/women/long-layers-oval.jpg',
        tags: ['long', 'layers', 'versatile', 'elegant'],
        price: 800,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Oval faces have perfect proportions for long layered styles'
      },
      {
        id: 'oval_bob',
        name: 'Classic Bob',
        category: 'hairstyle',
        description: 'Timeless bob cut that highlights facial features',
        image: '/styles/downloads/women/bob-oval.jpg',
        tags: ['bob', 'classic', 'professional', 'timeless'],
        price: 600,
        duration: 45,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '100%',
        whyItWorks: 'Bob cuts complement the balanced proportions of oval faces'
      },
      {
        id: 'oval_waves',
        name: 'Beach Waves',
        category: 'styling',
        description: 'Relaxed beach waves for natural beauty',
        image: '/styles/downloads/women/beach-waves-oval.jpg',
        tags: ['waves', 'beach', 'natural', 'casual'],
        price: 400,
        duration: 30,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Soft waves enhance the natural balance of oval faces'
      },
      {
        id: 'oval_ponytail',
        name: 'High Ponytail',
        category: 'styling',
        description: 'Sleek high ponytail for elegant look',
        image: '/styles/downloads/women/high-ponytail-oval.jpg',
        tags: ['ponytail', 'high', 'elegant', 'versatile'],
        price: 300,
        duration: 20,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '85%',
        whyItWorks: 'High ponytails showcase oval face symmetry'
      }
    ],
    treatments: [
      {
        id: 'oval_keratin',
        name: 'Keratin Treatment',
        category: 'treatment',
        description: 'Smooth, frizz-free hair with natural movement',
        image: '/styles/downloads/women/keratin-treatment-oval.jpg',
        tags: ['keratin', 'smooth', 'frizz-free', 'treatment'],
        price: 2500,
        duration: 120,
        difficulty: 'hard',
        maintenance: 'low',
        suitability: '95%',
        whyItWorks: 'Keratin treatment enhances natural oval face beauty'
      },
      {
        id: 'oval_deep_conditioning',
        name: 'Deep Conditioning',
        category: 'treatment',
        description: 'Intensive moisture treatment for healthy hair',
        image: '/styles/downloads/women/deep-conditioning-oval.jpg',
        tags: ['conditioning', 'moisture', 'health', 'treatment'],
        price: 800,
        duration: 45,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Healthy hair enhances any oval face hairstyle'
      }
    ],
    coloring: [
      {
        id: 'oval_balayage',
        name: 'Balayage Highlights',
        category: 'coloring',
        description: 'Natural-looking sun-kissed highlights',
        image: '/styles/downloads/women/balayage-oval.jpg',
        tags: ['balayage', 'highlights', 'natural', 'sun-kissed'],
        price: 1800,
        duration: 90,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Balayage adds dimension without overwhelming oval features'
      },
      {
        id: 'oval_ombre',
        name: 'Ombre Color',
        category: 'coloring',
        description: 'Gradual color transition from dark to light',
        image: '/styles/downloads/women/ombre-oval.jpg',
        tags: ['ombre', 'gradient', 'transition', 'trendy'],
        price: 1500,
        duration: 75,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Ombre creates vertical lines that complement oval faces'
      }
    ],
    styling: [
      {
        id: 'oval_blowout',
        name: 'Professional Blowout',
        category: 'styling',
        description: 'Salon-quality blowout for smooth, voluminous hair',
        image: '/styles/downloads/women/beach-waves-oval.jpg',
        tags: ['blowout', 'smooth', 'volume', 'professional'],
        price: 600,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Blowouts enhance the natural symmetry of oval faces'
      },
      {
        id: 'oval_updo',
        name: 'Elegant Updo',
        category: 'styling',
        description: 'Sophisticated updo for special occasions',
        image: '/styles/downloads/women/high-ponytail-oval.jpg',
        tags: ['updo', 'elegant', 'formal', 'special-occasion'],
        price: 800,
        duration: 60,
        difficulty: 'hard',
        maintenance: 'low',
        suitability: '95%',
        whyItWorks: 'Updos showcase the beautiful proportions of oval faces'
      }
    ]
  },

  // ROUND FACE - Need styles that add height and angles
  round: {
    hairstyles: [
      {
        id: 'round_long_layers',
        name: 'Long V-Cut Layers',
        category: 'hairstyle',
        description: 'V-shaped layers to elongate the face',
        image: '/styles/downloads/women/long-v-cut-layers-round.jpg',
        tags: ['v-cut', 'layers', 'elongating', 'long'],
        price: 900,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'V-cut creates vertical lines that elongate round faces'
      },
      {
        id: 'round_angled_bob',
        name: 'Angled Bob',
        category: 'hairstyle',
        description: 'Bob with angled front to add height',
        image: '/styles/downloads/women/angled-bob-round.jpg',
        tags: ['angled', 'bob', 'height', 'modern'],
        price: 700,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Angled front creates vertical elongation for round faces'
      },
      {
        id: 'round_pixie',
        name: 'Layered Pixie Cut',
        category: 'hairstyle',
        description: 'Short pixie with layers for texture and height',
        image: '/styles/downloads/women/layered-pixie-round.jpg',
        tags: ['pixie', 'short', 'layers', 'texture'],
        price: 500,
        duration: 30,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '85%',
        whyItWorks: 'Pixie cuts add height and break up roundness'
      },
      {
        id: 'round_side_part',
        name: 'Deep Side Part',
        category: 'styling',
        description: 'Deep side part to create asymmetry',
        image: '/styles/downloads/women/deep-side-part-round.jpg',
        tags: ['side-part', 'deep', 'asymmetry', 'volume'],
        price: 400,
        duration: 30,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '80%',
        whyItWorks: 'Side part creates diagonal lines to elongate round faces'
      }
    ],
    treatments: [
      {
        id: 'round_volume_treatment',
        name: 'Volume Boost Treatment',
        category: 'treatment',
        description: 'Treatment to add natural volume and lift',
        image: '/styles/downloads/women/volume-boost-round.jpg',
        tags: ['volume', 'lift', 'boost', 'treatment'],
        price: 1200,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Volume adds height to balance round face proportions'
      },
      {
        id: 'round_texturizing',
        name: 'Texturizing Treatment',
        category: 'treatment',
        description: 'Adds texture and movement to flat hair',
        image: '/styles/downloads/women/texturizing-round.jpg',
        tags: ['texture', 'movement', 'texturizing', 'treatment'],
        price: 800,
        duration: 45,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Texture breaks up roundness and adds definition'
      }
    ],
    coloring: [
      {
        id: 'round_vertical_highlights',
        name: 'Vertical Highlights',
        category: 'coloring',
        description: 'Vertical highlights to create elongating effect',
        image: '/styles/downloads/women/vertical-highlights-round.jpg',
        tags: ['vertical', 'highlights', 'elongating', 'dimension'],
        price: 1600,
        duration: 75,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Vertical highlights create elongating lines for round faces'
      },
      {
        id: 'round_root_melt',
        name: 'Root Melt Color',
        category: 'coloring',
        description: 'Soft root melt for natural dimension',
        image: '/styles/downloads/women/root-melt-round.jpg',
        tags: ['root-melt', 'natural', 'dimension', 'soft'],
        price: 1400,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Root melt adds depth without adding width'
      }
    ],
    styling: [
      {
        id: 'round_high_volume',
        name: 'High Volume Blowout',
        category: 'styling',
        description: 'Blowout with maximum volume at crown',
        image: '/styles/downloads/women/texturizing-round.jpg',
        tags: ['high-volume', 'crown', 'blowout', 'height'],
        price: 700,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Height at crown elongates round face proportions'
      },
      {
        id: 'round_textured_updo',
        name: 'Textured Updo',
        category: 'styling',
        description: 'Updo with height and texture',
        image: '/styles/downloads/women/texturizing-round.jpg',
        tags: ['updo', 'textured', 'height', 'formal'],
        price: 900,
        duration: 60,
        difficulty: 'hard',
        maintenance: 'low',
        suitability: '90%',
        whyItWorks: 'Updo with height creates elongating effect'
      }
    ]
  },

  // SQUARE FACE - Strong jawline, need styles that soften angles
  square: {
    hairstyles: [
      {
        id: 'square_soft_waves',
        name: 'Soft Wavy Lob',
        category: 'hairstyle',
        description: 'Long bob with soft waves to soften jawline',
        image: '/styles/downloads/women/soft-wavy-lob-square.jpg',
        tags: ['lob', 'waves', 'soft', 'medium'],
        price: 700,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Soft waves break up the strong angles of square faces'
      },
      {
        id: 'square_layered_shag',
        name: 'Layered Shag Cut',
        category: 'hairstyle',
        description: 'Shag with layers to soften features',
        image: '/styles/downloads/women/layered-shag-square.jpg',
        tags: ['shag', 'layers', 'soft', 'textured'],
        price: 600,
        duration: 40,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Layers create movement and soften angular features'
      },
      {
        id: 'square_side_swept',
        name: 'Side Swept Bangs',
        category: 'hairstyle',
        description: 'Style with side-swept bangs to soften forehead',
        image: '/styles/downloads/women/side-swept-bangs-square.jpg',
        tags: ['bangs', 'side-swept', 'softening', 'versatile'],
        price: 650,
        duration: 45,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Side-swept bangs soften the square jawline'
      },
      {
        id: 'square_curly_bob',
        name: 'Curly Bob',
        category: 'hairstyle',
        description: 'Bob cut with natural curls for softness',
        image: '/styles/downloads/women/curly-bob-square.jpg',
        tags: ['curly', 'bob', 'soft', 'natural'],
        price: 750,
        duration: 50,
        difficulty: 'medium',
        maintenance: 'high',
        suitability: '80%',
        whyItWorks: 'Curls naturally soften angular square features'
      }
    ],
    treatments: [
      {
        id: 'square_smoothing',
        name: 'Smoothing Treatment',
        category: 'treatment',
        description: 'Treatment to soften hair texture',
        image: '/styles/downloads/women/smoothing-square.jpg',
        tags: ['smoothing', 'softening', 'treatment', 'texture'],
        price: 1500,
        duration: 90,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Smoother texture complements square face structure'
      },
      {
        id: 'square_moisture',
        name: 'Intensive Moisture Treatment',
        category: 'treatment',
        description: 'Deep moisture for soft, manageable hair',
        image: '/styles/downloads/women/intensive-moisture-square.jpg',
        tags: ['moisture', 'soft', 'manageable', 'treatment'],
        price: 900,
        duration: 45,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Soft, moisturized hair balances angular features'
      }
    ],
    coloring: [
      {
        id: 'square_soft_balayage',
        name: 'Soft Balayage',
        category: 'coloring',
        description: 'Gentle balayage to soften facial features',
        image: '/styles/downloads/women/soft-balayage-square.jpg',
        tags: ['balayage', 'soft', 'gentle', 'dimension'],
        price: 1700,
        duration: 90,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Soft color transitions complement square face angles'
      },
      {
        id: 'square_warm_tones',
        name: 'Warm Tone Color',
        category: 'coloring',
        description: 'Warm color tones to soften appearance',
        image: '/styles/downloads/women/warm-tones-square.jpg',
        tags: ['warm', 'tones', 'softening', 'color'],
        price: 1300,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Warm tones naturally soften angular features'
      }
    ],
    styling: [
      {
        id: 'square_soft_blowout',
        name: 'Soft Blowout',
        category: 'styling',
        description: 'Blowout with soft waves and movement',
        image: '/styles/downloads/women/soft-blowout-square.jpg',
        tags: ['blowout', 'soft', 'waves', 'movement'],
        price: 600,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Soft blowout balances strong square jawline'
      },
      {
        id: 'square_romantic_updo',
        name: 'Romantic Updo',
        category: 'styling',
        description: 'Soft, romantic updo with face-framing pieces',
        image: '/styles/downloads/women/romantic-updo-square.jpg',
        tags: ['updo', 'romantic', 'soft', 'face-framing'],
        price: 850,
        duration: 60,
        difficulty: 'hard',
        maintenance: 'low',
        suitability: '95%',
        whyItWorks: 'Romantic updo softens angular square features'
      }
    ]
  },

  // HEART FACE - Wider forehead, need styles that balance proportions
  heart: {
    hairstyles: [
      {
        id: 'heart_long_waves',
        name: 'Long Wavy Hair',
        category: 'hairstyle',
        description: 'Long hair with waves to balance wider forehead',
        image: '/styles/downloads/women/long-wavy-heart.jpg',
        tags: ['long', 'waves', 'balancing', 'versatile'],
        price: 800,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Long waves add width at jaw to balance wider forehead'
      },
      {
        id: 'heart_side_bangs',
        name: 'Side Bangs with Layers',
        category: 'hairstyle',
        description: 'Layers with side bangs to balance proportions',
        image: '/styles/downloads/women/side-bangs-layers-heart.jpg',
        tags: ['bangs', 'layers', 'balancing', 'side'],
        price: 650,
        duration: 45,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Side bangs reduce forehead width, layers add jaw volume'
      },
      {
        id: 'heart_chin_length',
        name: 'Chin-Length Bob',
        category: 'hairstyle',
        description: 'Bob ending at chin to add width to jaw area',
        image: '/styles/downloads/women/chin-length-bob-heart.jpg',
        tags: ['chin-length', 'bob', 'balancing', 'width'],
        price: 600,
        duration: 40,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Chin length adds width to balance heart proportions'
      },
      {
        id: 'heart_curls',
        name: 'Soft Curls',
        category: 'styling',
        description: 'Soft curls to add volume at jawline',
        image: '/styles/downloads/women/soft-curls-heart.jpg',
        tags: ['curls', 'soft', 'volume', 'jawline'],
        price: 500,
        duration: 35,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '80%',
        whyItWorks: 'Curls add volume at jaw to balance wider forehead'
      }
    ],
    treatments: [
      {
        id: 'heart_volume_root',
        name: 'Root Volume Treatment',
        category: 'treatment',
        description: 'Treatment to add volume at roots and jaw area',
        image: '/styles/downloads/women/root-volume-heart.jpg',
        tags: ['volume', 'roots', 'jaw', 'treatment'],
        price: 1200,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Root volume adds balance to heart face proportions'
      },
      {
        id: 'heart_texturizing',
        name: 'Face-Framing Texturizing',
        category: 'treatment',
        description: 'Texturizing to frame and balance face',
        image: '/styles/downloads/women/face-framing-texturizing-heart.jpg',
        tags: ['face-framing', 'texturizing', 'balance', 'treatment'],
        price: 800,
        duration: 45,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Face-framing adds width to balance heart proportions'
      }
    ],
    coloring: [
      {
        id: 'heart_dimensional',
        name: 'Dimensional Color',
        category: 'coloring',
        description: 'Multi-tonal color for balance and dimension',
        image: '/styles/downloads/women/dimensional-color-heart.jpg',
        tags: ['dimensional', 'multi-tonal', 'balance', 'color'],
        price: 1800,
        duration: 90,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Dimensional color adds depth and balance to heart faces'
      },
      {
        id: 'heart_lowlights',
        name: 'Face-Framing Lowlights',
        category: 'coloring',
        description: 'Lowlights to frame and balance face',
        image: '/styles/downloads/women/face-framing-lowlights-heart.jpg',
        tags: ['lowlights', 'face-framing', 'balance', 'depth'],
        price: 1500,
        duration: 75,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Lowlights add depth and frame heart face features'
      }
    ],
    styling: [
      {
        id: 'heart_half_up',
        name: 'Half-Up Half-Down',
        category: 'styling',
        description: 'Half-up style with volume at sides',
        image: '/styles/downloads/women/half-up-half-down-heart.jpg',
        tags: ['half-up', 'volume', 'sides', 'versatile'],
        price: 600,
        duration: 40,
        difficulty: 'medium',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Half-up style adds width to balance heart proportions'
      },
      {
        id: 'heart_side_swept',
        name: 'Side Swept Style',
        category: 'styling',
        description: 'Style swept to one side for balance',
        image: '/styles/downloads/women/side-swept-heart.jpg',
        tags: ['side-swept', 'balance', 'asymmetry', 'elegant'],
        price: 700,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'low',
        suitability: '95%',
        whyItWorks: 'Side sweeping creates balance for heart face shapes'
      }
    ]
  },

  // DIAMOND FACE - Prominent cheekbones, need styles that complement angles
  diamond: {
    hairstyles: [
      {
        id: 'diamond_medium_length',
        name: 'Medium Length Cut',
        category: 'hairstyle',
        description: 'Medium length to showcase cheekbones',
        image: '/styles/downloads/women/medium-length-cut-diamond.jpg',
        tags: ['medium', 'cheekbones', 'showcase', 'balanced'],
        price: 700,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Medium length highlights beautiful diamond cheekbones'
      },
      {
        id: 'diamond_side_part',
        name: 'Side Part with Layers',
        category: 'hairstyle',
        description: 'Side part with layers to complement cheekbones',
        image: '/styles/downloads/women/side-part-layers-diamond.jpg',
        tags: ['side-part', 'layers', 'cheekbones', 'elegant'],
        price: 650,
        duration: 40,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Side part complements diamond face cheekbone structure'
      },
      {
        id: 'diamond_textured_bob',
        name: 'Textured Bob',
        category: 'hairstyle',
        description: 'Bob with texture to soften angles',
        image: '/styles/downloads/women/textured-bob-diamond.jpg',
        tags: ['bob', 'textured', 'soft', 'angles'],
        price: 600,
        duration: 35,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Texture softens angles while maintaining diamond beauty'
      },
      {
        id: 'diamond_swept_back',
        name: 'Swept Back Style',
        category: 'styling',
        description: 'Hair swept back to showcase cheekbones',
        image: '/styles/downloads/women/swept-back-diamond.jpg',
        tags: ['swept-back', 'cheekbones', 'showcase', 'elegant'],
        price: 500,
        duration: 30,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '80%',
        whyItWorks: 'Swept back style highlights diamond face features'
      }
    ],
    treatments: [
      {
        id: 'diamond_shine',
        name: 'Gloss Shine Treatment',
        category: 'treatment',
        description: 'Treatment to enhance natural shine and health',
        image: '/styles/downloads/women/gloss-shine-diamond.jpg',
        tags: ['gloss', 'shine', 'health', 'treatment'],
        price: 1000,
        duration: 45,
        difficulty: 'easy',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Healthy shine enhances diamond face features'
      },
      {
        id: 'diamond_protein',
        name: 'Protein Treatment',
        category: 'treatment',
        description: 'Protein treatment for strong, healthy hair',
        image: '/styles/downloads/women/protein-treatment-diamond.jpg',
        tags: ['protein', 'strength', 'health', 'treatment'],
        price: 1200,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'low',
        suitability: '95%',
        whyItWorks: 'Strong, healthy hair complements diamond face structure'
      }
    ],
    coloring: [
      {
        id: 'diamond_dimensional',
        name: 'Dimensional Highlights',
        category: 'coloring',
        description: 'Highlights to enhance cheekbone structure',
        image: '/styles/downloads/women/dimensional-highlights-diamond.jpg',
        tags: ['highlights', 'dimensional', 'cheekbones', 'enhance'],
        price: 1700,
        duration: 90,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Dimensional highlights enhance diamond cheekbone beauty'
      },
      {
        id: 'diamond_subtle_color',
        name: 'Subtle Color Melt',
        category: 'coloring',
        description: 'Subtle color melt for natural enhancement',
        image: '/styles/downloads/women/subtle-color-melt-diamond.jpg',
        tags: ['color-melt', 'subtle', 'natural', 'enhance'],
        price: 1400,
        duration: 75,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Subtle color enhances without overwhelming diamond features'
      }
    ],
    styling: [
      {
        id: 'diamond_elegant_updo',
        name: 'Elegant Updo',
        category: 'styling',
        description: 'Sophisticated updo to showcase features',
        image: '/styles/downloads/women/elegant-updo-diamond.jpg',
        tags: ['updo', 'elegant', 'showcase', 'formal'],
        price: 800,
        duration: 60,
        difficulty: 'hard',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Elegant updo showcases beautiful diamond face structure'
      },
      {
        id: 'diamond_sleek_style',
        name: 'Sleek Styling',
        category: 'styling',
        description: 'Sleek, polished style for modern look',
        image: '/styles/downloads/women/sleek-diamond.jpg',
        tags: ['sleek', 'polished', 'modern', 'clean'],
        price: 600,
        duration: 40,
        difficulty: 'medium',
        maintenance: 'low',
        suitability: '95%',
        whyItWorks: 'Sleek style complements diamond face angular beauty'
      }
    ]
  },

  // OBLONG FACE - Longer face, need styles that add width
  oblong: {
    hairstyles: [
      {
        id: 'oblong_wavy_bob',
        name: 'Wavy Chin-Length Bob',
        category: 'hairstyle',
        description: 'Chin-length bob with waves to add width',
        image: '/styles/downloads/women/wavy-chin-length-bob-oblong.jpg',
        tags: ['bob', 'wavy', 'width', 'chin-length'],
        price: 700,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Waves and chin length add width to balance oblong face'
      },
      {
        id: 'oblong_side_bangs',
        name: 'Side Bangs with Volume',
        category: 'hairstyle',
        description: 'Style with side bangs and volume at sides',
        image: '/styles/downloads/women/side-bangs-volume-oblong.jpg',
        tags: ['bangs', 'volume', 'sides', 'width'],
        price: 650,
        duration: 40,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Side bangs and volume add horizontal width'
      },
      {
        id: 'oblong_layered',
        name: 'Layered Medium Cut',
        category: 'hairstyle',
        description: 'Medium cut with layers for width and movement',
        image: '/styles/downloads/women/layered-medium-cut-oblong.jpg',
        tags: ['layered', 'medium', 'width', 'movement'],
        price: 750,
        duration: 50,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '85%',
        whyItWorks: 'Layers create width and movement to balance face length'
      },
      {
        id: 'oblong_curls',
        name: 'Voluminous Curls',
        category: 'styling',
        description: 'Full curls to add width and volume',
        image: '/styles/downloads/women/voluminous-curls-oblong.jpg',
        tags: ['curls', 'volume', 'width', 'full'],
        price: 800,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'high',
        suitability: '80%',
        whyItWorks: 'Voluminous curls add width to balance oblong proportions'
      }
    ],
    treatments: [
      {
        id: 'oblong_volume_boost',
        name: 'Volume Boost Treatment',
        category: 'treatment',
        description: 'Treatment to add maximum volume and width',
        image: '/styles/downloads/women/volume-boost-oblong.jpg',
        tags: ['volume', 'width', 'boost', 'treatment'],
        price: 1300,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '100%',
        whyItWorks: 'Volume adds width to balance oblong face proportions'
      },
      {
        id: 'oblong_texturizing',
        name: 'Width-Enhancing Texturizing',
        category: 'treatment',
        description: 'Texturizing to create width and movement',
        image: '/styles/downloads/women/volume-boost-oblong.jpg',
        tags: ['texturizing', 'width', 'movement', 'treatment'],
        price: 900,
        duration: 45,
        difficulty: 'easy',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Texturizing creates width to balance face length'
      }
    ],
    coloring: [
      {
        id: 'oblong_horizontal_color',
        name: 'Horizontal Color Placement',
        category: 'coloring',
        description: 'Color placement to create horizontal lines',
        image: '/styles/downloads/women/horizontal-color-oblong.jpg',
        tags: ['horizontal', 'color', 'width', 'placement'],
        price: 1600,
        duration: 75,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '95%',
        whyItWorks: 'Horizontal color placement adds width to balance face'
      },
      {
        id: 'oblong_side_highlights',
        name: 'Side Highlights',
        category: 'coloring',
        description: 'Highlights on sides to add width',
        image: '/styles/downloads/women/side-highlights-oblong.jpg',
        tags: ['highlights', 'sides', 'width', 'dimension'],
        price: 1400,
        duration: 60,
        difficulty: 'medium',
        maintenance: 'medium',
        suitability: '90%',
        whyItWorks: 'Side highlights create horizontal width'
      }
    ],
    styling: [
      {
        id: 'oblong_wide_blowout',
        name: 'Wide Blowout',
        category: 'styling',
        description: 'Blowout with emphasis on width at sides',
        image: '/styles/downloads/women/wide-blowout-oblong.jpg',
        tags: ['blowout', 'wide', 'sides', 'volume'],
        price: 700,
        duration: 45,
        difficulty: 'medium',
        maintenance: 'low',
        suitability: '100%',
        whyItWorks: 'Wide blowout adds horizontal width to balance face'
      },
      {
        id: 'oblong_half_up',
        name: 'Half-Up with Volume',
        category: 'styling',
        description: 'Half-up style with volume at sides',
        image: '/styles/downloads/women/half-up-volume-oblong.jpg',
        tags: ['half-up', 'volume', 'sides', 'width'],
        price: 650,
        duration: 40,
        difficulty: 'medium',
        maintenance: 'low',
        suitability: '95%',
        whyItWorks: 'Half-up with volume adds width to balance oblong face'
      }
    ]
  }
};

// Helper function to get styles by face shape
export const getWomenStylesByFaceShape = (faceShape: string): WomenFaceShapeStyles => {
  return WOMEN_FACE_SHAPE_STYLES[faceShape.toLowerCase()] || WOMEN_FACE_SHAPE_STYLES.oval;
};

// Helper function to get all styles for a face shape
export const getAllWomenStylesForFaceShape = (faceShape: string): WomenStyleData[] => {
  const faceShapeStyles = getWomenStylesByFaceShape(faceShape);
  return [...faceShapeStyles.hairstyles, ...faceShapeStyles.treatments, ...faceShapeStyles.coloring, ...faceShapeStyles.styling];
};

// Helper function to get hairstyles only
export const getWomenHairstylesForFaceShape = (faceShape: string): WomenStyleData[] => {
  return getWomenStylesByFaceShape(faceShape).hairstyles;
};

// Helper function to get treatments only
export const getWomenTreatmentsForFaceShape = (faceShape: string): WomenStyleData[] => {
  return getWomenStylesByFaceShape(faceShape).treatments;
};

// Helper function to get coloring only
export const getWomenColoringForFaceShape = (faceShape: string): WomenStyleData[] => {
  return getWomenStylesByFaceShape(faceShape).coloring;
};

// Helper function to get styling only
export const getWomenStylingForFaceShape = (faceShape: string): WomenStyleData[] => {
  return getWomenStylesByFaceShape(faceShape).styling;
};
