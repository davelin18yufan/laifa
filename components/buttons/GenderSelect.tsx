"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"
import { FaMale, FaFemale } from "react-icons/fa"

interface GenderIconProps {
  value: "male" | "female"
}

function GenderIcon({ value }: GenderIconProps) {
  const getGenderConfig = () => {
    if (value === "male") {
      return {
        color: "#3B82F6",
        icon: <FaMale size={48} />,
      }
    }
    return {
      color: "#EC4899",
      icon: <FaFemale size={48} />,
    }
  }

  const gender = getGenderConfig()

  return (
    <div
      className="flex items-center justify-center"
      style={{ color: gender.color }}
    >
      {gender.icon}
    </div>
  )
}

interface GenderSelectProps {
  initialValue?: "male" | "female"
}

export default function GenderSelect({
  initialValue = "male",
}: GenderSelectProps = {}) {
  const [value, setValue] = useState<"male" | "female">(initialValue)

  const adjustValue = (direction: "left" | "right") => {
    setValue((prev) => (prev === "male" ? "female" : "male"))
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="relative flex items-center justify-center gap-8 py-4">
        <button
          type="button"
          onClick={() => adjustValue("left")}
          disabled={value === "female"}
          className={cn(
            "p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800",
            "text-zinc-500 hover:text-zinc-700",
            "dark:text-zinc-400 dark:hover:text-zinc-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>

        <GenderIcon value={value} />

        <button
          type="button"
          onClick={() => adjustValue("right")}
          disabled={value === "male"}
          className={cn(
            "p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800",
            "text-zinc-500 hover:text-zinc-700",
            "dark:text-zinc-400 dark:hover:text-zinc-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
        >
          <FaChevronRight className="w-6 h-6" />
        </button>
      </div>
      <input type="hidden" name="gender" value={value} />
    </div>
  )
}
