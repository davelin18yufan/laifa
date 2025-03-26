"use client"

import { StoreLocation, Customer } from "@/types"
import { useState } from "react"
import { FaUsers as Users, FaStore as Store } from "react-icons/fa"
import { motion } from "motion/react"
import { BiWallet } from "react-icons/bi"
import { FiMessageCircle } from "react-icons/fi"

interface FrequentCustomersProps {
  storeLocations: StoreLocation[]
  onSelectCustomer: (customer: Customer) => void
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

export default function FrequentCustomers({
  storeLocations,
  onSelectCustomer,
}: FrequentCustomersProps) {
  const [activeStoreId, setActiveStoreId] = useState(
    storeLocations[0]?.id || ""
  )

  // Get the current active store's customers
  const getActiveStoreCustomers = () => {
    const activeStore = storeLocations
      .find(({ id }) => activeStoreId === id)
    return activeStore ? activeStore.customers : []
  }

  return (
    <div className="w-80 max-md:w-full bg-white shadow-lg flex flex-col">
      {/* Tab Headers */}
      <div
        className="relative flex border-b overflow-x-hidden "
        onMouseDown={handleDragTab}
      >
        {storeLocations.map((store) => (
          <button
            key={store.id}
            onClick={() => setActiveStoreId(store.id)}
            className="relative flex-1 py-4 px-2 text-center font-medium text-sm min-w-20 text-gray-600 hover:text-amber-600 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center">
              <Store className="h-4 w-4 mb-1" />
              {store.name}
            </div>
            {activeStoreId === store.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600"
                transition={{ type: "spring", stiffness: 250, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-amber-700" />
          <h2 className="text-lg font-semibold text-gray-800">常見會員</h2>
        </div>

        <div className="space-y-4">
          {getActiveStoreCustomers().length > 0 ? (
            getActiveStoreCustomers().map((customer) => (
              <button
                key={customer.id}
                onClick={() => onSelectCustomer(customer)}
                className="w-full p-4 text-left bg-white border border-gray-100 rounded-lg 
                         hover:bg-amber-50 hover:border-amber-100 
                         transition-all duration-300 
                         shadow-sm hover:shadow-md 
                         flex items-center gap-4 
                         cursor-pointer group"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-gray-800 group-hover:text-amber-700">
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>

                  <div className="flex items-center justify-between flex-wrap">
                    <div className="flex items-center gap-2">
                      <BiWallet className="h-4 w-4 text-amber-600" />
                      <p className="text-sm font-medium text-amber-700">
                        餘額: ${customer.balance.toFixed(2)}
                      </p>
                    </div>

                    {customer.latestNote && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 py-1">
                        <FiMessageCircle className="h-4 w-4 font-bold" />
                        <span className="mr-1">{customer.latestNote.category}</span>
                        <span>{customer.latestNote.content}</span>
                      </div>
                    )}
                  </div>

                  {customer.transactionCount && (
                    <div className="mt-2 text-xs text-gray-500">
                      總交易次數: {customer.transactionCount}
                      {customer.totalSpent &&
                        ` | 總消費: $${customer.totalSpent.toFixed(2)}`}
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>此分店目前沒有常見會員</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
