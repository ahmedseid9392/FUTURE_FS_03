import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock,
  FiSend,
  FiCheckCircle,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset submitted status after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Visit Us',
      details: ['123 Fashion Street', 'Addis Ababa, Ethiopia', 'Bole Sub-city, Woreda 03'],
      color: 'text-red-500'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      details: ['+251 911 234 567', '+251 922 345 678'],
      color: 'text-green-500'
    },
    {
      icon: FiMail,
      title: 'Email Us',
      details: ['info@jamsboutique.com', 'support@jamsboutique.com'],
      color: 'text-blue-500'
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 8:00 PM', 'Saturday: 10:00 AM - 6:00 PM', 'Sunday: Closed'],
      color: 'text-purple-500'
    }
  ];

  const socialLinks = [
    { icon: FiFacebook, name: 'Facebook', url: '#', color: 'bg-blue-600' },
    { icon: FiInstagram, name: 'Instagram', url: '#', color: 'bg-pink-600' },
    { icon: FiTwitter, name: 'Twitter', url: '#', color: 'bg-sky-500' },
    { icon: FiLinkedin, name: 'LinkedIn', url: '#', color: 'bg-blue-700' }
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
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-dark-textMuted max-w-3xl mx-auto">
              We'd love to hear from you. Get in touch with our team for any inquiries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className={`${info.color} w-12 h-12 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <info.icon className={`w-6 h-6 ${info.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {info.title}
              </h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-sm text-gray-600 dark:text-dark-textMuted">
                  {detail}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-dark-card rounded-lg shadow-md p-8"
            >
              <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 dark:text-dark-textMuted">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Please describe your inquiry..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <FiSend className="w-4 h-4" />
                    )}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.2!2d38.7468!3d9.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85e2b2b2b2b2%3A0x2b2b2b2b2b2b2b2b!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Store Location"
                  className="rounded-lg"
                ></iframe>
              </div>

              {/* Social Media */}
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  Connect With Us
                </h3>
                <p className="text-center text-gray-600 dark:text-dark-textMuted mb-6">
                  Follow us on social media for updates, promotions, and fashion inspiration
                </p>
                <div className="flex justify-center gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} p-3 rounded-full text-white hover:scale-110 transition-transform`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-r from-boutique-primary/10 to-boutique-light dark:from-boutique-primary/5 dark:to-boutique-secondary/10 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Frequently Asked Questions
                </h3>
                <p className="text-sm text-gray-600 dark:text-dark-textMuted mb-4">
                  Find quick answers to common questions
                </p>
                <a href="/faq" className="text-boutique-primary hover:underline font-medium">
                  View FAQ →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-boutique-primary to-boutique-accent rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-playfair font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, new arrivals, and fashion tips
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-boutique-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;