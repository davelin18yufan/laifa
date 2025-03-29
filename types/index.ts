export interface Customer {
  id: string
  phone: string
  balance: number
  name: string
  lastVisit: string
  transactionCount?: number
  totalSpent?: number
  latestNote?: Note | null
}

export interface StoreLocation {
  id: string
  name: string
  customers: Customer[]
}

export interface Member {
  memberId: string
  phone: string
  balance: number
  name: string
  lastBalanceUpdate: string
  birthday?: string
  gender?: "male" | "female" | "other"
  latestNote?: Note | null
}

export interface Note {
  noteId: string
  memberId: string
  category: string
  content: string
  createdAt: string 
  updatedAt: string 
}

export interface FrequentMembers {
  storeId: string
  storeName: string
  memberId: string
  phone: string
  name: string
  balance: number | null
  lastVisit: string | null
  transactionCount: number
  totalSpent: number
  latestNoteCategory: string | null
  latestNoteContent: string | null
  latestNoteDate: string | null
}