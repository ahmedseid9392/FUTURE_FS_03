import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, columns = 4 }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-dark-card h-64 rounded-lg"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-dark-card rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-card rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-dark-card rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-dark-textMuted">No products found.</p>
      </div>
    );
  }
  
  console.log('ProductGrid rendering products:', products.length);
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  
  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;