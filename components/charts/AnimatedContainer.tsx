"use client"

import { motion } from "motion/react"

export function AnimatedSlice({
  index = 0,
  children,
}: {
  index?: number
  children: React.ReactNode
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.25 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.25, delay: index * 0.075 },
        scale: {
          type: "spring",
          duration: 0.25,
          bounce: 0.1,
          delay: index * 0.075,
        },
      }}
    >
      {children}
    </motion.g>
  )
}

export function AnimatedBar({
  index = 0,
  children,
}: {
  index?: number
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ transform: "translateX(-100%)" }}
      animate={{ transform: "translateX(0)" }}
      className="absolute inset-0"
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.075, // Staggered delay effect
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedLine({ children }: { children: React.ReactNode }) {
  const strokeDashValue = 1000 // For really long lines, you might need to increase this value

  return (
    <motion.g
      initial={{ strokeDashoffset: strokeDashValue }}
      animate={{ strokeDashoffset: 0 }}
      transition={{
        strokeDashoffset: { type: "spring", duration: 1.5, bounce: 0 },
      }}
      style={{ strokeDasharray: strokeDashValue }}
    >
      {children}
    </motion.g>
  )
}


export function AnimatedArea({ children }: { children: React.ReactNode }) {
  return (
    <motion.g
      initial={{ clipPath: "inset(0% 100% 0% 0%)" }} // Animates from right
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }} // To original position
      transition={{
        duration: 1, // Adjust duration as needed
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.g>
  )
}

export function AnimatedCircle({
  index = 0,
  children,
}: {
  index?: number
  children: React.ReactNode
}) {
  return (
    <motion.g
      initial={{ strokeWidth: 0 }}
      animate={{ strokeWidth: 15 }}
      transition={{
        type: "spring",
        duration: 1,
        bounce: 0.65,
        delay: index * 0.03,
      }}
    >
      {children}
    </motion.g>
  )
}