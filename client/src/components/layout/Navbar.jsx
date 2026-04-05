import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiShoppingBag, FiLogOut, FiUser, FiPackage, FiClipboard, FiSearch } from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import ThemeToggle from '../common/ThemeToggle';
import UserAvatar from '../common/UserAvatar';
import SearchAutocomplete from '../search/SearchAutocomplete';
import { FiHeart } from 'react-icons/fi';
import { useWishlistStore } from '../../store/wishlistStore';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
const wishlistCount = useWishlistStore((state) => state.getTotalItems());
  const handleSearch = (query) => {
    if (query && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setMobileSearchOpen(false);
    } else {
      // Clear search - navigate to shop page to show all products
      navigate('/shop');
      setMobileSearchOpen(false);
    }
  };

  useEffect(() => {
    // Check authentication on mount
    checkAuth();
  }, [checkAuth]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setIsDropdownOpen(false);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  
  // Check if link is active
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className="bg-white dark:bg-dark-surface shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-playfair font-bold text-boutique-primary">
              Jams Boutique
            </Link>
          </div>
          
          {/* Desktop Navigation with Active Link Indicator */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-1 py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary transition-colors group ${
                  isActiveLink(link.path) ? 'text-boutique-primary' : ''
                }`}
              >
                {link.name}
                {/* Active Indicator */}
                {isActiveLink(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-boutique-primary rounded-full"></span>
                )}
                {/* Hover Indicator */}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-boutique-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            ))}
          </div>
          
          {/* Desktop Search */}
          <div className="hidden md:flex items-center w-80">
            <SearchAutocomplete onSearch={handleSearch} placeholder="Search products..." />
          </div>
          
          {/* Icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden text-gray-700 dark:text-dark-text"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            
            {/* Cart Icon - Only for customers (not admin) */}
            {isAuthenticated && user?.role === 'customer' && (
              <Link to="/cart" className="relative">
                <FiShoppingBag className="w-5 h-5 text-gray-700 dark:text-dark-text hover:text-boutique-primary transition-colors" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-boutique-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
            )}
               {isAuthenticated && user?.role === 'customer' && (
            <Link to="/wishlist" className="relative">
  <FiHeart className="w-5 h-5 text-gray-700 dark:text-dark-text hover:text-boutique-primary transition-colors" />
  {wishlistCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-boutique-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {wishlistCount}
    </span>
  )}
</Link>
  )}
 
 
        
           
            
            {/* User Dropdown with Avatar */}
            {isAuthenticated && user ? (
              <div 
                className="relative" 
                ref={dropdownRef}
              >
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-boutique-primary transition-all focus:outline-none"
                  aria-label="User menu"
                >
                  <UserAvatar user={user} size="md" />
                  <span className="text-sm hidden sm:inline dark:text-dark-text ml-1">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>
                
                {/* Dropdown Menu - Opens on Click */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 border border-gray-200 dark:border-dark-border z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} size="md" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-dark-textMuted">{user.email}</p>
                          <p className="text-xs text-boutique-primary mt-1 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Customer Links */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiUser className="w-4 h-4" />
                      My Profile
                    </Link>
                    
                    {/* Cart link for customers in dropdown */}
                    {user.role === 'customer' && (
                      <Link
                        to="/cart"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiShoppingBag className="w-4 h-4" />
                        My Cart ({cartItemsCount})
                      </Link>
                    )}
                    
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiClipboard className="w-4 h-4" />
                      My Orders
                    </Link>
                    <Link
  to="/wishlist"
  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
  onClick={() => setIsDropdownOpen(false)}
>
  <FiHeart className="w-4 h-4" />
  My Wishlist ({wishlistCount})
</Link>
                    
                    {/* Admin Links - Only for admin */}
                    {user.role === 'admin' && (
                      <>
                        <div className="border-t border-gray-200 dark:border-dark-border my-1"></div>
                        <p className="px-4 py-1 text-xs text-gray-400 uppercase">Admin Section</p>
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiPackage className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    
                    <div className="border-t border-gray-200 dark:border-dark-border my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                Sign In
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 dark:text-dark-text"
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar (expanded) */}
        {mobileSearchOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-dark-border">
            <SearchAutocomplete onSearch={handleSearch} placeholder="Search products..." />
          </div>
        )}
        
        {/* Mobile Navigation with Active Link Indicator */}
        {isOpen && (
          <div className="md:hidden py-4 border-t dark:border-dark-border">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 transition-colors ${
                  isActiveLink(link.path)
                    ? 'text-boutique-primary font-semibold'
                    : 'text-gray-700 dark:text-dark-text hover:text-boutique-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
                {isActiveLink(link.path) && (
                  <span className="ml-2 text-xs text-boutique-primary">✓</span>
                )}
              </Link>
            ))}
   
            
            {/* Cart in mobile menu - only for customers */}
            {isAuthenticated && user?.role === 'customer' && (
              <Link
                to="/cart"
                className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                onClick={() => setIsOpen(false)}
              >
                Cart ({cartItemsCount})
              </Link>
            )}
                          
            {isAuthenticated && user && (
              <>
                <div className="flex items-center gap-3 py-3 border-t border-gray-200 dark:border-dark-border mt-2">
                  <UserAvatar user={user} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-boutique-primary capitalize">{user.role}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                {/* Cart link for customers in mobile menu */}
                {user.role === 'customer' && (
                  <Link
                    to="/cart"
                    className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    My Cart ({cartItemsCount})
                  </Link>
                  
                )}
 {user.role === 'customer' && (
                <Link
  to="/wishlist"
  className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
  onClick={() => setIsOpen(false)}
>
  Wishlist ({wishlistCount})
</Link>
        )}
                <Link
                  to="/orders"
                  className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                  onClick={() => setIsOpen(false)}
                >
                  My Orders
                </Link>
                {user.role === 'admin' && (
                  <>
                    <div className="border-t border-gray-200 dark:border-dark-border my-2"></div>
                    <p className="px-2 py-1 text-xs text-gray-400">Admin Section</p>
                    <Link
                      to="/admin"
                      className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600 hover:text-boutique-primary mt-2 border-t border-gray-200 dark:border-dark-border pt-2"
                >
                  Logout
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-boutique-primary font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;