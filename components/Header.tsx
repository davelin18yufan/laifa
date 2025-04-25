"use client"
import { StoreLocation } from "@/types"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { BiHomeSmile } from "react-icons/bi"
import { CiLogout } from "react-icons/ci"
import { FaShoppingCart, FaUserLock, FaUserTie } from "react-icons/fa"
import { IoMdArrowDropdown } from "react-icons/io"
import ThemeSwitch from "./ThemeSwitch"
import { cn } from "@/lib/utils"

function Header({ stores }: { stores: Pick<StoreLocation, "name" | "id">[] }) {
  const path = usePathname()
  const storeId = path.split("/")[2]
  const isAuthorized = path === "/shopkeeper" || path === "/admin"
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const logOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOrderMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  return (
    <header className="bg-slate-200 dark:bg-slate-800 shadow-sm dark:border-b dark:border-gray-900">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl dark:text-gray-100">Laifa Coffee Wall</span>
        </div>
        <nav className="flex items-center">
          <ul className="flex space-x-2 mr-2">
            <li>
              <Link
                href="/"
                className="text-sm text-gray-800 dark:text-white px-4 py-2 rounded-md transition-colors"
              >
                <BiHomeSmile className="size-5" />
              </Link>
            </li>
            {/* <li>
              <Link
                href="/"
                className="text-sm text-gray-800 dark:text-white px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                會員
              </Link>
            </li> */}
          </ul>
          <ThemeSwitch />
          <div className="relative ml-2.5" ref={dropdownRef}>
            <button
              className="flex items-center text-gray-800 dark:text-white"
              onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
            >
              <FaShoppingCart className="size-4" />
              <IoMdArrowDropdown className="size-4" />
            </button>

            {isOrderMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-20">
                <div className="py-1">
                  <p className="block px-4 py-1 border-b text-sm text-gray-500 dark:text-gray-400">
                    請選擇門市
                  </p>
                  <div className="border-t border-gray-200 dark:border-gray-600"></div>
                  {stores.map((store) => (
                    <Link
                      key={store.id}
                      href={`/order/${store.id}`}
                      className={cn(
                        "block px-4 py-2",
                        "text-sm text-gray-700dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600",
                        storeId === store.id && "bg-gray-100 text-amber-600 dark:bg-gray-600"
                      )}
                      onClick={() => setIsOrderMenuOpen(false)}
                    >
                      {store.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/shopkeeper" className="ml-2.5">
            <FaUserTie className="size-4" />
          </Link>
          <Link href="/admin" className="ml-3">
            <FaUserLock className="size-4" />
          </Link>
          {isAuthorized && (
            <button
              type="submit"
              className="text-sm text-gray-800 dark:text-white p-2 rounded-md transition-colors"
              onClick={logOut}
            >
              <CiLogout />
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
