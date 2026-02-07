export interface Store {
  id: number
  name: string
  storRef: string
  location?: string
  description?: string
  createdAt: string
  updatedAt: string
  product?: Product[]
}

export interface Currency {
  id: string
  name?: string
  symbol?: string
  code?: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  image?: {
    assetUrl: string
    assetId: string
  }
  store: Store
  currency: Currency
  createdAt: string
  updatedAt: string
}

export interface CreateProductDto {
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  storeId: number
  currencyId: string
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductFilters {
  category?: string
  storeId?: number
  minPrice?: number
  maxPrice?: number
  minQuantity?: number
  maxQuantity?: number
  search?: string
  limit?: number
  offset?: number
}

export interface ProductListResponse {
  data: Product[]
  pagination: {
    total: number
    limit: number
    offset: number
    totalPages: number
  }
}

export interface CreateStoreDto {
  name: string
  location?: string
  description?: string
}

export interface UpdateStoreDto extends Partial<CreateStoreDto> {}

export interface ApiError {
  message: string
  code?: number
  errors?: Record<string, string[]>
}
