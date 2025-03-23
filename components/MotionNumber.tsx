"use client"
import React, { CSSProperties, useState } from "react"
import { motion } from "motion/react"
import NumberFlow, { useCanAnimate } from "@number-flow/react"
import { cn } from "@/lib/utils"
import { FaArrowUp } from "react-icons/fa"

const MotionNumberFlow = motion.create(NumberFlow)
const MotionArrowUp = motion.create(FaArrowUp)

export function MotionNumber({
  value,
  diff,
}: {
  value: number
  diff: number
}) {
  const canAnimate = useCanAnimate()

  return (
    <>
      <span className="flex items-center justify-center gap-2">
        <NumberFlow
          value={value}
          className="text-5xl font-semibold"
          format={{ style: "currency", currency: "TWD" }}
        />
        <motion.span
          className={cn(
            diff > 0 ? "bg-emerald-400" : "bg-red-500",
            "inline-flex items-center px-[0.3em] text-white transition-colors duration-300"
          )}
          style={{ borderRadius: 999 }}
          layout={canAnimate}
          transition={{ layout: { duration: 0.9, bounce: 0, type: "spring" } }}
        >
          {" "}
          <MotionArrowUp
            className="mr-0.5 size-[0.75em]"
            strokeWidth={3}
            transition={{
              rotate: { type: "spring", duration: 0.5, bounce: 0 },
            }}
            animate={{ rotate: diff > 0 ? 0 : -180 }}
            initial={false}
          />{" "}
          <MotionNumberFlow
            value={diff}
            className="font-semibold"
            format={{ style: "currency", currency: "TWD" }}
            layout={canAnimate}
            layoutRoot={canAnimate}
          />{" "}
        </motion.span>
      </span>
    </>
  )
}
