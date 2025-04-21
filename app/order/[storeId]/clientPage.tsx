"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaCreditCard,
  FaUser,
  FaSearch,
} from "react-icons/fa"
import { cn } from "@/lib/utils"
import NumberFlow from "@number-flow/react"
import { getMembers } from "@/actions/member.action"
import { createOrder } from "@/actions/menu.action"

interface Product {
  id: string
  name: string
  price: number
  category: string
}

interface CartItem extends Product {
  quantity: number
}

interface Member {
  member_id: string
  name: string
  phone: string
  balance: number
}

interface OrderClientPageProps {
  storeId: string
  initialProducts: Product[]
}

export default function OrderClientPage({
  storeId,
  initialProducts,
}: OrderClientPageProps) {
  const [products] = useState<Product[]>(initialProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchMember, setSearchMember] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "member_balance">(
    "cash"
  )

  const handleSearchMember = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setSearchMember(input)
    if (input.length > 2) {
      const results = await getMembers(input, undefined)
      setMembers(
        results.map((m) => ({
          member_id: m.memberId,
          name: m.name,
          phone: m.phone,
          balance: m.balance,
        }))
      )
    } else {
      setMembers([])
    }
  }

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id)
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...currentCart, { ...product, quantity: 1 }]
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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleCheckout = async () => {
    if (cart.length === 0) return

    try {
      const order = await createOrder({
        store_id: storeId,
        member_id:
          paymentMethod === "member_balance"
            ? selectedMember?.member_id
            : undefined,
        total_amount: totalPrice,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      })

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

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="w-full mx-auto min-h-screen py-2 px-4 md:px-6 bg-slate-50 dark:bg-black">
      <div className="flex gap-6">
        <div className="flex-1">
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products
                  .filter((product) => product.category === category)
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "group p-4 rounded-xl",
                        "bg-white dark:bg-zinc-900",
                        "border border-zinc-200 dark:border-zinc-800",
                        "hover:border-zinc-300 dark:hover:border-zinc-700",
                        "transition-all duration-200"
                      )}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                          <div className="flex items-center justify-center h-full text-zinc-500">
                            {product.name}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {product.name}
                          </h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            NT${product.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="mt-2 flex items-center justify-center gap-1.5 text-sm text-white bg-amber-600 rounded-lg py-2 hover:bg-amber-700"
                        >
                          <FaPlus className="w-3.5 h-3.5" />
                          添加
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "w-80 flex flex-col",
            "p-4 rounded-xl",
            "bg-white dark:bg-zinc-900",
            "border border-zinc-200 dark:border-zinc-800",
            "sticky top-4",
            "max-h-[40rem]"
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <FaShoppingCart className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              購物車 ({totalItems})
            </h2>
          </div>
          <motion.div
            className={cn(
              "flex-1 overflow-y-auto",
              "min-h-0",
              "-mx-4 px-4",
              "space-y-3"
            )}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    layout: { duration: 0.2 },
                  }}
                  className={cn(
                    "flex items-center gap-3",
                    "p-2 rounded-lg",
                    "bg-zinc-50 dark:bg-zinc-800/50",
                    "mb-3"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        >
                          <FaMinus className="w-3 h-3" />
                        </motion.button>
                        <motion.span
                          layout
                          className="text-xs text-zinc-600 dark:text-zinc-400 min-w-[16px] inline-block text-center"
                        >
                          {item.quantity}
                        </motion.span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        >
                          <FaPlus className="w-3 h-3" />
                        </motion.button>
                      </div>
                      <motion.span
                        layout
                        className="text-xs text-zinc-500 dark:text-zinc-400"
                      >
                        NT${(item.price * item.quantity).toFixed(2)}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <div className="mt-3 border-t border-zinc-200 dark:border-zinc-800 pt-3">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              會員選擇
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="輸入電話或姓名"
                value={searchMember}
                onChange={handleSearchMember}
                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-zinc-400" />
              {members.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {members.map((member) => (
                    <button
                      key={member.member_id}
                      onClick={() => {
                        setSelectedMember(member)
                        setSearchMember(member.name)
                        setPaymentMethod("member_balance")
                        setMembers([])
                      }}
                      className="w-full p-2 text-left hover:bg-amber-50"
                    >
                      {member.name} ({member.phone}) - 餘額: NT$
                      {member.balance.toFixed(2)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedMember && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                已選擇: {selectedMember.name} (餘額: NT$
                {selectedMember.balance.toFixed(2)})
              </p>
            )}
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              付款方式
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={cn(
                  "flex-1 py-2 rounded-lg",
                  paymentMethod === "cash"
                    ? "bg-amber-600 text-white"
                    : "bg-zinc-200"
                )}
              >
                現金
              </button>
              <button
                onClick={() => setPaymentMethod("member_balance")}
                className={cn(
                  "flex-1 py-2 rounded-lg",
                  paymentMethod === "member_balance"
                    ? "bg-amber-600 text-white"
                    : "bg-zinc-200",
                  !selectedMember && "opacity-50 cursor-not-allowed"
                )}
                disabled={!selectedMember}
              >
                會員餘額
              </button>
            </div>
          </div>
          <motion.div
            layout
            className={cn(
              "pt-3 mt-3",
              "border-t border-zinc-200 dark:border-zinc-800",
              "bg-white dark:bg-zinc-900"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                總計
              </span>
              <motion.span
                layout
                className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 inline-block min-w-[80px] text-right"
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
                  : "bg-amber-600 hover:bg-amber-700"
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
