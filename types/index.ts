export interface Customer {
  id: string
  phone: string
  balance: number
  name: string
  last_visit: string
}

export interface StoreLocation {
  id: string
  name: string
  customers: Customer[]
}

