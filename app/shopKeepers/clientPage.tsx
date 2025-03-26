"use client"

import { MotionNumber } from "@/components/MotionNumber"
import { Customer, StoreLocation } from "@/types"
import FrequentCustomers from "components/FrequentCustomers"
import { useEffect, useRef, useState } from "react"
import {
  FaSearch as Search,
  FaCoffee as Coffee,
  FaPlus as Plus,
  FaMinus as Minus,
  FaUserPlus as UserPlus,
} from "react-icons/fa"
import { getMembers } from "@/actions/member.action"
import { recordTransaction } from "@/actions/transaction.action"
import { SparklesText } from "components/SparklesText"
import { debounce } from "@/lib/utils"
import { FiRefreshCw } from "react-icons/fi"

export default function ClientPage({
  storeLocations,
}: {
  storeLocations: StoreLocation[]
}) {
  const [searchPhone, setSearchPhone] = useState("")
  const [amount, setAmount] = useState(0)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const [prevBalance, setPrevBalance] = useState<number | null>(null)
  const [balanceDiff, setBalanceDiff] = useState(0)
  const [currentStoreId, setCurrentStoreId] = useState<string>(
    storeLocations[0]?.id || ""
  )
  const [searchResults, setSearchResults] = useState<Customer[]>([])
  const searchResultsRef = useRef<HTMLDivElement>(null)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneInput = e.target.value
    setSearchPhone(phoneInput)

    if (phoneInput.length > 2) {
      // 至少輸入 3 位才觸發搜尋
      try {
        const search = debounce(async () => {
          const members = await getMembers(phoneInput)
          setSearchResults(
            members.map((m) => ({
              id: m.memberId,
              phone: m.phone,
              balance: m.balance,
              name: m.name,
              lastVisit: m.lastBalanceUpdate,
            }))
          )
        }, 300)
        search()
      } catch (error) {
        console.error("Instant search failed:", error)
        setSearchResults([])
      }
    } else {
      setSearchResults([])
      setCurrentCustomer(null)
    }
  }

  const handleAddFunds = async () => {
    if (!currentCustomer || amount <= 0) return

    try {
      setPrevBalance(currentCustomer.balance)

      await recordTransaction({
        memberId: currentCustomer.id,
        storeId: currentStoreId,
        type: "deposit",
        amount,
      })

      const newBalance = currentCustomer.balance + amount
      setBalanceDiff(amount)
      setCurrentCustomer({
        ...currentCustomer,
        balance: newBalance,
        lastVisit: new Date().toISOString(),
      })
      setAmount(0)
    } catch (error) {
      console.error("Add funds failed:", error)
      alert("儲值失敗，請稍後再試")
    }
  }

  const handleProcessPurchase = async () => {
    if (!currentCustomer || amount <= 0 || currentCustomer.balance < amount)
      return

    try {
      setPrevBalance(currentCustomer.balance)

      await recordTransaction({
        memberId: currentCustomer.id,
        storeId: currentStoreId,
        type: "consumption",
        amount,
      })

      const newBalance = currentCustomer.balance - amount
      const diff = -amount
      setBalanceDiff(diff)
      setCurrentCustomer({
        ...currentCustomer,
        balance: newBalance,
        lastVisit: new Date().toISOString(),
      })
      setAmount(0)
    } catch (error) {
      console.error("Purchase failed:", error)
      alert("消費失敗，請稍後再試")
    }
  }

  const handleAddMember = () => {}

  const handleSelectCustomer = (customer: Customer) => {
    setSearchPhone(customer.phone)
    setCurrentCustomer(customer)
    setPrevBalance(null)
    setBalanceDiff(0)
    setSearchResults([]) // 選擇後清空搜尋結果
  }

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStoreId = e.target.value
    setCurrentStoreId(newStoreId)
  }

    const handleReset = () => {
      setSearchPhone("")
      setSearchResults([])
    }

  // 點擊外部清除搜尋結果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  return (
    <div className="min-h-screen bg-[#F9F5F1] flex max-md:flex-col">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex max-lg:flex-col justify-between items-center gap-2.5">
            <div className="flex items-center gap-3">
              <Coffee className="h-8 w-8 text-amber-700" />
              <SparklesText
                className="text-slate-800 text-5xl text-nowrap"
                text={
                  storeLocations.find((store) => store.id === currentStoreId)
                    ?.name!
                }
              />
              <h1 className="text-2xl font-bold text-amber-900 max-md:hidden">
                {" "}
                會員管理
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="storeSelect" className="text-gray-700">
                切換分店：
              </label>
              <select
                id="storeSelect"
                value={currentStoreId}
                onChange={handleStoreChange}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {storeLocations.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </header>

          {/* Search Section */}
          <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              查詢會員餘額
            </h2>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="tel"
                  placeholder="請輸入電話號碼"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={searchPhone}
                  onChange={handleSearch}
                />
                <Search className="absolute top-1/2 right-5 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                {searchPhone && (
                  <button
                    onClick={handleReset}
                    className="absolute top-1/2 right-14 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    <FiRefreshCw className="h-5 w-5" />
                  </button>
                )}
                {/* Search Result */}
                {searchResults.length > 0 && (
                  <div
                    ref={searchResultsRef}
                    className="absolute z-10 w-full mt-1 bg-slate-50 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelectCustomer(result)}
                        className="w-full p-3 text-left hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        <p className="font-medium text-gray-800">
                          {result.name}
                        </p>
                        <p className="text-sm text-gray-600">{result.phone}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                  {new Date(currentCustomer.lastVisit).toLocaleDateString()}
                </p>
              </div>
            )}
          </section>

          {/* Input Area */}
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">
                  會員資訊登記
                </span>
              </div>
              <button
                onClick={handleAddMember}
                className="px-3 py-1 bg-amber-100 text-amber-700 
                       rounded-md text-sm hover:bg-amber-200 
                       transition-colors cursor-pointer p-1"
              >
                新增會員
              </button>
            </div>
            {/* You can add more input fields here for member registration */}
          </div>

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
                  onClick={() => setAmount(amount + 50)}
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
      <FrequentCustomers
        storeLocations={storeLocations}
        onSelectCustomer={handleSelectCustomer}
      />
    </div>
  )
}
