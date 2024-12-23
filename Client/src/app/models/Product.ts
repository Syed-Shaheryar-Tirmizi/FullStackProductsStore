export interface Product{
    id: number
    quantityInStock: number
    price: number
    name: string
    description: string
    pictureUrl: string
    type: string
    brand: string
}

export interface ProductParams{
    orderBy: string
    searchTerm?: string
    pageNumber?: number
    pageSize?: number
    types: string[]
    brands: string[]
}