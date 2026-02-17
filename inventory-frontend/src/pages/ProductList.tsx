import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productApi, storeApi, handleApiError } from '../services/api';
import type { Product, ProductFilters, ApiError, Store } from '../types';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import './ProductList.css';

const ITEMS_PER_PAGE = 12;
const DEBOUNCE_DELAY = 1000; // 1s delay

export default function ProductList() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<ApiError | null>(null);

  const [filters, setFilters] = useState<ProductFilters>({
    limit: ITEMS_PER_PAGE,
    offset: 0,
  });
  const [pagination, setPagination] = useState({
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
    offset: 0,
    total: 0,
  });

  // Debounce timer ref
  const debounceTimerRef = useRef<number | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getAll(filters);
      setProducts(response.data || []);
      setPagination(
        response.pagination || {
          total: 0,
          offset: 0,
          totalPages: 0,
          limit: ITEMS_PER_PAGE,
        }
      );
    } catch (err) {
      console.error('Error loading products:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadStores = async () => {
    try {
      const data = await storeApi.getAll();
      setStores(data);
    } catch (err) {
      console.error('Failed to load stores:', err);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  // Debounced effect for filter changes
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      loadProducts();
    }, DEBOUNCE_DELAY);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [loadProducts]);

  const handleFilterChange = (
    key: keyof ProductFilters,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      offset: 0, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newOffset: number) => {
    setFilters((prev) => ({
      ...prev,
      offset: newOffset,
    }));
  };

  const clearFilters = () => {
    setFilters({
      limit: ITEMS_PER_PAGE,
      offset: 0,
    });
  };

  if (loading && products.length === 0) {
    return <Loading />;
  }

  if (error && products.length === 0) {
    return <ErrorDisplay error={error} onRetry={loadProducts} />;
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Products</h2>
        <Link to="/products/new" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, description, or category..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            placeholder="Filter by category..."
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="storeId">Store</label>
          <select
            id="storeId"
            value={filters.storeId || ''}
            onChange={(e) =>
              handleFilterChange(
                'storeId',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">All Stores</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="minPrice">Min Price</label>
          <input
            id="minPrice"
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) =>
              handleFilterChange(
                'minPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            id="maxPrice"
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              handleFilterChange(
                'maxPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>

        <button className="btn btn-secondary" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {error && products.length > 0 && (
        <div className="error-banner">
          <ErrorDisplay error={error} onRetry={loadProducts} />
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div className="empty-state">
          <p>
            No products found. Try adjusting your filters or create a new
            product.
          </p>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="product-card"
              >
                {product.image?.assetUrl && (
                  <div className="product-image">
                    <img src={product.image.assetUrl} alt={product.name} />
                  </div>
                )}
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-price">
                    {product.currency?.symbol || product.currency?.code || '$'}
                    {Number(product.price).toFixed(2)}
                  </p>
                  <p className="product-quantity">
                    Quantity: {product.quantity}
                  </p>
                  <p className="product-store">
                    Store: {product.store?.name || 'Unknown'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() =>
                  handlePageChange(pagination.offset - pagination.limit)
                }
                disabled={pagination.offset === 0}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {Math.floor(pagination.offset / pagination.limit) + 1} of{' '}
                {pagination.totalPages} ({pagination.total} total)
              </span>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  handlePageChange(pagination.offset + pagination.limit)
                }
                disabled={
                  pagination.offset + pagination.limit >= pagination.total
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
