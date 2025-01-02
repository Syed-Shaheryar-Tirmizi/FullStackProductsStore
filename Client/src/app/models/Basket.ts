export interface Basket {
    id: number
    buyerId: string
    items: BasketItem[]
    paymentIntentId?: string
    clientSecret?: string
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
  