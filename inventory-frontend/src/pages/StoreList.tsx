import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storeApi, handleApiError } from '../services/api';
import type { Store, ApiError } from '../types';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import './StoreList.css';

export default function StoreList() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<ApiError | null>(null);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storeApi.getAll();
      setStores(data || []);
    } catch (err) {
      console.error('Error loading stores:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await storeApi.delete(id);
      loadStores();
    } catch (err) {
      console.error('Error deleting store:', err);
      setError(handleApiError(err));
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && stores.length === 0) {
    return <ErrorDisplay error={error} onRetry={loadStores} />;
  }

  return (
    <div className="store-list">
      <div className="store-list-header">
        <h2>Stores</h2>
        <Link to="/stores/new" className="btn btn-primary">
          + Add Store
        </Link>
      </div>

      {error && stores.length > 0 && (
        <div className="error-banner">
          <ErrorDisplay error={error} onRetry={loadStores} />
        </div>
      )}

      {stores.length === 0 ? (
        <div className="empty-state">
          <p>No stores found. Create your first store to get started.</p>
        </div>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <div className="store-info">
                <h3>{store.name}</h3>
                <p className="store-ref">Ref: {store.storRef}</p>
                {store.location && (
                  <p className="store-location">📍 {store.location}</p>
                )}
                {store.description && (
                  <p className="store-description">{store.description}</p>
                )}
                <div className="store-meta">
                  <span>
                    Created: {new Date(store.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="store-actions">
                <Link to={`/stores/${store.id}`} className="btn btn-secondary">
                  View
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(store.id, store.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
