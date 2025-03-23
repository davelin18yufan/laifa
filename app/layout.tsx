import Header from "components/Header"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"

import "styles/globals.css"

export const metadata: Metadata = {
  title: "來發咖啡俠",
  description: "來發咖啡",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
