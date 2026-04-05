import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-boutique-secondary dark:bg-dark-surface text-white mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-4">Jams Boutique</h3>
            <p className="text-gray-300 dark:text-dark-textMuted text-sm">
              Your destination for unique, stylish, and high-quality fashion pieces.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-300 dark:text-dark-textMuted hover:text-boutique-primary transition-colors text-sm">Shop</Link></li>
              <li><Link to="/about" className="text-gray-300 dark:text-dark-textMuted hover:text-boutique-primary transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 dark:text-dark-textMuted hover:text-boutique-primary transition-colors text-sm">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-300 dark:text-dark-textMuted hover:text-boutique-primary transition-colors text-sm">FAQ</Link></li>
            </ul>
            <Link to="/track-order" className="text-gray-300 hover:text-boutique-primary">
  Track Order
</Link>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact Info</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MdLocationOn className="w-4 h-4 mt-1 flex-shrink-0 text-gray-300 dark:text-dark-textMuted" />
                <span className="text-gray-300 dark:text-dark-textMuted text-sm">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center space-x-2">
                <MdPhone className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-dark-textMuted" />
                <span className="text-gray-300 dark:text-dark-textMuted text-sm">+251 911 234 567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MdEmail className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-dark-textMuted" />
                <span className="text-gray-300 dark:text-dark-textMuted text-sm">info@jamsboutique.com</span>
              </li>
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Follow Us</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 dark:text-dark-textMuted hover:text-boutique-primary transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 dark:text-dark-textMuted hover:text-boutique-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 dark:text-dark-textMuted hover:text-boutique-primary transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 dark:border-dark-border mt-8 pt-8 text-center text-gray-400 dark:text-dark-textMuted text-sm">
          <p>&copy; {new Date().getFullYear()} Jams Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;