import { motion } from 'framer-motion';
import { 
  FiHeart, 
  FiTruck, 
  FiShield, 
  FiThumbsUp,
  FiAward,
  FiUsers,
  FiGlobe,
  FiStar,
  FiShoppingBag,
  FiRefreshCw,
  FiMail,
  FiMapPin,
  FiPhone
} from 'react-icons/fi';

const AboutPage = () => {
  const features = [
    {
      icon: FiHeart,
      title: 'Quality Products',
      description: 'We carefully curate each product to ensure the highest quality standards.',
      color: 'text-red-500'
    },
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50 with quick delivery to your doorstep.',
      color: 'text-blue-500'
    },
    {
      icon: FiShield,
      title: 'Secure Shopping',
      description: 'Your payment and personal information are always protected.',
      color: 'text-green-500'
    },
    {
      icon: FiRefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy. Not satisfied? We\'ll make it right.',
      color: 'text-purple-500'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Happy Customers', icon: FiUsers },
    { number: '1000+', label: 'Products Sold', icon: FiShoppingBag },
    { number: '98%', label: 'Customer Satisfaction', icon: FiThumbsUp },
    { number: '24/7', label: 'Customer Support', icon: FiStar }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Passionate about fashion with over 15 years of experience in the industry.'
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Award-winning designer bringing unique perspectives to every collection.'
    },
    {
      name: 'Emma Williams',
      role: 'Customer Experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Dedicated to ensuring every customer has an exceptional experience.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-boutique-primary/10 to-boutique-light dark:from-boutique-primary/5 dark:to-boutique-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
              Our Story
            </h1>
            <p className="text-xl text-gray-600 dark:text-dark-textMuted max-w-3xl mx-auto">
              Discover the passion and dedication behind Jams Boutique
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
              Who We Are
            </h2>
            <div className="w-20 h-1 bg-boutique-primary mb-6"></div>
            <p className="text-gray-600 dark:text-dark-textMuted mb-4 leading-relaxed">
              Jams Boutique was founded in 2020 with a simple mission: to bring unique, 
              high-quality fashion pieces to style-conscious individuals who appreciate 
              elegance and authenticity.
            </p>
            <p className="text-gray-600 dark:text-dark-textMuted mb-4 leading-relaxed">
              What started as a small passion project has grown into a beloved destination 
              for fashion enthusiasts across Ethiopia and beyond. We believe that everyone 
              deserves to express themselves through beautiful, well-crafted clothing and 
              accessories.
            </p>
            <p className="text-gray-600 dark:text-dark-textMuted leading-relaxed">
              Our team carefully selects each item, ensuring that every piece in our 
              collection meets our high standards for quality, style, and sustainability.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600"
              alt="Boutique Store"
              className="rounded-lg shadow-xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-boutique-primary text-white p-4 rounded-lg shadow-lg">
              <p className="text-2xl font-bold">4+ Years</p>
              <p className="text-sm">Of Excellence</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-gray-50 dark:bg-dark-surface py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-dark-card rounded-lg p-8 shadow-md text-center"
            >
              <div className="w-16 h-16 bg-boutique-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-8 h-8 text-boutique-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-dark-textMuted">
                To empower individuals to express their unique style through carefully 
                curated, high-quality fashion pieces that combine elegance, comfort, 
                and sustainability.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-dark-card rounded-lg p-8 shadow-md text-center"
            >
              <div className="w-16 h-16 bg-boutique-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiGlobe className="w-8 h-8 text-boutique-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-dark-textMuted">
                To become Ethiopia's leading online fashion destination, known for 
                exceptional quality, outstanding customer service, and a commitment 
                to ethical fashion.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 dark:text-dark-textMuted max-w-2xl mx-auto">
            We're committed to providing the best shopping experience for our customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 bg-white dark:bg-dark-card rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 ${feature.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-dark-textMuted">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-boutique-primary to-boutique-accent py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center text-white"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-600 dark:text-dark-textMuted max-w-2xl mx-auto">
            Passionate individuals dedicated to bringing you the best fashion experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-48 h-48 rounded-full object-cover mx-auto mb-4 border-4 border-boutique-primary"
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-boutique-primary font-medium mb-2">{member.role}</p>
              <p className="text-gray-600 dark:text-dark-textMuted text-sm">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;