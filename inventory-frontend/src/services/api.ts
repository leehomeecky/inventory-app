import axios, { AxiosError } from 'axios'
import type {
  Product,
  ProductListResponse,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  Store,
  CreateStoreDto,
  UpdateStoreDto,
  Currency,
  ApiError,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL)
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Error handler
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
    return {
      message: axiosError.response?.data?.message || error.message || 'An error occurred',
      code: axiosError.response?.status,
      errors: axiosError.response?.data?.errors,
    }
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  }
}

// Products API
export const productApi = {
  getAll: async (filters?: ProductFilters): Promise<ProductListResponse> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    const queryString = params.toString()
    const url = queryString ? `/product?${queryString}` : '/product'
    const response = await api.get<ProductListResponse>(url)
    const data = response.data
    if (data?.data) {
      data.data = data.data.map((product) => ({
        ...product,
        price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
        quantity: typeof product.quantity === 'number' ? product.quantity : Number(product.quantity) || 0,
      }))
    }
    return data
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/product/${id}`)
    // Ensure numeric fields are properly converted
    const product = response.data
    return {
      ...product,
      price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
      quantity: typeof product.quantity === 'number' ? product.quantity : Number(product.quantity) || 0,
    }
  },

  create: async (data: CreateProductDto, imageFile?: File): Promise<void> => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })
    if (imageFile) {
      formData.append('image', imageFile)
    }
    await api.post('/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Backend returns { message, code } - we don't need to do anything with it
  },

  update: async (id: number, data: UpdateProductDto, imageFile?: File): Promise<void> => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })
    if (imageFile) {
      formData.append('image', imageFile)
    }
    await api.put(`/product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/product/${id}`)
  },
}

// Stores API
export const storeApi = {
  getAll: async (): Promise<Store[]> => {
    const response = await api.get<Store[]>('/store')
    return response.data
  },

  getById: async (id: number): Promise<Store> => {
    const response = await api.get<Store>(`/store/${id}`)
    return response.data
  },

  create: async (data: CreateStoreDto): Promise<void> => {
    await api.post('/store', data)
  },

  update: async (id: number, data: UpdateStoreDto): Promise<void> => {
    await api.put(`/store/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/store/${id}`)
  },
}

// Currencies API
export const currencyApi = {
  getAll: async (): Promise<Currency[]> => {
    try {
      const response = await api.get<{ currencies: Currency[] }>('/miscellaneous/currency/list')
      return response.data.currencies
    } catch {
      // Fallback: return common currencies if endpoint doesn't exist
      return [
        { id: 'USD', name: 'US Dollar', symbol: '$', code: 'USD' },
        { id: 'EUR', name: 'Euro', symbol: '€', code: 'EUR' },
        { id: 'GBP', name: 'British Pound', symbol: '£', code: 'GBP' },
      ]
    }
  },
}
