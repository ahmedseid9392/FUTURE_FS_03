import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiShoppingBag, FiUser, FiLogOut } from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import ThemeToggle from '../common/ThemeToggle';
import CurrencyToggle from '../common/CurrencyToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();
    const cartItemsCount = useCartStore((state) => state.getTotalItems());
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

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

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-700 dark:text-dark-text hover:text-boutique-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                         <CurrencyToggle />

                        <Link to="/cart" className="relative">
                            <FiShoppingBag className="w-5 h-5 text-gray-700 dark:text-dark-text hover:text-boutique-primary transition-colors" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-boutique-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* User Dropdown - Fixed */}
                        {isAuthenticated && user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                                    aria-label="User menu"
                                >
                                    <FiUser className="w-5 h-5 text-gray-700 dark:text-dark-text" />
                                    <span className="text-sm hidden sm:inline dark:text-dark-text">{user.name?.split(' ')[0]}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 border border-gray-200 dark:border-dark-border z-50">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            My Orders
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-border"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <div className="border-t border-gray-200 dark:border-dark-border my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-border"
                                        >
                                            <FiLogOut className="w-4 h-4 inline mr-2" />
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

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t dark:border-dark-border">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {!isAuthenticated && (
                            <Link
                                to="/login"
                                className="block py-2 text-boutique-primary font-semibold"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign In
                            </Link>
                        )}
                        {isAuthenticated && user && (
                            <>
                                <Link
                                    to="/profile"
                                    className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/orders"
                                    className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Orders
                                </Link>
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="block py-2 text-gray-700 dark:text-dark-text hover:text-boutique-primary"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2 text-red-600 hover:text-boutique-primary"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;