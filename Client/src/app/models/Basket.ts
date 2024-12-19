export interface Basket {
    id: number
    buyerId: string
    items: BasketItem[]
  }
  
  export interface BasketItem {
    productId: number
    productName: string
    pictureUrl: string
    price: number
    quantity: number
    type: string
    brand: string
  }
  