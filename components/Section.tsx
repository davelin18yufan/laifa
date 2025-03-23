interface SectionProps {
  leftHalf: React.ReactNode
  rightHalf: React.ReactNode
  classes?: string
  id: string
}

const Section: React.FC<SectionProps> = ({ leftHalf, rightHalf, classes,id }) => {
  return (
    <section
      className={`mx-auto py-24 ${classes}`}
      id={id}
    >
      <div className="flex flex-col md:flex-row items-center gap-8 px-4 md:px-6">
        <div className="w-full md:w-1/2 order-2 md:order-1 p-4 justify-center md:justify-start">
          {leftHalf}
        </div>
        <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center md:justify-end">
          {rightHalf}
        </div>
      </div>
    </section>
  )
}

export default Section
