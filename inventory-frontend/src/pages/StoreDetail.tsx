import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { storeApi, handleApiError } from '../services/api'
import type { Store, CreateStoreDto, ApiError } from '../types'
import Loading from '../components/Loading'
import ErrorDisplay from '../components/ErrorDisplay'
import './StoreDetail.css'

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const isNew = location.pathname === '/stores/new' || (id === 'new')
  const [isEditing, setIsEditing] = useState(false)

  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<CreateStoreDto>({
    name: '',
    location: '',
    description: '',
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!isNew && id) {
          const storeData = await storeApi.getById(Number(id))
          setStore(storeData)
          setFormData({
            name: storeData.name,
            location: storeData.location || '',
            description: storeData.description || '',
          })
          setIsEditing(false)
        }
      } catch (err) {
        console.error('Error loading store data:', err)
        setError(handleApiError(err))
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.pathname])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Store name is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setError(null)

      if (isNew) {
        await storeApi.create(formData)
        navigate('/stores')
      } else if (id) {
        await storeApi.update(Number(id), formData)
        setIsEditing(false)
        // Reload the store to show updated data
        const updatedStore = await storeApi.getById(Number(id))
        setStore(updatedStore)
        setFormData({
          name: updatedStore.name,
          location: updatedStore.location || '',
          description: updatedStore.description || '',
        })
      }
    } catch (err) {
      console.error('Error saving store:', err)
      setError(handleApiError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id || isNew) return

    if (!window.confirm('Are you sure you want to delete this store?')) {
      return
    }

    try {
      setSaving(true)
      setError(null)
      await storeApi.delete(Number(id))
      navigate('/stores')
    } catch (err) {
      console.error('Error deleting store:', err)
      setError(handleApiError(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error && !store && !isNew) {
    return <ErrorDisplay error={error} />
  }

  const showForm = isNew || isEditing

  return (
    <div className="store-detail">
      <div className="store-detail-header">
        <h2>
          {isNew ? 'Create Store' : isEditing ? 'Edit Store' : 'Store Details'}
        </h2>
        <div className="header-actions">
          {isNew ? null : !isEditing ? (
            <>
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                Delete
              </button>
            </>
          ) : null}
          <button className="btn btn-secondary" onClick={() => navigate('/stores')}>
            Back to List
          </button>
        </div>
      </div>

      {error && <ErrorDisplay error={error} />}

      {showForm ? (
        <form onSubmit={handleSubmit} className="store-form">
          <div className="form-group">
            <label htmlFor="name">
              Store Name <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={formErrors.name ? 'error' : ''}
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
            />
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

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isNew ? 'Create Store' : 'Update Store'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (isNew) {
                  navigate('/stores')
                } else {
                  setIsEditing(false)
                  if (id && store) {
                    setFormData({
                      name: store.name,
                      location: store.location || '',
                      description: store.description || '',
                    })
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
        <div className="store-view">
          {store && (
            <div className="store-info-view">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{store.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Reference:</span>
                <span className="info-value">{store.storRef}</span>
              </div>
              {store.location && (
                <div className="info-row">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{store.location}</span>
                </div>
              )}
              {store.description && (
                <div className="info-row">
                  <span className="info-label">Description:</span>
                  <span className="info-value">{store.description}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">Created:</span>
                <span className="info-value">
                  {new Date(store.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Updated:</span>
                <span className="info-value">
                  {new Date(store.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
