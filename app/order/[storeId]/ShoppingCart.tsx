import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { FaMinus, FaPlus } from "react-icons/fa"
import { CartItem } from "@/types/Order"

interface ShoppingCartProps {
  cart: CartItem[]
  updateQuantity: (productId: string, delta: number) => void
}

export default function ShoppingCart({
  cart,
  updateQuantity,
}: ShoppingCartProps) {
  return (
    <motion.div
      className={cn(
        "flex-1 overflow-y-auto",
        "min-h-0",
        "-mx-4 px-4",
        "space-y-3",
        "font-mono"
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
              "bg-amber-50 dark:bg-amber-900/10",
              "mb-3",
              "border border-amber-100 dark:border-amber-900/20"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200 truncate">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 rounded-md text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/30"
                  >
                    <FaMinus className="w-3 h-3" />
                  </motion.button>
                  <motion.span
                    layout
                    className="text-xs text-amber-700 dark:text-amber-400 min-w-[16px] inline-block text-center"
                  >
                    {item.quantity}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 rounded-md text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/30"
                  >
                    <FaPlus className="w-3 h-3" />
                  </motion.button>
                </div>
                <motion.span
                  layout
                  className="text-xs text-amber-700 dark:text-amber-400"
                >
                  NT${(item.price * item.quantity).toFixed(2)}
                </motion.span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
