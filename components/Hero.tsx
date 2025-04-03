"use client"

import { motion } from "motion/react"
import { ImagesSlider } from "./ImageSlider"
import IconButton from "./buttons/IconButton"
import { useEffect } from "react"
import { LineShadowText } from "./texts/ShadowText"
import { useTheme } from "next-themes"

export default function Hero() {
  const images = [
    "/photos/hero.jpg",
    "/photos/shulin-branch.jpg",
    "/photos/sanxia-branch.webp",
  ]
  const theme = useTheme()
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "white"

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth"
    }
  }, [])
  return (
    <section className="text-center place-content-center h-screen w-full relative">
      <ImagesSlider className="" images={images}>
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-50 flex flex-col justify-center items-center"
        >
          <h1 className="font-sans text-3xl tracking-loose sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-slate-400 to-gray-400 bg-clip-text text-transparent mb-6 text-nowrap">
            <LineShadowText className="italic" shadowColor={shadowColor}>
              來發!
            </LineShadowText>
            <span className="ml-2">咖啡</span>
          </h1>
          <p className="text-xl bg-gradient-to-r from-slate-300 to-gray-300 bg-clip-text text-transparent mb-12 ml-24 font-light">
            — 品味生活，從一杯好咖啡開始...
          </p>
          <div className="flex justify-center space-x-6">
            <IconButton
              label="會員專區"
              labelAfter="會員專區"
              href="/members"
            />
            <IconButton
              label="熱門商品"
              labelAfter="熱門商品"
              href="#goodsGallery"
            />
            <IconButton
              label="分店查詢"
              labelAfter="分店查詢"
              href="https://www.google.com/maps/search/%E4%BE%86%E7%99%BC/@24.9742322,121.4085388,13z?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoASAFQAw%3D%3D"
            />
          </div>
        </motion.div>
      </ImagesSlider>
    </section>
  )
}
