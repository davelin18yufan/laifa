"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { AiOutlineSun, AiOutlineMoon } from "react-icons/ai"

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-2">
        <AiOutlineMoon size={20} className="text-gray-200" />
      </div>
    )
  }

  return (
    <button
      onClick={() =>
        setTheme(
          theme === "dark" || resolvedTheme === "dark" ? "light" : "dark"
        )
      }
      className="p-1 text-gray-800 dark:text-gray-100 bg-transparent"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" || resolvedTheme === "dark" ? (
        <AiOutlineSun size={20} />
      ) : (
        <AiOutlineMoon size={20} />
      )}
    </button>
  )
}

export default ThemeSwitch
