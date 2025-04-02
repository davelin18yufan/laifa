"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { BiCoffee } from "react-icons/bi"
import { GiCoffeePot } from "react-icons/gi"
import { GrCafeteria } from "react-icons/gr"
import { MdLocalCafe } from "react-icons/md"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/shopkeeper"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // 不自動重定向，手動處理
      callbackUrl,
    })

    if (result?.error) {
      setError("帳號或密碼錯誤")
    } else {
      router.push(callbackUrl) // 成功後導回 callbackUrl
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 mt-16 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-1 justify-center text-orange-700">
          <MdLocalCafe />
          Laifa Cafe
        </h1>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="text-sm font-normal">
              帳號
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="請輸入帳號.."
              required
              className="bg-background w-full outline-none focus-within:border-amber-700 rounded-md p-2  border-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="pass" className="text-sm font-normal">
              密碼
            </label>
            <div className="relative mt-1">
              <input
                type={isVisible ? "text" : "password"}
                id="pass"
                placeholder="請輸入密碼.."
                className="bg-background w-full outline-none focus-within:border-amber-700 rounded-md p-2 border-1"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute top-3 right-4 text-2xl text-gray-500 cursor-pointer"
                onClick={() => setIsVisible((prev) => !prev)}
              >
                {isVisible ? <FaEye size={22} /> : <FaEyeSlash size={22} />}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              登入
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
