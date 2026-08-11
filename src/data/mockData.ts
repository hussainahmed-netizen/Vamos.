import { Product, Review, FAQItem, Coupon, CategoryItem } from '../types';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'electronics',
    name: 'Electronics & Audio',
    description: 'High-fidelity headphones, wireless earbuds & smart audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    itemCount: 42,
    badge: 'Popular',
    subCategories: [
      { id: 'headphones', name: 'Wireless Headphones', parentId: 'electronics' },
      { id: 'earbuds', name: 'TWS Earbuds', parentId: 'electronics' },
      { id: 'speakers', name: 'Bluetooth Speakers', parentId: 'electronics' },
      { id: 'audio-acc', name: 'Audio Cables & Acc.', parentId: 'electronics' }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    description: 'Minimalist jackets, designer hoodies & luxury wear',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
    itemCount: 88,
    badge: 'New Season',
    subCategories: [
      { id: 'hoodies', name: 'Hoodies & Sweatshirts', parentId: 'fashion' },
      { id: 'jackets', name: 'Jackets & Outerwear', parentId: 'fashion' },
      { id: 'scarves', name: 'Scarves & Wraps', parentId: 'fashion' },
      { id: 'tshirts', name: 'Urban T-Shirts', parentId: 'fashion' }
    ]
  },
  {
    id: 'gadgets',
    name: 'Smart Gadgets',
    description: 'Wearables, smartwatches & desktop accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    itemCount: 35,
    badge: 'Trending',
    subCategories: [
      { id: 'smartwatches', name: 'OLED Smartwatches', parentId: 'gadgets' },
      { id: 'chargers', name: 'Wireless Chargers', parentId: 'gadgets' },
      { id: 'trackers', name: 'Fitness Trackers', parentId: 'gadgets' },
      { id: 'desk-gadgets', name: 'Desktop Gadgets', parentId: 'gadgets' }
    ]
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Aesthetic diffusers, desk setups & ergonomic lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    itemCount: 54,
    badge: 'Best Value',
    subCategories: [
      { id: 'lighting', name: 'Smart Desk Lamps', parentId: 'home' },
      { id: 'diffusers', name: 'Ceramic Diffusers', parentId: 'home' },
      { id: 'decor', name: 'Aesthetic Home Decor', parentId: 'home' }
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty & Skincare',
    description: 'Organic serums, hydrators & premium care routines',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    itemCount: 29,
    badge: 'Eco-Friendly',
    subCategories: [
      { id: 'serums', name: 'Face Serums', parentId: 'beauty' },
      { id: 'hydrators', name: 'Hydrating Oils', parentId: 'beauty' },
      { id: 'skincare-sets', name: 'Organic Skincare Sets', parentId: 'beauty' }
    ]
  },
  {
    id: 'accessories',
    name: 'Leather & Bags',
    description: 'Handcrafted leather backpacks, wallets & tech sleeves',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    itemCount: 31,
    badge: 'Handmade',
    subCategories: [
      { id: 'backpacks', name: 'Leather Backpacks', parentId: 'accessories' },
      { id: 'duffles', name: 'Travel Duffle Bags', parentId: 'accessories' },
      { id: 'wallets', name: 'Wallets & Cardholders', parentId: 'accessories' }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Aura Active ANC Wireless Headphones',
    subtitle: 'Studio-quality noise cancellation with 40-hour battery life',
    category: 'electronics',
    subCategory: 'headphones',
    categoryName: 'Electronics & Audio',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.9,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Engineered for audiophiles and travelers, the Aura Active Wireless Headphones feature adaptive Active Noise Cancellation, titanium dynamic drivers, ultra-soft memory foam ear cushions, and seamless multi-device Bluetooth 5.3 pairing.',
    features: [
      'Hybrid Active Noise Cancellation (up to -38dB)',
      '40-hour continuous playback with fast USB-C charge (10 min = 5 hrs)',
      'Plush memory foam earcups wrapped in breathable protein leather',
      'Quad-microphone array for crystal clear voice calls',
      'Custom EQ tuning via mobile companion'
    ],
    specifications: {
      'Driver Size': '40mm Neodymium',
      'Frequency Response': '20Hz - 40,000Hz',
      'Battery Life': '40 Hours (ANC On)',
      'Bluetooth Version': '5.3 Codec AptX HD',
      'Weight': '250 grams',
      'Warranty': '2 Years Manufacturer'
    },
    isBestSeller: true,
    isDeal: true,
    dealEndsInHours: 14,
    stock: 18,
    colors: [
      { name: 'Space Black', hex: '#111827' },
      { name: 'Silver Gray', hex: '#9CA3AF' },
      { name: 'Midnight Navy', hex: '#1E3A8A' }
    ],
    tags: ['audio', 'wireless', 'anc', 'headphones', 'best seller']
  },
  {
    id: 'p2',
    name: 'UltraFit OLED Smart Fitness Watch',
    subtitle: 'Always-on HD display with heart rate, SpO2 & GPS tracking',
    category: 'gadgets',
    subCategory: 'smartwatches',
    categoryName: 'Smart Gadgets',
    price: 119.50,
    originalPrice: 159.00,
    rating: 4.8,
    reviewCount: 96,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Track every movement, sleep phase, and vital stat with precision. Features a 1.43-inch AMOLED display, 5 ATM water resistance, 100+ workout modes, and a sleek aircraft-grade aluminum alloy bezel.',
    features: [
      '1.43-inch AMOLED Touchscreen (466x466 resolution)',
      '24/7 Heart Rate, Blood Oxygen (SpO2) & Sleep Analyzer',
      'Built-in Dual-band GPS for precise route mapping',
      '50m Water Resistance (5 ATM) for swimming',
      'Up to 12 days battery life on a single charge'
    ],
    specifications: {
      'Display': '1.43" AMOLED 60Hz',
      'Water Resistance': '5 ATM (50m)',
      'Battery': '320 mAh (12 Days)',
      'Sensors': 'Optical HR, SpO2, Gyroscope, GPS',
      'Compatibility': 'iOS 12+ / Android 8.0+'
    },
    isBestSeller: true,
    isNewArrival: true,
    isDeal: true,
    dealEndsInHours: 10,
    stock: 24,
    colors: [
      { name: 'Matte Obsidian', hex: '#18181B' },
      { name: 'Rose Gold', hex: '#E11D48' },
      { name: 'Titanium Gray', hex: '#64748B' }
    ],
    tags: ['smartwatch', 'fitness', 'gps', 'gadgets']
  },
  {
    id: 'p3',
    name: 'Minimalist Artisan Leather Backpack',
    subtitle: 'Handcrafted full-grain leather with padded 15" laptop compartment',
    category: 'accessories',
    subCategory: 'backpacks',
    categoryName: 'Leather & Bags',
    price: 189.00,
    originalPrice: 240.00,
    rating: 4.95,
    reviewCount: 64,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Designed for commuters, travelers, and creative professionals. Features vegetable-tanned Italian leather that develops a rich patina over time, heavy-duty YKK brass zippers, and quick-access magnetic pockets.',
    features: [
      '100% Genuine Full-Grain Italian Leather',
      'Dedicated padded laptop sleeve fits up to 16-inch MacBook Pro',
      'Water-resistant nylon interior lining with organizer pockets',
      'Ergonomic padded shoulder straps with breathable mesh',
      'Hidden passport & wallet security pocket on back panel'
    ],
    specifications: {
      'Dimensions': '42cm x 30cm x 14cm',
      'Capacity': '20 Liters',
      'Material': 'Full-Grain Tuscan Leather',
      'Zippers': 'YKK Antiqued Brass',
      'Warranty': 'Lifetime Craftsmanship Guarantee'
    },
    isBestSeller: true,
    isDeal: true,
    dealEndsInHours: 16,
    stock: 9,
    colors: [
      { name: 'Chestnut Brown', hex: '#78350F' },
      { name: 'Obsidian Black', hex: '#0F172A' },
      { name: 'Vintage Tan', hex: '#B45309' }
    ],
    tags: ['leather', 'backpack', 'bag', 'travel']
  },
  {
    id: 'p4',
    name: 'Lumina Smart Ambient Desk Lamp',
    subtitle: 'Dimmable LED bar with wireless phone charging base',
    category: 'home',
    subCategory: 'lighting',
    categoryName: 'Home & Living',
    price: 68.00,
    originalPrice: 89.00,
    rating: 4.75,
    reviewCount: 43,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Transform your workspace lighting. Features CRI > 95 eye-care LED illumination, color temperature adjustments (2700K to 6500K), touch sensitive controls, and a built-in 15W Qi fast wireless charging pad at the base.',
    features: [
      'Non-glare asymmetric optical lighting eliminates screen reflection',
      'Integrated 15W Wireless Fast Charger base',
      '5 Color Temperatures & smooth stepless dimming dial',
      'Auto-dimming ambient light sensor adjusts automatically',
      'Sleek anodized aluminum space-saving swivel arm'
    ],
    specifications: {
      'Light Output': '800 Lumens (CRI > 95)',
      'Power Output': '12V / 2A DC Adapter Included',
      'Wireless Charging': '15W Max Fast Charge',
      'Lifespan': '50,000 Hours LED'
    },
    isNewArrival: true,
    stock: 30,
    colors: [
      { name: 'Space Gray', hex: '#475569' },
      { name: 'Chalk White', hex: '#F8FAFC' }
    ],
    tags: ['home', 'lighting', 'desk', 'wireless charger']
  },
  {
    id: 'p5',
    name: 'Botanical Hydra-Glow Face Serum',
    subtitle: 'Nourishing hyaluronic acid & Vitamin C glow complex',
    category: 'beauty',
    subCategory: 'serums',
    categoryName: 'Beauty & Skincare',
    price: 42.00,
    originalPrice: 55.00,
    rating: 4.88,
    reviewCount: 81,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Restore radiance and deep moisture with our dermatologist-tested botanical formula. Infused with triple-weight hyaluronic acid, stabilized 15% Vitamin C, organic aloe vera, and green tea antioxidants.',
    features: [
      '100% Vegan, Cruelty-Free & Paraben-Free formula',
      'Deep 24-hour hydration lock with botanical ceramides',
      'Evens skin tone and reduces appearance of fine lines',
      'Fast-absorbing non-greasy silky serum texture',
      'Suitable for all skin types including sensitive skin'
    ],
    specifications: {
      'Volume': '50ml / 1.7 fl oz',
      'Key Ingredients': 'Hyaluronic Acid 2%, Vitamin C 15%, Niacinamide 4%',
      'Origin': 'Made in France',
      'Shelf Life': '24 Months'
    },
    isBestSeller: true,
    isDeal: true,
    dealEndsInHours: 8,
    stock: 40,
    tags: ['skincare', 'serum', 'beauty', 'organic']
  },
  {
    id: 'p6',
    name: 'Urban Oversized Heavyweight Cotton Hoodie',
    subtitle: '480 GSM organic french terry with structured streetwear drop-shoulder fit',
    category: 'fashion',
    subCategory: 'hoodies',
    categoryName: 'Fashion & Apparel',
    price: 79.99,
    originalPrice: 110.00,
    rating: 4.9,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The ultimate minimalist hoodie engineered from 100% 480GSM heavy combed cotton. Preshrunk fabric ensures fit longevity, double-stitched seams guarantee durability, and double-lined hood provides a structured drape.',
    features: [
      '480 GSM 100% Combed Organic French Terry Cotton',
      'Preshrunk fabric to prevent washing shrinkage',
      'Relaxed drop-shoulder boxy fit with thick double ribbing',
      'Kangaroo front pocket & double-layered cozy hood',
      'Ethically manufactured in eco-certified facility'
    ],
    specifications: {
      'Material': '100% Organic Cotton',
      'Weight': '480 GSM Heavyweight',
      'Fit': 'Oversized Streetwear',
      'Care': 'Machine Wash Cold, Hang Dry'
    },
    isNewArrival: true,
    stock: 15,
    colors: [
      { name: 'Oatmeal Beige', hex: '#E5E0D8' },
      { name: 'Washed Black', hex: '#262626' },
      { name: 'Sage Green', hex: '#4B5563' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['apparel', 'hoodie', 'streetwear', 'cotton']
  },
  {
    id: 'p7',
    name: 'MagCharge 3-in-1 Wireless Charging Stand',
    subtitle: 'Simultaneous fast charging for iPhone, Apple Watch & AirPods',
    category: 'gadgets',
    subCategory: 'chargers',
    categoryName: 'Smart Gadgets',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.82,
    reviewCount: 77,
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Declutter your nightstand or desk. Charge your phone, smartwatch, and wireless earbuds magnetically at the exact same time with 15W high-speed power transmission.',
    features: [
      'Strong N52 Magnetic Snap alignment for secure hold',
      '15W Max Fast Charging for MagSafe devices',
      'Weighted metal base with non-slip silicone bottom pad',
      'Smart LED status light with subtle dim night mode',
      'Over-heat, over-voltage & foreign object detection safety'
    ],
    specifications: {
      'Input': '9V/3A, 12V/2A USB-C',
      'Output Phone': '15W / 10W / 7.5W / 5W',
      'Output Watch': '3W',
      'Output Earbuds': '5W'
    },
    isDeal: true,
    dealEndsInHours: 22,
    stock: 21,
    colors: [
      { name: 'Matte Black', hex: '#18181B' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    tags: ['charger', 'magsafe', 'gadgets', 'wireless']
  },
  {
    id: 'p8',
    name: 'AromaTherapy Ceramic Ultrasonic Diffuser',
    subtitle: 'Whisper-quiet essential oil mister with warm LED ambient ring',
    category: 'home',
    subCategory: 'diffusers',
    categoryName: 'Home & Living',
    price: 38.50,
    originalPrice: 49.99,
    rating: 4.87,
    reviewCount: 52,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Elevate your living room or bedroom with handcrafted porcelain ceramic design. Produces 2.4MHz ultrasonic micro-mist that diffuses natural essential oils evenly across rooms up to 400 sq ft.',
    features: [
      'Handcrafted matte porcelain ceramic outer shell',
      '300ml water capacity provides up to 10 hours continuous misting',
      'Warm candle-glow LED ring with breathing pulse mode',
      'Auto safety shut-off when water reservoir runs dry',
      'BPA-free medical grade internal reservoir'
    ],
    specifications: {
      'Capacity': '300ml',
      'Coverage': '400 sq. ft.',
      'Noise Level': '< 20dB (Whisper Quiet)',
      'Dimensions': '18cm x 12cm'
    },
    isNewArrival: true,
    isFeatured: true,
    stock: 32,
    colors: [
      { name: 'Sandstone Ceramic', hex: '#D6C7B2' },
      { name: 'Charcoal Ceramic', hex: '#374151' }
    ],
    tags: ['home', 'diffuser', 'essential oils', 'decor']
  },
  {
    id: 'p9',
    name: 'SoundWave Hi-Fi Portable Bluetooth Speaker',
    subtitle: '360° spatial audio with deep bass & 24-hour waterproof battery',
    category: 'electronics',
    subCategory: 'speakers',
    categoryName: 'Electronics & Audio',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.85,
    reviewCount: 59,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Experience immersive room-filling audio wherever you go. IP67 dust and waterproof rating, custom passive radiators for punchy bass, and PartySync multi-speaker pairing.',
    features: [
      '360° Room-filling audio with dual passive radiators',
      'IP67 Dustproof & Waterproof submersible design',
      '24 Hours continuous playback on single charge',
      'PartySync allows pairing up to 100+ speakers',
      'Built-in microphone for hands-free speakerphone calls'
    ],
    specifications: {
      'Power Output': '30W RMS',
      'Battery Capacity': '5200 mAh (24 Hours)',
      'Waterproof Rating': 'IP67 Submersible',
      'Connectivity': 'Bluetooth 5.3 & AUX'
    },
    isFeatured: true,
    stock: 19,
    colors: [
      { name: 'Charcoal Black', hex: '#18181B' },
      { name: 'Ocean Teal', hex: '#0D9488' }
    ],
    tags: ['speaker', 'audio', 'bluetooth', 'waterproof']
  },
  {
    id: 'p10',
    name: 'Silk Touch Cashmere Blend Scarf',
    subtitle: 'Ultra-soft Mongolian cashmere with classic fringe trim',
    category: 'fashion',
    subCategory: 'scarves',
    categoryName: 'Fashion & Apparel',
    price: 65.00,
    originalPrice: 85.00,
    rating: 4.92,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Wrap yourself in effortless warmth and luxury. Crafted from premium Mongolian grade-A cashmere and superfine merino wool.',
    features: [
      '70% Grade-A Mongolian Cashmere & 30% Fine Merino Wool',
      'Featherlight warmth without bulk or skin irritation',
      'Hand-twisted traditional fringe tassels',
      'Hypoallergenic & naturally temperature regulating',
      'Gift box packaging included'
    ],
    specifications: {
      'Dimensions': '180cm x 30cm',
      'Material': 'Cashmere & Wool Blend',
      'Care': 'Dry Clean or Gentle Hand Wash'
    },
    isFeatured: true,
    stock: 25,
    colors: [
      { name: 'Camel Tan', hex: '#C2410C' },
      { name: 'Heather Gray', hex: '#6B7280' },
      { name: 'Soft Cream', hex: '#F3F4F6' }
    ],
    tags: ['scarf', 'cashmere', 'fashion', 'winter']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    author: 'Alexander Wright',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '3 days ago',
    title: 'Mind-blowing Sound Quality & Battery Life!',
    comment: 'The Active Noise Cancellation is on par with ৳350+ premium brands. I wore these on a 12-hour flight and didn\'t feel any ear pressure. Delivery arrived in 2 days in mint condition!',
    verified: true,
    likes: 24
  },
  {
    id: 'r2',
    productId: 'p2',
    author: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '1 week ago',
    title: 'Sleek design, accurate GPS tracking',
    comment: 'I love how clean the watch UI is. Battery lasts a full week with daily workout tracking. The Cash on Delivery payment option was seamless too!',
    verified: true,
    likes: 18
  },
  {
    id: 'r3',
    productId: 'p3',
    author: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2 weeks ago',
    title: 'Craftsmanship is 10/10',
    comment: 'Smells like genuine rich leather right out of the box. Fits my 16" MacBook Pro perfectly. Worth every taka!',
    verified: true,
    likes: 31
  },
  {
    id: 'r4',
    productId: 'p6',
    author: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: 'Just now',
    title: 'Best heavy hoodie I own!',
    comment: 'Super thick 480GSM fabric that doesn\'t shrink in cold wash. The oversized drape looks high-fashion.',
    verified: true,
    likes: 12
  }
];

export const FAQS: FAQItem[] = [
  {
    category: 'Shipping & Delivery',
    question: 'How long does shipping take and what are the costs?',
    answer: 'We offer Express Delivery (2-3 business days) free for all orders over ৳60. Standard shipping takes 3-5 business days (৳4.99 for orders under ৳60). Same-day dispatch is guaranteed for orders placed before 2:00 PM.'
  },
  {
    category: 'Payment & Cash on Delivery',
    question: 'Is Cash on Delivery (COD) supported?',
    answer: 'Yes! We proudly offer Cash on Delivery (COD) nationwide so you can inspect your delivery package at your doorstep before handing over cash. We also accept Visa, Mastercard, American Express, Apple Pay, and PayPal.'
  },
  {
    category: 'Returns & Exchange',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day hassle-free return and exchange policy. If you are not 100% satisfied with your item, contact our support team and we will issue a prepaid return shipping label or arrange instant exchange.'
  },
  {
    category: 'Product Authenticity',
    question: 'Are all products 100% original and under warranty?',
    answer: 'Absolutely. All electronics, apparel, and lifestyle items are 100% authentic, directly sourced from authorized brand manufacturers, and backed by a minimum 1-Year Official Manufacturer Warranty.'
  },
  {
    category: 'Order Tracking',
    question: 'How can I track my live order status?',
    answer: 'As soon as your order is dispatched, you will receive an SMS and email notification containing your unique Tracking Number (#ORD-XXXXX). You can also enter your order ID anytime in our live Account / Tracking portal.'
  }
];

export const COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    description: '10% OFF on your first purchase'
  },
  {
    code: 'SPRING40',
    discountType: 'percentage',
    value: 15,
    minSpend: 80,
    description: '15% OFF on orders over ৳80'
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    value: 5,
    description: 'Free Shipping Voucher (৳5 off)'
  }
];

export const TRUST_BADGES = [
  {
    id: 'b1',
    title: '100% Secure Payments',
    subtitle: '256-bit SSL encrypted checkout',
    icon: 'ShieldCheck'
  },
  {
    id: 'b2',
    title: 'Express Delivery',
    subtitle: 'Free shipping on orders over ৳60',
    icon: 'Truck'
  },
  {
    id: 'b3',
    title: '30-Day Easy Returns',
    subtitle: 'No questions asked instant refund',
    icon: 'RotateCcw'
  },
  {
    id: 'b4',
    title: 'Cash on Delivery (COD)',
    subtitle: 'Pay at your doorstep on arrival',
    icon: 'Banknote'
  }
];
