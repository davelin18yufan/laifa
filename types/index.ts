export interface Customer {
  id: string
  phone: string
  balance: number
  name: string
  gender: "male" | "female"
  lastVisit: string
  transactionCount?: number
  totalSpent?: number
  latestNote?: Note | null
  storeId: string
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
  gender: "male" | "female" 
  latestNote?: Note | null
  storeId: string
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
  gender: "male" | "female"
  balance: number | null
  lastVisit: string | null
  transactionCount: number
  totalSpent: number
  latestNoteCategory: string | null
  latestNoteContent: string | null
  latestNoteDate: string | null
}

export interface BusinessOverview {
  totalMembers: number;
  totalConsumption: number;
  totalDeposit: number;
  avgMemberBalance: number;
}

export interface PeakTransactionHour {
  hourOfDay: number;
  transactionCount: number;
}

export interface NoteCategoryStat {
  category: string;
  noteCount: number;
  uniqueMembers: number;
}

export interface StorePerformance {
  storeId: string;
  storeName: string;
  totalConsumption: number;
  totalDeposit: number;
  frequentMemberRatio: number;
}

export interface TopSpendingMember {
  memberId: string;
  phone: string;
  name: string;
  totalSpent: number;
}