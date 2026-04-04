import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiTrendingUp, FiClock, FiPackage } from 'react-icons/fi';
import { searchService } from '../../services/searchService';
import { debounce } from '../../utils/helpers';

const SearchAutocomplete = ({ onSearch, placeholder = "Search products...", initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
    loadPopularSearches();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadPopularSearches = async () => {
    const result = await searchService.getPopularSearches();
    if (result.success) {
      setPopularSearches(result.data.searches || []);
    }
  };

  const saveRecentSearch = (searchQuery) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const fetchSuggestions = debounce(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const result = await searchService.getSuggestions(searchQuery);
    if (result.success) {
      setSuggestions(result.data.suggestions || []);
    }
    setIsLoading(false);
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    
    if (value.length >= 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (searchQuery) => {
    if (searchQuery && searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const searchTerm = typeof suggestion === 'object' ? suggestion.name : suggestion;
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="input-field pl-12 pr-12 py-3 w-full"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-200 dark:border-dark-border z-50 overflow-hidden max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-boutique-primary mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-dark-surface">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Suggestions</p>
                  </div>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-border transition-colors flex items-center gap-3"
                    >
                      <FiSearch className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-dark-text">
                        {suggestion.name || suggestion}
                      </span>
                      {suggestion.count && (
                        <span className="text-xs text-gray-400 ml-auto">
                          {suggestion.count} products
                        </span>
                      )}
                      {suggestion.type === 'category' && (
                        <span className="text-xs text-boutique-primary ml-auto">Category</span>
                      )}
                      {suggestion.type === 'tag' && (
                        <span className="text-xs text-purple-500 ml-auto">Tag</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && suggestions.length === 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-dark-surface flex justify-between items-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Recent Searches</p>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('recentSearches');
                      }}
                      className="text-xs text-boutique-primary hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-dark-border transition-colors flex items-center gap-3"
                    >
                      <FiClock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-dark-text">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              {popularSearches.length > 0 && suggestions.length === 0 && recentSearches.length === 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-dark-surface">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Popular Searches</p>
                  </div>
                  <div className="p-3 flex flex-wrap gap-2">
                    {popularSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-3 py-1 bg-gray-100 dark:bg-dark-surface rounded-full text-sm hover:bg-boutique-primary hover:text-white transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {query.length >= 2 && suggestions.length === 0 && (
                <div className="p-8 text-center">
                  <FiPackage className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 dark:text-dark-textMuted">No products found for "{query}"</p>
                  <p className="text-sm text-gray-500 mt-1">Try different keywords or browse our categories</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;