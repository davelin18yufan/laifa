import { BiCoffeeTogo } from "react-icons/bi"
import { DiCoffeescript } from "react-icons/di"
import { GiCoffeePot, GiCoffeeBeans } from "react-icons/gi"
import { MdCoffeeMaker } from "react-icons/md"
import { FiCoffee } from "react-icons/fi"
import { PiCoffeeBeanFill } from "react-icons/pi"

const icons = [
  { Icon: PiCoffeeBeanFill },
  { Icon: BiCoffeeTogo },
  { Icon: DiCoffeescript },
  { Icon: GiCoffeePot },
  { Icon: MdCoffeeMaker },
  { Icon: GiCoffeeBeans },
  { Icon: FiCoffee },
]

const Customers: React.FC = () => {
  return (
    <div className="w-full py-12 dark:bg-slate-900 bg-slate-100">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-0 dark:text-gray-50 text-black text-center md:text-left md:w-2/5">
              Over 5,000 people has joined Laifa community.
            </h2>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 md:w-2/3">
              {icons.map(({ Icon }, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center"
                >
                  <Icon className="text-3xl md:text-4xl dark:text-gray-50 text-gray-900" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customers
