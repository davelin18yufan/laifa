"use client"

import { StoreLocation, Customer } from "@/types"
import { useState } from "react"
import { FaUsers as Users, FaStore as Store } from "react-icons/fa"
import { motion } from "motion/react"

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
    const activeStore = storeLocations.find(
      (store) => store.id === activeStoreId
    )
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
          {getActiveStoreCustomers().map((customer) => (
            <button
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
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
  )
}
