"use client"

import { MotionNumber } from "@/components/MotionNumber"
import { useState } from "react"
import {
  FaSearch as Search,
  FaCoffee as Coffee,
  FaPlus as Plus,
  FaUsers as Users,
  FaMinus as Minus,
  FaStore as Store,
} from "react-icons/fa"

interface Customer {
  id: string
  phone: string
  balance: number
  name: string
  last_visit: string
}

interface StoreLocation {
  id: string
  name: string
  customers: Customer[]
}

// Mock data for store locations and their frequent customers
const mockStoreLocations: StoreLocation[] = [
  {
    id: "taipei",
    name: "台北店",
    customers: [
      {
        id: "1",
        phone: "0912345678",
        balance: 850,
        name: "王小明",
        last_visit: new Date(2025, 2, 20).toISOString(),
      },
      {
        id: "2",
        phone: "0923456789",
        balance: 1200,
        name: "林美美",
        last_visit: new Date(2025, 2, 22).toISOString(),
      },
    ],
  },
  {
    id: "taichung",
    name: "台中店",
    customers: [
      {
        id: "3",
        phone: "0934567890",
        balance: 500,
        name: "張大同",
        last_visit: new Date(2025, 2, 18).toISOString(),
      },
      {
        id: "4",
        phone: "0945678901",
        balance: 750,
        name: "李小華",
        last_visit: new Date(2025, 2, 21).toISOString(),
      },
    ],
  },
  {
    id: "kaohsiung",
    name: "高雄店",
    customers: [
      {
        id: "5",
        phone: "0956789012",
        balance: 980,
        name: "陳美玲",
        last_visit: new Date(2025, 2, 19).toISOString(),
      },
      {
        id: "6",
        phone: "0967890123",
        balance: 1500,
        name: "黃志明",
        last_visit: new Date(2025, 2, 23).toISOString(),
      },
    ],
  },
  {
    id: "Ilan",
    name: "宜蘭店",
    customers: [
      {
        id: "5",
        phone: "0956789012",
        balance: 980,
        name: "陳美玲",
        last_visit: new Date(2025, 2, 19).toISOString(),
      },
      {
        id: "6",
        phone: "0967890123",
        balance: 1500,
        name: "黃志明",
        last_visit: new Date(2025, 2, 23).toISOString(),
      },
    ],
  },
  {
    id: "Hualien",
    name: "花蓮店",
    customers: [
      {
        id: "5",
        phone: "0956789012",
        balance: 980,
        name: "陳美玲",
        last_visit: new Date(2025, 2, 19).toISOString(),
      },
      {
        id: "6",
        phone: "0967890123",
        balance: 1500,
        name: "黃志明",
        last_visit: new Date(2025, 2, 23).toISOString(),
      },
    ],
  },
]

// Mock data for frequent customers since we're ignoring API
const mockFrequentCustomers: Customer[] = [
  {
    id: "1",
    phone: "0912345678",
    balance: 850,
    name: "王小明",
    last_visit: new Date(2025, 2, 20).toISOString(),
  },
  {
    id: "2",
    phone: "0923456789",
    balance: 1200,
    name: "林美美",
    last_visit: new Date(2025, 2, 22).toISOString(),
  },
  {
    id: "3",
    phone: "0934567890",
    balance: 500,
    name: "張大同",
    last_visit: new Date(2025, 2, 18).toISOString(),
  },
]

