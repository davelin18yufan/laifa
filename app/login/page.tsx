"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { MdLocalCafe } from "react-icons/md"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = decodeURIComponent(
    searchParams.get("callbackUrl") || "/shopkeeper"
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
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
    } catch (error: unknown) {
      console.error(error)
      setError(error instanceof Error ? error.message : "發生未知錯誤")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-100 dark:bg-neutral-800">
      <div className="w-full max-w-md p-8 space-y-8 mt-16 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-1 justify-center text-orange-700 dark:text-amber-500">
          <MdLocalCafe />
          Laifa Cafe
        </h1>

        {error && (
          <div className="p-4 text-sm text-red-700 dark:text-red-500 bg-red-100 dark:bg-transparent rounded-lg">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
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
              disabled={isLoading}
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
                disabled={isLoading}
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
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-slate-600  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              登入
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
