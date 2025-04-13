"use client"
import Link from "next/link"
import ThemeSwitch from "./ThemeSwitch"
import { FaUserLock, FaUserTie } from "react-icons/fa"
import { CiLogout } from "react-icons/ci"
import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { BiHomeSmile } from "react-icons/bi"

function Header() {
  const path = usePathname()
  const isAuthorized = path === "/shopkeeper" || path === "/admin"

  const logOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }
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
