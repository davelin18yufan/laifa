import { FaCoffee } from "react-icons/fa"
import React from "react"
import Link from "next/link"

function IconButton({
  label,
  labelAfter,
  href,
  icon = <FaCoffee />,
}: {
  label: string
  labelAfter: string
  href?: string
  icon?: React.ReactNode
}) {
  return (
    <>
      <div className="group relative cursor-pointer p-2 min-w-32 border bg-slate-50/90 rounded-full overflow-hidden text-black text-center font-semibold">
        <span className="translate-x-1 group-hover:translate-x-12 group-hover:opacity-0 transition-all duration-300 inline-block">
          {label}
        </span>
        <div className="flex gap-2 text-white z-10 items-center absolute top-0 h-full w-full justify-center translate-x-12 opacity-0 group-hover:-translate-x-1 group-hover:opacity-100 transition-all duration-300">
          {href ? (
            <Link href={href} className="flex items-center justify-between gap-1">
              <span>{labelAfter}</span>
              {icon}
            </Link>
          ) : (
            <>
              <span>{labelAfter}</span>
              {icon}
            </>
          )}
        </div>
        <div className="absolute top-[40%] left-[15%] h-2 w-2 group-hover:h-full group-hover:w-full rounded-lg bg-black scale-[1] dark:group-hover:bg-[#e7cb6e] group-hover:bg-[#263381] group-hover:scale-[1.8] transition-all duration-300 group-hover:top-[0%] group-hover:left-[0%] "></div>
      </div>
    </>
  )
}

export default IconButton
