interface productInOder {
    _id: string,
    image: string,
    name: string,
    quantity: number,
    price: number;
}

export interface IOder {
    _id: string;
    customerName: string;
    phoneNumber: string;
    note: string;
    email: string;
    address: string;
    products:productInOder[]
    createdAt: string;
    pay:boolean,
    status:string,
    totalPayment:number,
    invoiceId:string
  }