import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';

dotenv.config();

const moreProducts = [
  // Dresses Collection
  {
    name: 'Summer Floral Sundress',
    description: 'Light and airy sundress with vibrant floral pattern. Perfect for warm weather and casual outings. Made from breathable cotton fabric.',
    price: 3299,
    compareAtPrice: 5499,
    category: 'dresses',
    images: [
      { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', publicId: 'sundress1', isMain: true },
      { url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400', publicId: 'sundress2' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Yellow', 'Pink', 'Blue'],
    stock: 35,
    isFeatured: true,
    tags: ['dress', 'summer', 'floral', 'sundress', 'casual']
  },
  {
    name: 'Elegant Evening Gown',
    description: 'Stunning floor-length evening gown perfect for formal events, weddings, and galas. Features a fitted bodice and flowing skirt.',
    price: 8799,
    compareAtPrice: 12499,
    category: 'dresses',
    images: [
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', publicId: 'gown1', isMain: true },
      { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', publicId: 'gown2' }
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Burgundy'],
    stock: 15,
    isFeatured: true,
    tags: ['gown', 'evening', 'formal', 'wedding', 'elegant']
  },
  {
    name: 'Casual Denim Dress',
    description: 'Comfortable denim dress for everyday wear. Features button-down front and adjustable waist belt.',
    price: 3849,
    compareAtPrice: 5499,
    category: 'dresses',
    images: [
      { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400', publicId: 'denim1', isMain: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black'],
    stock: 45,
    isFeatured: false,
    tags: ['denim', 'casual', 'everyday', 'jean']
  },
  {
    name: 'Lace Cocktail Dress',
    description: 'Beautiful lace cocktail dress perfect for parties and special occasions. Intricate lace detailing with comfortable lining.',
    price: 6599,
    compareAtPrice: 8799,
    category: 'dresses',
    images: [
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', publicId: 'lace1', isMain: true }
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Blush', 'Navy'],
    stock: 20,
    isFeatured: true,
    tags: ['lace', 'cocktail', 'party', 'formal']
  },

  // Jewelry Collection
  {
    name: 'Diamond Pendant Necklace',
    description: 'Exquisite diamond pendant necklace with 14k gold chain. Perfect for everyday elegance or special occasions.',
    price: 16499,
    compareAtPrice: 21999,
    category: 'jewelry',
    images: [
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', publicId: 'diamond1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    stock: 10,
    isFeatured: true,
    tags: ['diamond', 'necklace', 'gold', 'luxury']
  },
  {
    name: 'Sapphire Ring Set',
    description: 'Beautiful sapphire and diamond ring set. Perfect for engagement or anniversary gifts.',
    price: 21999,
    compareAtPrice: 32999,
    category: 'jewelry',
    images: [
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', publicId: 'ring1', isMain: true }
    ],
    sizes: ['5', '6', '7', '8'],
    colors: ['Blue Sapphire', 'White Sapphire'],
    stock: 8,
    isFeatured: true,
    tags: ['ring', 'sapphire', 'diamond', 'engagement']
  },
  {
    name: 'Pearl Bracelet',
    description: 'Elegant freshwater pearl bracelet with gold clasp. Timeless piece that complements any outfit.',
    price: 4399,
    compareAtPrice: 6599,
    category: 'jewelry',
    images: [
      { url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', publicId: 'bracelet1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['White Pearl', 'Black Pearl'],
    stock: 30,
    isFeatured: false,
    tags: ['pearl', 'bracelet', 'elegant', 'classic']
  },

  // Accessories Collection
  {
    name: 'Designer Leather Wallet',
    description: 'Premium genuine leather wallet with multiple card slots and coin pocket. RFID blocking for security.',
    price: 2749,
    compareAtPrice: 4399,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400', publicId: 'wallet1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tan'],
    stock: 50,
    isFeatured: true,
    tags: ['wallet', 'leather', 'accessories', 'men']
  },
  {
    name: 'Silk Tie Set',
    description: 'Luxurious 100% silk tie set including matching pocket square. Available in various patterns.',
    price: 2199,
    compareAtPrice: 3849,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=400', publicId: 'tie1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Navy', 'Burgundy', 'Black', 'Silver'],
    stock: 40,
    isFeatured: false,
    tags: ['tie', 'silk', 'formal', 'men']
  },
  {
    name: 'Sunglasses - Aviator',
    description: 'Classic aviator sunglasses with UV400 protection. Metal frame with polarized lenses.',
    price: 3299,
    compareAtPrice: 5499,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', publicId: 'sunglass1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Gold/Black', 'Silver/Blue', 'Black/Black'],
    stock: 35,
    isFeatured: true,
    tags: ['sunglasses', 'aviator', 'summer', 'protection']
  },
  {
    name: 'Leather Belt',
    description: 'Genuine leather belt with classic buckle design. Durable and stylish for everyday wear.',
    price: 1649,
    compareAtPrice: 2749,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', publicId: 'belt1', isMain: true }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    stock: 60,
    isFeatured: false,
    tags: ['belt', 'leather', 'accessories']
  },

  // Gifts Collection
  {
    name: 'Luxury Gift Set - Jewelry & Scarf',
    description: 'Beautiful gift set including a pearl necklace and silk scarf. Perfect for birthdays and anniversaries.',
    price: 8799,
    compareAtPrice: 12499,
    category: 'gifts',
    images: [
      { url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400', publicId: 'giftset1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Set A', 'Set B', 'Set C'],
    stock: 15,
    isFeatured: true,
    tags: ['gift', 'set', 'luxury', 'jewelry', 'scarf']
  },
  {
    name: 'Personalized Name Necklace',
    description: 'Custom name necklace in sterling silver or gold. Engrave any name or word.',
    price: 5499,
    compareAtPrice: 7699,
    category: 'gifts',
    images: [
      { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', publicId: 'custom1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Silver', 'Gold', 'Rose Gold'],
    stock: 25,
    isFeatured: true,
    tags: ['custom', 'personalized', 'gift', 'necklace']
  },

  // New Arrivals
  {
    name: 'Winter Wool Coat',
    description: 'Elegant wool coat for cold weather. Fully lined with premium wool blend fabric.',
    price: 10999,
    compareAtPrice: 16499,
    category: 'new-arrivals',
    images: [
      { url: 'https://images.unsplash.com/photo-1539533113208-f6b12f1dda6d?w=400', publicId: 'coat1', isMain: true }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Black', 'Gray'],
    stock: 20,
    isFeatured: true,
    tags: ['coat', 'winter', 'wool', 'warm']
  },
  {
    name: 'Leather Boots - Ankle',
    description: 'Stylish ankle boots with block heel. Genuine leather with comfortable insole.',
    price: 5499,
    compareAtPrice: 8249,
    category: 'new-arrivals',
    images: [
      { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', publicId: 'boots1', isMain: true }
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['Black', 'Brown', 'Tan'],
    stock: 30,
    isFeatured: true,
    tags: ['boots', 'leather', 'shoes', 'winter']
  },

  // Sale Items
  {
    name: 'Summer Dress - Clearance',
    description: 'Last season\'s summer dress at incredible price. Limited sizes available.',
    price: 1649,
    compareAtPrice: 5499,
    category: 'sale',
    images: [
      { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', publicId: 'saledress1', isMain: true }
    ],
    sizes: ['XS', 'S', 'M'],
    colors: ['Blue', 'Pink'],
    stock: 12,
    isFeatured: false,
    tags: ['sale', 'clearance', 'summer', 'dress']
  },
  {
    name: 'Handbag - Clearance',
    description: 'Beautiful handbag at discounted price. Limited quantity available.',
    price: 2749,
    compareAtPrice: 7699,
    category: 'sale',
    images: [
      { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', publicId: 'salebag1', isMain: true }
    ],
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    stock: 8,
    isFeatured: false,
    tags: ['sale', 'handbag', 'clearance']
  }
];

const seedMoreProducts = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting to seed more products...\n');
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const productData of moreProducts) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ name: productData.name });
      
      if (existingProduct) {
        console.log(`⚠️ Product already exists: ${productData.name} - Skipping`);
        skippedCount++;
      } else {
        const product = new Product(productData);
        await product.save();
        console.log(`✅ Added: ${product.name} - ${product.price} ETB`);
        addedCount++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Seeding Summary:`);
    console.log(`   ✅ Added: ${addedCount} new products`);
    console.log(`   ⚠️ Skipped: ${skippedCount} existing products`);
    console.log(`   📦 Total products in database: ${await Product.countDocuments()}`);
    console.log('='.repeat(50));
    
    // Show all categories with counts
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📂 Products by category:');
    categories.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count} products`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

seedMoreProducts();