import Hero from "components/Hero"
import Section from "components/Section"
import Footer from "components/Footer"
import Accordion from "components/Accordion"
import LenisContainer from "components/LenisContainer"
import GoodsGallery from "components/GoodsGallery"
import Customers from "components/Customers"

export default function HomePage() {
  return (
    <LenisContainer>
      <div className="flex flex-col min-h-screen bg-white dark:bg-black">
        <main>
          <Hero />
          <Customers />
          <GoodsGallery />
          <Section
            id="intro"
            leftHalf={<Accordion />}
            rightHalf={
              <div className="flex flex-col justify-end">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">
                  快節奏的生活，也該有慢品味的咖啡。
                </h2>
                <p className="text-xl font-light">
                  「時光在這裡慢下來，咖啡香氣剛剛好。」
                </p>
                <p className="text-xl font-light">「每一杯，都是一種享受。」</p>
              </div>
            }
            classes="bg-[url(/photos/simple-coffee.jpg)] bg-cover bg-no-repeat bg-left-bottom"
          />
        </main>
        <Footer />
      </div>
    </LenisContainer>
  )
}
