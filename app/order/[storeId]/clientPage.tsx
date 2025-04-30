"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import {
  FaShoppingCart,
  FaCreditCard,
  FaUser,
} from "react-icons/fa"
import { cn } from "@/lib/utils"
import NumberFlow from "@number-flow/react"
import { getMembers } from "@/actions/member.action"
import { createOrder } from "@/actions/transaction.action"
import { Product, CartItem, GroupedProduct } from "@/types/Order"
import { Customer, StoreLocation } from "@/types"

import ProductGrid from "./ProductGrid"
import ShoppingCart from "./ShoppingCart"
import MemberSearch from "./MemberSearch"
import { ColourfulText } from "components/texts/ColourfulText"

interface OrderClientPageProps {
  store: Pick<StoreLocation, "id" | "name">
  initialProducts: Product[]
}

export default function OrderClientPage({ store, initialProducts }: OrderClientPageProps) {
  const [products] = useState<Product[]>(initialProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchMember, setSearchMember] = useState("")
  const [members, setMembers] = useState<Customer[]>([])
  const [selectedMember, setSelectedMember] = useState<Customer | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "member_balance">(
    "cash"
  )
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)

  // Group products by base name
  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: GroupedProduct } = {}
    products.forEach((product) => {
      const match = product.name.match(/^(.+?)(?:\s(\d+CC|\（.+?\）))?$/)
      const baseName = match ? match[1].trim() : product.name
      const variantName = product.name

      if (!groups[baseName]) {
        groups[baseName] = {
          baseName,
          category: product.category,
          variants: [],
        }
      }
      groups[baseName].variants.push({
        id: product.id,
        name: variantName,
        price: product.price,
        image_url: product.imageUrl,
      })
    })
    return Object.values(groups).sort((a, b) =>
      a.baseName.localeCompare(b.baseName)
    )
  }, [products])

  // Get unique categories
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  )

  // Member search handler
  const handleSearchMember = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setSearchMember(input)
    if (input.length > 2) {
      const results = await getMembers(input, undefined)
      setMembers(
        results.map((m) => ({
          id: m.memberId,
          name: m.name,
          phone: m.phone,
          balance: m.balance,
          gender: m.gender,
          lastVisit: m.lastBalanceUpdate,
          latestNote: m.latestNote,
          storeId: m.storeId,
        }))
      )
    } else {
      setMembers([])
    }
  }

  // Cart management
  const addToCart = (variant: { id: string; name: string; price: number }) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === variant.id)
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...currentCart,
        {
          id: variant.id,
          name: variant.name,
          price: variant.price,
          quantity: 1,
          category: "",
        },
      ]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + delta
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter((item): item is CartItem => item !== null)
    )
  }

  // Cart calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Checkout handler
  const handleCheckout = async () => {
    if (cart.length === 0) return

    try {
      const order = await createOrder({
        storeId: store.id,
        memberId:
          paymentMethod === "member_balance" ? selectedMember?.id : undefined,
        totalAmount: totalPrice,
        paymentMethod: paymentMethod,
        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      })

      console.log("訂單已建立:", order)

      alert("結帳成功！")
      setCart([])
      setSelectedMember(null)
      setPaymentMethod("cash")
      setSearchMember("")
      setMembers([])
    } catch (error) {
      console.error("結帳失敗:", error)
      alert("結帳失敗，請稍後再試")
    }
  }

  // Click outside handler for member search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setMembers([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Member selection handler
  const handleMemberSelect = (member: Customer) => {
    setSelectedMember(member)
    setSearchMember(member.name)
    setPaymentMethod("member_balance")
    setMembers([])
  }
  return (
    <div className="w-full mx-auto min-h-screen py-2 px-4 md:px-6 bg-gray-100 dark:bg-zinc-900">
      {/* Category Navigation */}
      <nav className="flex justify-between items-center sticky top-0 z-10 bg-orange-50 dark:bg-zinc-900 py-2 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200",
                activeCategory === category
                  ? "bg-amber-800 text-white border-b-2 border-amber-900 hover:bg-amber-700"
                  : "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 border border-amber-200 dark:border-amber-800/50",
                // Wooden style elements
                "bg-gradient-to-b",
                activeCategory === category
                  ? "from-amber-700 to-amber-800"
                  : "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/50"
              )}
            >
              {category}
            </button>
          ))}
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200",
              activeCategory === null
                ? "bg-amber-800 text-white border-b-2 border-amber-900 hover:bg-amber-700"
                : "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 border border-amber-200 dark:border-amber-800/50",
              // Wooden style elements
              "bg-gradient-to-b",
              activeCategory === null
                ? "from-amber-700 to-amber-800"
                : "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/50"
            )}
          >
            全部
          </button>
        </div>
        <h3 className="max-md:hidden md:text-xl lg:text-3xl font-bold text-center text-slate-700 dark:text-gray-200 relative z-2 font-sans">
          來發 <ColourfulText text={store.name.substring(2, 5)} />
        </h3>
      </nav>

      <div className="flex gap-6 max-md:flex-col md:gap-4">
        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid
            categories={categories}
            activeCategory={activeCategory}
            groupedProducts={groupedProducts}
            addToCart={addToCart}
          />
        </div>

        {/* Shopping Cart & Checkout */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "md:w-80 flex flex-col",
            "p-4 rounded-xl",
            "bg-white dark:bg-zinc-800",
            "border border-amber-200 dark:border-amber-900/30",
            "sticky top-4",
            "max-h-[48rem]",
            "shadow-md"
          )}
        >
          {/* Cart Header */}
          <div className="flex items-center gap-2 mb-3">
            <FaShoppingCart className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-bold text-amber-800 dark:text-amber-200">
              購物車 ({totalItems})
            </h2>
          </div>

          {/* Cart Items */}
          <ShoppingCart cart={cart} updateQuantity={updateQuantity} />

          {/* Member Selection */}
          <div className="border-t border-amber-200 dark:border-amber-900/30 pt-3">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
              <FaUser className="w-3 h-3" />
              會員選擇
            </h3>
            <MemberSearch
              searchMember={searchMember}
              handleSearchMember={handleSearchMember}
              members={members}
              handleMemberSelect={handleMemberSelect}
              searchResultsRef={searchResultsRef}
              selectedMember={selectedMember}
              setSearchMember={setSearchMember}
              setMembers={setMembers}
              setSelectedMember={setSelectedMember}
            />
          </div>

          {/* Payment Method */}
          <div className="mt-3">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
              付款方式
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={cn(
                  "flex-1 py-2 rounded-lg border transition-all duration-200",
                  paymentMethod === "cash"
                    ? "bg-amber-600 text-white border-amber-700 shadow-md"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100 border-amber-200 dark:border-amber-900/30"
                )}
              >
                現金
              </button>
              <button
                onClick={() => setPaymentMethod("member_balance")}
                className={cn(
                  "flex-1 py-2 rounded-lg border transition-all duration-200",
                  paymentMethod === "member_balance"
                    ? "bg-amber-600 text-white border-amber-700 shadow-md"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100 border-amber-200 dark:border-amber-900/30",
                  !selectedMember && "opacity-50 cursor-not-allowed"
                )}
                disabled={!selectedMember}
              >
                會員消費
              </button>
            </div>
          </div>

          {/* Total & Checkout */}
          <motion.div
            layout
            className={cn(
              "pt-3 mt-3",
              "border-t border-amber-200 dark:border-amber-900/30",
              "bg-white dark:bg-zinc-800"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                總計
              </span>
              <motion.span
                layout
                className="text-sm font-semibold text-amber-800 dark:text-amber-200 inline-block min-w-[80px] text-right"
              >
                <NumberFlow
                  value={totalPrice}
                  format={{
                    style: "currency",
                    currency: "TWD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                  className="font-mono tabular-nums"
                />
              </motion.span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={
                cart.length === 0 ||
                (paymentMethod === "member_balance" &&
                  (!selectedMember || selectedMember.balance < totalPrice))
              }
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 text-white rounded-lg",
                cart.length === 0 ||
                  (paymentMethod === "member_balance" &&
                    (!selectedMember || selectedMember.balance < totalPrice))
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700 shadow-md"
              )}
            >
              <FaCreditCard className="w-4 h-4" />
              結帳
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
