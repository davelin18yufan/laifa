"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"

interface AccordionItemProps {
  title: string
  content: string
  isOpen: boolean
  toggleOpen: () => void
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  isOpen,
  toggleOpen,
}) => {
  return (
    <div className="mb-4 ">
      <div
        className={cn(
          "w-full rounded-lg overflow-hidden ",
          isOpen
            ? "bg-slate-800 dark:bg-gray-900"
            : "bg-slate-900 dark:bg-gray-900"
        )}
      >
        <button
          className="w-full text-left p-4 flex justify-between items-center"
          onClick={toggleOpen}
        >
          <span className="text-xl font-semibold text-white dark:text-white">
            {title}
          </span>
          <span
            className={cn("transform transition-transform duration-300", {
              "rotate-180": isOpen,
            })}
          >
            <FaChevronDown className="text-2xl text-white" />
          </span>
        </button>
        <div
          className={cn(
            "overflow-hidden transition-[max-height] duration-300 ease-in-out",
            isOpen ? "max-h-[1000px]" : "max-h-0"
          )}
        >
          <div className="p-4">
            <p className="text-white font-light">{content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const defaultAccordionItems = [
  {
    title: "免費成為會員享更多優惠",
    content: "壽星享蛋糕品項九折優惠且不定時有好康，儲值機制好方便",
  },
  {
    title: "自家烘豆，自家特製蛋糕好評不斷",
    content: "咖啡豆採自篩自烘，蛋糕也是出自自家之手，品質保證",
  },
  {
    title: "咖啡豆及蛋糕品項隨季節趨勢更換",
    content: "咖啡豆及蛋糕品項會根據季節和趨勢進行更換，新鮮美味不老套。",
  },
]

interface AccordionProps {
  items?: { title: string; content: string }[]
}

const Accordion: React.FC<AccordionProps> = ({
  items = defaultAccordionItems,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="w-[90%]">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          toggleOpen={() => toggleItem(index)}
        />
      ))}
    </div>
  )
}

export default Accordion