export default function Home() {
  const [searchPhone, setSearchPhone] = useState("")
  const [amount, setAmount] = useState(0)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const [frequentCustomers, setFrequentCustomers] = useState<Customer[]>(
    mockFrequentCustomers
  )
  const [prevBalance, setPrevBalance] = useState<number | null>(null)
  const [balanceDiff, setBalanceDiff] = useState(0)
  const [activeStoreId, setActiveStoreId] = useState(mockStoreLocations[0].id)

  const handleSearch = async () => {
    // TODO: Search
    // Mock the search functionality
    const customer = mockFrequentCustomers.find(
      (c) => c.phone === searchPhone
    ) || {
      id: "12",
      phone: "0905126598",
      balance: 990,
      name: "黃晨瑋",
      last_visit: new Date().toISOString(),
    }

    setPrevBalance(null) // Reset previous balance
    setBalanceDiff(0) // Reset balance difference
    setCurrentCustomer(customer)
  }

  const handleAddFunds = async () => {
    // TODO:儲值
    if (!currentCustomer || amount <= 0) return

    // Store the previous balance before update
    setPrevBalance(currentCustomer.balance)

    // Calculate new balance
    const newBalance = currentCustomer.balance + amount

    // Calculate difference percentage for animation
    setBalanceDiff(amount)

    // Update customer data
    setCurrentCustomer({
      ...currentCustomer,
      balance: newBalance,
      last_visit: new Date().toISOString(),
    })

    // Reset amount input
    setAmount(0)
  }

  const handleProcessPurchase = async () => {
    // TODO:消費
    if (!currentCustomer || amount <= 0 || currentCustomer.balance < amount)
      return

    // Store the previous balance before update
    setPrevBalance(currentCustomer.balance)

    // Calculate new balance
    const newBalance = currentCustomer.balance - amount

    // Calculate difference percentage for animation (negative for purchase)
    const diff = -amount / currentCustomer.balance
    setBalanceDiff(diff)

    // Update customer data
    setCurrentCustomer({
      ...currentCustomer,
      balance: newBalance,
      last_visit: new Date().toISOString(),
    })

    // Reset amount input
    setAmount(0)
  }

  // Get the current active store's customers
  const getActiveStoreCustomers = () => {
    // TODO:常見會員
    const activeStore = mockStoreLocations.find(
      (store) => store.id === activeStoreId
    )
    return activeStore ? activeStore.customers : []
  }

  const handleDragTab = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const container = e.currentTarget
    let startX = e.pageX - container.offsetLeft
    let scrollLeft = container.scrollLeft

    const onMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - container.offsetLeft
      const walk = (x - startX) * 1 // Adjust scroll speed if needed
      container.scrollLeft = scrollLeft - walk
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      container.style.cursor = "grab"
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    container.style.cursor = "grabbing"
  }

  return (
    <div className="min-h-screen bg-[#F9F5F1] flex max-md:flex-col">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <Coffee className="h-8 w-8 text-amber-700" />
              <h1 className="text-3xl font-bold text-amber-900">會員專區</h1>
            </div>
          </header>

          {/* Search Section */}
          <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              查詢會員餘額
            </h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="tel"
                  placeholder="請輸入電話號碼"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {currentCustomer && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                <h3 className="font-semibold text-amber-900">
                  {currentCustomer.name}
                </h3>
                <div className="text-amber-700">
                  目前餘額:{" "}
                  <MotionNumber
                    value={currentCustomer.balance}
                    diff={balanceDiff}
                  />
                </div>
                <p className="text-sm text-amber-600 mt-2">
                  上次更新時間:{" "}
                  {new Date(currentCustomer.last_visit).toLocaleDateString()}
                </p>
              </div>
            )}
          </section>

          {/* Pricing Calculator */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              餘額更新
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAmount(Math.max(0, amount - 50))}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Minus className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(Math.max(0, Number(e.target.value)))
                  }
                  className="w-32 px-4 py-2 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() => setAmount(amount + 5)}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Plus className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleAddFunds}
                  disabled={!currentCustomer || amount <= 0}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  儲值
                </button>
                <button
                  onClick={handleProcessPurchase}
                  disabled={
                    !currentCustomer ||
                    amount <= 0 ||
                    (currentCustomer && currentCustomer.balance < amount)
                  }
                  className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  消費
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 常見會員 Sidebar */}
      <div className="max-md:w-full w-80 bg-white shadow-lg flex flex-col ">
        {/* Tab Headers */}
        <div className="flex border-b overflow-hidden cursor-grab" onMouseDown={handleDragTab}>
          {mockStoreLocations.map((store) => (
            <button
              key={store.id}
              onClick={() => setActiveStoreId(store.id)}
              className={`flex-1 py-4 px-2 text-center font-medium text-sm transition-colors min-w-20 ${
                activeStoreId === store.id
                  ? "border-b-2 border-amber-600 text-amber-800"
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <Store className="h-4 w-4 mb-1" />
                {store.name}
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-amber-700" />
            <h2 className="text-lg font-semibold text-gray-800">常見會員</h2>
          </div>

          <div className="space-y-4 grid grid-cols-2 md:block">
            {getActiveStoreCustomers().map((customer) => (
              <button
                key={customer.id}
                onClick={() => {
                  setSearchPhone(customer.phone)
                  setCurrentCustomer(customer)
                  setPrevBalance(null)
                  setBalanceDiff(0)
                }}
                className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <p className="font-medium text-gray-800">{customer.name}</p>
                <p className="text-sm text-gray-600">{customer.phone}</p>
                <p className="text-sm font-medium text-amber-600">
                  餘額: ${customer.balance.toFixed(2)}
                </p>
              </button>
            ))}

            {getActiveStoreCustomers().length === 0 && (
              <div className="text-center text-gray-500 py-4">
                此分店目前沒有常見會員
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
