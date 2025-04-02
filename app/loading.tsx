import "@/site/style.css"
import { clsx } from "clsx/lite"

const loadingTexts = "Laifa Coffee Wall."

export default function Loading() {
  const spans = loadingTexts
    .split("")
    .reverse()
    .map((char, index) => (
      <span
        key={index}
        className={clsx(
          "inline-block text-center",
          "w-5 h-5 absolute",
          "transition-all duration-300 ease-in-out animate-frameMove"
        )}
        style={{
          animationDelay: `${0.2 * index}s`,
        }}
      >
        {char}
      </span>
    ))

  return (
    <main className="loadingWrapper">
      <div className="frame">
        <div className="text relative">{spans}</div>
      </div>
    </main>
  )
}
