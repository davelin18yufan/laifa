import { Suspense } from "react"

// useSearchParams has to be wrapped in a Suspense boundary.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense>{children}</Suspense>
}
