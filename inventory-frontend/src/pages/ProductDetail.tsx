import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  productApi,
  storeApi,
  currencyApi,
  handleApiError,
} from '../services/api';
import type {
  Product,
  CreateProductDto,
  Store,
  Currency,
  ApiError,
} from '../types';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = location.pathname === '/products/new' || id === 'new';
  const [isEditing, setIsEditing] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    category: '',
    price: 0,
    quantity: 0,
    description: '',
    storeId: 0,
    currencyId: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [storesData, currenciesData] = await Promise.all([
          storeApi.getAll(),
          currencyApi.getAll(),
        ]);

        setStores(storesData || []);
        setCurrencies(currenciesData || []);

        if (!isNew && id) {
          const productData = await productApi.getById(Number(id));
          setProduct(productData);
          setFormData({
            name: productData.name,
            category: productData.category,
            price: Number(productData.price),
            quantity: Number(productData.quantity),
            description: productData.description || '',
            storeId: productData.store?.id || 0,
            currencyId: productData.currency?.id || '',
          });
          if (productData.image?.assetUrl) {
            setImagePreview(productData.image.assetUrl);
          }
          setIsEditing(false);
        } else if (
          storesData &&
          storesData.length > 0 &&
          currenciesData &&
          currenciesData.length > 0
        ) {
          setFormData((prev) => ({
            ...prev,
            storeId: storesData[0]?.id || 0,
            currencyId: currenciesData[0]?.id || '',
          }));
        }
      } catch (err) {
        console.error('Error loading product data:', err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.pathname]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (formData.quantity < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }

    if (!formData.storeId) {
      errors.storeId = 'Store is required';
    }

    if (!formData.currencyId) {
      errors.currencyId = 'Currency is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'quantity' || name === 'storeId'
          ? Number(value)
          : value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors((prev) => ({
          ...prev,
          image: 'File must be an image',
        }));
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          image: 'Image size must be less than 10MB',
        }));
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (formErrors.image) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isNew) {
        await productApi.create(formData, imageFile || undefined);
        navigate('/products');
      } else if (id) {
        await productApi.update(Number(id), formData, imageFile || undefined);
        setIsEditing(false);
        // Reload the product to show updated data
        const updatedProduct = await productApi.getById(Number(id));
        setProduct(updatedProduct);
        setFormData({
          name: updatedProduct.name,
          category: updatedProduct.category,
          price: Number(updatedProduct.price),
          quantity: Number(updatedProduct.quantity),
          description: updatedProduct.description || '',
          storeId: updatedProduct.store?.id || 0,
          currencyId: updatedProduct.currency?.id || '',
        });
        if (updatedProduct.image?.assetUrl) {
          setImagePreview(updatedProduct.image.assetUrl);
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNew) return;

    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await productApi.delete(Number(id));
      navigate('/products');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !product && !isNew) {
    return <ErrorDisplay error={error} />;
  }

  const showForm = isNew || isEditing;

  return (
    <div className="product-detail">
      <div className="product-detail-header">
        <h2>
          {isNew
            ? 'Create Product'
            : isEditing
              ? 'Edit Product'
              : 'Product Details'}
        </h2>
        <div className="header-actions">
          {isNew ? null : !isEditing ? (
            <>
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete
              </button>
            </>
          ) : null}
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/products')}
          >
            Back to List
          </button>
        </div>
      </div>

      {error && <ErrorDisplay error={error} />}

      {showForm ? (
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                Product Name <span className="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && (
                <span className="error-message">{formErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleInputChange}
                className={formErrors.category ? 'error' : ''}
              />
              {formErrors.category && (
                <span className="error-message">{formErrors.category}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Price <span className="required">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className={formErrors.price ? 'error' : ''}
              />
              {formErrors.price && (
                <span className="error-message">{formErrors.price}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                Quantity <span className="required">*</span>
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleInputChange}
                className={formErrors.quantity ? 'error' : ''}
              />
              {formErrors.quantity && (
                <span className="error-message">{formErrors.quantity}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="storeId">
                Store <span className="required">*</span>
              </label>
              <select
                id="storeId"
                name="storeId"
                value={formData.storeId}
                onChange={handleInputChange}
                className={formErrors.storeId ? 'error' : ''}
              >
                <option value={0}>Select a store</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
              {formErrors.storeId && (
                <span className="error-message">{formErrors.storeId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="currencyId">
                Currency <span className="required">*</span>
              </label>
              <select
                id="currencyId"
                name="currencyId"
                value={formData.currencyId}
                onChange={handleInputChange}
                className={formErrors.currencyId ? 'error' : ''}
              >
                <option value="">Select a currency</option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.name || currency.code} (
                    {currency.symbol || currency.code})
                  </option>
                ))}
              </select>
              {formErrors.currencyId && (
                <span className="error-message">{formErrors.currencyId}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={formErrors.image ? 'error' : ''}
            />
            {formErrors.image && (
              <span className="error-message">{formErrors.image}</span>
            )}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? 'Saving...'
                : isNew
                  ? 'Create Product'
                  : 'Update Product'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (isNew) {
                  navigate('/products');
                } else {
                  setIsEditing(false);
                  // Reload product data to reset form
                  if (id) {
                    productApi.getById(Number(id)).then((productData) => {
                      setProduct(productData);
                      setFormData({
                        name: productData.name,
                        category: productData.category,
                        price: Number(productData.price),
                        quantity: Number(productData.quantity),
                        description: productData.description || '',
                        storeId: productData.store?.id || 0,
                        currencyId: productData.currency?.id || '',
                      });
                      if (productData.image?.assetUrl) {
                        setImagePreview(productData.image.assetUrl);
                      }
                    });
                  }
                }
              }}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="product-view">
          {product && (
            <>
              {product.image?.assetUrl && (
                <div className="product-image-view">
                  <img src={product.image.assetUrl} alt={product.name} />
                </div>
              )}
              <div className="product-info-view">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{product.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{product.category}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Price:</span>
                  <span className="info-value">
                    {product.currency?.symbol || product.currency?.code || '$'}
                    {Number(product.price).toFixed(2)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Quantity:</span>
                  <span className="info-value">{product.quantity}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Store:</span>
                  <span className="info-value">
                    {product.store?.name || 'Unknown'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Currency:</span>
                  <span className="info-value">
                    {product.currency?.name || product.currency?.code || 'N/A'}
                  </span>
                </div>
                {product.description && (
                  <div className="info-row">
                    <span className="info-label">Description:</span>
                    <span className="info-value">{product.description}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Created:</span>
                  <span className="info-value">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Updated:</span>
                  <span className="info-value">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
