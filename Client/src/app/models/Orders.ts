export interface Orders {
    id: number;
    buyerId: string;
    shippingAddress: ShippingAddress;
    orderDate: string;
    items: Item[];
    subTotal: number;
    deliveryFee: number;
    status: string;
    total: number;
  }
  
  export interface Item {
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
  }
  
  export interface ShippingAddress {
    fullName: string;
    country: string;
    city: string;
    state: string;
    zipCode: string;
    addressLine1: string;
    addressLine2: string;
  }