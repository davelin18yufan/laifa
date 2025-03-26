export interface Customer {
  id: string;
  phone: string;
  balance: number;
  name: string;
  lastVisit: string;
  transactionCount?: number;
  totalSpent?: number;
  latestNote?: { category: string; content: string } | null;
}

export interface StoreLocation {
  id: string;
  name: string;
  customers: Customer[];
}

export interface Member {
  memberId: string
  phone: string
  balance: number
  name: string
  lastBalanceUpdate: string
  birthday?: string
  gender?: "male" | "female" | "other"
}
