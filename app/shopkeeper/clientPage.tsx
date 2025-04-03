"use client"

import { MotionNumber } from "components/texts/MotionNumber"
import { Customer, StoreLocation } from "@/types"
import FrequentCustomers from "components/FrequentCustomers"
import { useEffect, useRef, useState, useActionState } from "react"
import {
  FaSearch as Search,
  FaCoffee as Coffee,
  FaPlus as Plus,
  FaMinus as Minus,
  FaUserPlus as UserPlus,
  FaUserAlt,
  FaEdit,
} from "react-icons/fa"
import {
  getMembers,
  upsertMemberNote,
  addMember,
  updateMember,
} from "@/actions/member.action"
import { recordTransaction } from "@/actions/transaction.action"
import { SparklesText } from "components/texts/SparklesText"
import { debounce } from "@/lib/utils"
import { FiRefreshCw } from "react-icons/fi"
import { PiPen } from "react-icons/pi"
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "components/Dialog"
import {
  BiCaretRightCircle,
  BiMessageAltDetail,
  BiWallet,
} from "react-icons/bi"
import GenderSelect from "components/buttons/GenderSelect"
import MemberFormDialog from "components/MemberFormDialog"

export default function ClientPage({
  storeLocations,
}: {
  storeLocations: StoreLocation[]
}) {
  const [searchInput, setSearchInput] = useState("")
  const [amount, setAmount] = useState(0)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const [prevBalance, setPrevBalance] = useState<number | null>(null)
  const [balanceDiff, setBalanceDiff] = useState(0)
  const [currentStoreId, setCurrentStoreId] = useState<string>(
    storeLocations[0]?.id || ""
  )
  const [searchResults, setSearchResults] = useState<Customer[]>([])
  const searchResultsRef = useRef<HTMLDivElement>(null)

  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      const memberId = formData.get("memberId") as string
      const category = formData.get("category") as string
      const content = formData.get("content") as string

      try {
        const updatedNote = await upsertMemberNote({
          memberId,
          category,
          content,
        })
        // 更新當前客戶端的 customer 狀態
        setCurrentCustomer((prev) =>
          prev ? { ...prev, latestNote: updatedNote } : null
        )

        return { success: true, error: null }
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
          payload: {
            category,
            content,
          },
        }
      }
    },
    { success: false, error: null }
  )

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setSearchInput(input)

    if (input.length > 1) {
      try {
        const search = debounce(async () => {
          // 根據輸入判斷是電話還是姓名
          const isPhone = /^\d+$/.test(input) // 如果全是數字，視為電話
          const members = await getMembers(
            isPhone ? input : undefined,
            isPhone ? undefined : input
          )
          setSearchResults(
            members.map((m) => ({
              id: m.memberId,
              phone: m.phone,
              balance: m.balance,
              name: m.name,
              lastVisit: m.lastBalanceUpdate,
              latestNote: m.latestNote,
              storeId: m.storeId,
              gender: m.gender,
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
      const result = await recordTransaction({
        memberId: currentCustomer.id,
        storeId: currentStoreId,
        type: "deposit",
        amount,
      })
      setBalanceDiff(amount)
      setCurrentCustomer({
        ...currentCustomer,
        balance: result.newBalance,
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
      const result = await recordTransaction({
        memberId: currentCustomer.id,
        storeId: currentStoreId,
        type: "consumption",
        amount,
      })
      const diff = -amount
      setBalanceDiff(diff)
      setCurrentCustomer({
        ...currentCustomer,
        balance: result.newBalance,
        lastVisit: new Date().toISOString(),
      })
      setAmount(0)
    } catch (error) {
      console.error("Purchase failed:", error)
      alert("消費失敗，請稍後再試")
    }
  }

  const handleSelectCustomer = (customer: Customer) => {
    setSearchInput(customer.phone)
    setCurrentCustomer(customer)
    setPrevBalance(null)
    setBalanceDiff(0)
    setSearchResults([])
  }

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStoreId = e.target.value
    setCurrentStoreId(newStoreId)
  }

  const handleReset = () => {
    setSearchInput("")
    setSearchResults([])
  }

  const handleMemberFormSuccess = (updatedMember: Customer) => {
    setCurrentCustomer(updatedMember)
    setSearchInput(updatedMember.phone)
  }

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
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex max-lg:flex-col justify-between items-center gap-2.5">
            <div className="flex items-center gap-3">
              <Coffee className="h-8 w-8 text-amber-700" />
              <SparklesText
                className="text-slate-800 text-5xl text-nowrap"
                text={
                  storeLocations.find((store) => store.id === currentStoreId)
                    ?.name || "未選擇分店"
                }
              />
              <h1 className="text-2xl font-bold text-amber-900 max-md:hidden">
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

              {/* Add member */}
              <MemberFormDialog
                storeLocations={storeLocations}
                onSuccess={handleMemberFormSuccess}
                isUpdate={false}
              />
            </div>
          </header>

          {/* Search Section */}
          <section className="bg-white rounded-xl p-6 shadow-sm mb-6 relative">
            <h2 className="absolute left-0 -top-4 text-xl font-semibold mb-4 text-gray-800">
              查詢會員餘額
            </h2>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="tel"
                  placeholder="請輸入電話號碼 or 姓名"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={searchInput}
                  onChange={handleSearch}
                />
                <Search className="absolute top-1/2 right-5 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                {searchInput && (
                  <button
                    onClick={handleReset}
                    className="absolute top-1/2 right-14 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    <FiRefreshCw className="h-5 w-5" />
                  </button>
                )}
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
              <div className="mt-4 p-5 bg-neutral-50 rounded-xl shadow-lg text-gray-800 overflow-hidden">
                {/* Header Section  */}
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2">
                    <FaUserAlt />
                  </div>
                  <h3 className="font-bold text-xl text-center text-neutral-800">
                    {currentCustomer.name}
                  </h3>
                  <MemberFormDialog
                    storeLocations={storeLocations}
                    customer={currentCustomer}
                    onSuccess={handleMemberFormSuccess}
                    isUpdate={true}
                  />
                </div>

                {/* Balance Section  */}
                <div className="mb-3 py-3 rounded-lg">
                  <BiWallet />
                  <div className="w-full">
                    <MotionNumber
                      value={currentCustomer.balance}
                      diff={balanceDiff}
                    />
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mb-2 flex justify-between items-center">
                  <BiMessageAltDetail />
                  <Dialog transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <DialogTrigger className="text-amber-600 hover:text-amber-500 flex items-center gap-1 text-sm transition-colors">
                      {currentCustomer.latestNote ? (
                        <>
                          <PiPen className="h-4 w-4" /> 編輯備註
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" /> 新增備註
                        </>
                      )}
                    </DialogTrigger>
                    <DialogContainer>
                      <DialogContent className="bg-gray-50 rounded-xl p-6 relative shadow-lg ">
                        <DialogClose className="text-gray-800 hover:text-orange-500" />
                        <DialogTitle className="text-xl font-bold text-gray-800 mb-4">
                          {currentCustomer.latestNote ? "編輯備註" : "新增備註"}
                        </DialogTitle>
                        <DialogDescription className="space-y-4">
                          <form action={formAction}>
                            <input
                              type="hidden"
                              name="memberId"
                              value={currentCustomer.id}
                            />
                            <input
                              autoComplete="on"
                              type="text"
                              name="category"
                              placeholder="備註類型"
                              defaultValue={
                                state.payload?.category ||
                                currentCustomer.latestNote?.category ||
                                ""
                              }
                              className="w-full p-2 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            <textarea
                              name="content"
                              placeholder="輸入備註內容"
                              defaultValue={
                                state.payload?.content ||
                                currentCustomer.latestNote?.content ||
                                ""
                              }
                              className="w-full p-2 border mt-2 text-gray-700  rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            <button
                              type="submit"
                              disabled={
                                state.success === false && !!state.error
                              }
                              className="w-full py-2 mt-4 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex justify-center items-center gap-1"
                            >
                              保存
                              <BiCaretRightCircle />
                            </button>
                          </form>
                          {state.error && (
                            <p className="text-red-600 text-sm mt-2">
                              {state.error}
                            </p>
                          )}
                        </DialogDescription>
                      </DialogContent>
                    </DialogContainer>
                  </Dialog>
                </div>

                {currentCustomer.latestNote ? (
                  <div className="p-3 rounded-lg bg-yellow-50 border-b-4 border-yellow-100 shadow-md transform hover:rotate-1  transition-transform">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-yellow-200 text-slate-700 text-xs font-medium rounded-lg">
                          {currentCustomer.latestNote.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 p-2 bg-yellow-50 rounded-md">
                        {currentCustomer.latestNote.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-right italic font-handwriting">
                      更新於:{" "}
                      {new Date(
                        currentCustomer.latestNote.updatedAt
                      ).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">尚無備註</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Pricing Calculator */}
          <section className="bg-white rounded-xl p-6 shadow-sm relative">
            <h2 className="absolute -top-4 left-0 text-xl font-semibold mb-4 text-gray-800">
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
        initialActiveStoreId={currentStoreId}
      />
    </div>
  )
}
