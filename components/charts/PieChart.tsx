import { pie, arc } from "d3"
import { AnimatedSlice } from "./AnimatedContainer"


interface PieChartProps {
  data: { name: string; value: number }[]
  singleColor?: "purple" | "blue" | "fuchsia" | "yellow" | "green"
}

export function PieChart({ data, singleColor = "purple" }: PieChartProps) {
  const radius = 420
  const gap = 0.01
  const lightStrokeEffect = 10

  const pieLayout = pie<any>()
    .value((d) => d.value)
    .padAngle(gap)

  const innerRadius = radius / 1.625
  const arcGenerator = arc<any>()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .cornerRadius(lightStrokeEffect + 2)

  const arcClip = arc<any>()
    .innerRadius(innerRadius + lightStrokeEffect / 2)
    .outerRadius(radius)
    .cornerRadius(lightStrokeEffect + 2)

  const labelRadius = radius * 0.825
  const arcLabel = arc<any>().innerRadius(labelRadius).outerRadius(labelRadius)

  const arcs = pieLayout(data)
  const computeAngle = (d: any) => ((d.endAngle - d.startAngle) * 180) / Math.PI
  const minAngle = 20

  const colors = {
    purple: ["#7e4cfe", "#895cfc", "#956bff", "#a37fff", "#b291fd", "#b597ff"],
    blue: [
      "#73caee",
      "#73caeeee",
      "#73caeedd",
      "#73caeecc",
      "#73caeebb",
      "#73caeeaa",
    ],
    fuchsia: [
      "#f6a3ef",
      "#f6a3efee",
      "#f6a3efdd",
      "#f6a3efcc",
      "#f6a3efbb",
      "#f6a3efaa",
    ],
    yellow: [
      "#f6e71f",
      "#f6e71fee",
      "#f6e71fdd",
      "#f6e71fcc",
      "#f6e71fbb",
      "#f6e71faa",
    ],
    green: [
      "#4caf50",
      "#4caf50ee",
      "#4caf50dd",
      "#4caf50cc",
      "#4caf50bb",
      "#4caf50aa",
    ],
  }

  return (
    <div className="relative mt-4">
      <svg
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
        className="max-w-[16rem] mx-auto overflow-visible"
      >
        {arcs.map((d, i) => {
          const angle = computeAngle(d)
          let centroid = arcLabel.centroid(d)
          if (d.endAngle > Math.PI) {
            centroid[0] += 10
            centroid[1] += 10
          } else {
            centroid[0] -= 10
            centroid[1] -= 0
          }
          return (
            <AnimatedSlice key={i} index={i}>
              <path
                stroke="#ffffff33"
                strokeWidth={lightStrokeEffect}
                fill={
                  singleColor
                    ? colors[singleColor][i % colors[singleColor].length]
                    : colors.purple[i % colors.purple.length]
                }
                d={arcGenerator(d) || undefined}
              />
              <g opacity={angle > minAngle ? 1 : 0}>
                <text
                  transform={`translate(${centroid})`}
                  textAnchor="middle"
                  fontSize={38}
                >
                  <tspan
                    y="-0.4em"
                    fontWeight="600"
                    fill={singleColor === "purple" ? "#eee" : "#444"}
                  >
                    {d.data.name}
                  </tspan>
                  {angle > minAngle && (
                    <tspan
                      x={0}
                      y="0.7em"
                      fillOpacity={0.7}
                      fill={singleColor === "purple" ? "#eee" : "#444"}
                    >
                      {d.data.value.toLocaleString("en-US")}
                    </tspan>
                  )}
                </text>
              </g>
            </AnimatedSlice>
          )
        })}
      </svg>
    </div>
  )
}
