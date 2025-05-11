import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { GroupedProduct } from "@/types/Order"

interface ProductGridProps {
  categories: string[]
  activeCategory: string | null
  groupedProducts: GroupedProduct[]
  addToCart: (variant: { id: string; name: string; price: number }) => void
}

export default function ProductGrid({
  categories,
  activeCategory,
  groupedProducts,
  addToCart,
}: ProductGridProps) {
  return (
    <>
      {categories
        .filter((category) => !activeCategory || activeCategory === category)
        .map((category) => (
          <div key={category} className="mb-8 font-mono">
            <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-200 mb-4 bg-gradient-to-r from-amber-200 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/20 px-4 py-2 rounded-lg shadow-sm border-l-4 border-amber-700">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {groupedProducts
                .filter((group) => group.category === category)
                .map((group) => (
                  <motion.div
                    key={group.baseName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "group p-4 rounded-xl",
                      "bg-white dark:bg-zinc-800",
                      "border border-amber-200 dark:border-amber-900/30",
                      "hover:border-amber-300 dark:hover:border-amber-700",
                      "transition-all duration-200 group",
                      "shadow-sm hover:shadow-md"
                    )}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-amber-50 dark:bg-gray-900/30 group-hover:scale-110 transition-transform duration-300">
                        {group.variants[0]?.image_url ? (
                          <Image
                            src={group.variants[0].image_url}
                            alt={group.baseName}
                            layout="fill"
                            objectFit="cover"
                          />
                        ) : null}
                        <div
                          className={cn(
                            "flex items-center justify-center h-full text-amber-700 dark:text-amber-400",
                            group.variants[0]?.image_url && "hidden"
                          )}
                        >
                          {group.baseName}
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 group-hover:underline group-hover:underline-offset-2 group-hover:decoration-amber-600 group-hover:decoration-2 group-hover:decoration-solid truncate">
                        {group.baseName}
                      </h3>
                      <div className="flex flex-col gap-2 overflow-x-auto">
                        {group.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => addToCart(variant)}
                            className="flex items-center justify-between gap-1.5 text-sm text-amber-50 bg-amber-600 dark:bg-amber-600/50 rounded-lg py-2 px-3 hover:bg-amber-700 shadow-sm hover:shadow transition-all duration-150"
                          >
                            <span>
                              {variant.name
                                .replace(group.baseName, "")
                                .trim() || "標準"}
                            </span>
                            <span>NT${variant.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
    </>
  )
}
