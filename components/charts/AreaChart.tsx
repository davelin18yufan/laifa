import { formatDate } from "@/lib/utils"
import {
  scaleTime,
  scaleLinear,
  line as d3line,
  max,
  bisector,
  area as d3area,
  curveMonotoneX,
} from "d3"
import { CSSProperties } from "react"
import { AnimatedArea } from "./AnimatedContainer"

// 定義資料型別，允許額外屬性
interface AreaChartData {
  date: Date
  value: number
  [key: string]: any // 允許 transaction_count 等額外屬性
}

export function AreaChart({ data }: { data: AreaChartData[] }) {
  // 檢查空資料
  if (!data || data.length === 0) {
    return (
      <div className="relative h-72 w-full text-gray-500 dark:text-gray-400">
        無收入趨勢資料
      </div>
    )
  }

  // 確保日期有效
  const validData = data.filter((d) => !isNaN(d.date.getTime()))
  if (validData.length === 0) {
    return (
      <div className="relative h-72 w-full text-gray-500 dark:text-gray-400">
        無有效日期資料
      </div>
    )
  }

  let xScale = scaleTime()
    .domain([validData[0].date, validData[validData.length - 1].date])
    .range([0, 100])

  let yScale = scaleLinear()
    .domain([0, max(validData, (d) => d.value) ?? 0])
    .range([100, 0])

  let line = d3line<AreaChartData>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .curve(curveMonotoneX)

  let area = d3area<AreaChartData>()
    .x((d) => xScale(d.date))
    .y0(yScale(0))
    .y1((d) => yScale(d.value))
    .curve(curveMonotoneX)

  let areaPath = area(validData)
  let d = line(validData)

  if (!d || !areaPath) {
    return (
      <div className="relative h-72 w-full text-gray-500 dark:text-gray-400">
        無法渲染圖表
      </div>
    )
  }

  return (
    <div
      className="relative h-72 w-full"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "0px",
          "--marginBottom": "60px", // 增加底部空間以容納 X 軸標籤
          "--marginLeft": "25px",
        } as CSSProperties
      }
    >
      {/* Chart area */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-full
          translate-y-[var(--marginTop)]
          overflow-visible"
      >
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="semiAreaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                className="text-yellow-500/20 dark:text-yellow-500/20"
                stopColor="currentColor"
              />
              <stop
                offset="90%"
                className="text-yellow-50/5 dark:text-yellow-900/5"
                stopColor="currentColor"
              />
            </linearGradient>
          </defs>

          <AnimatedArea>
            <path d={areaPath} fill="url(#semiAreaGradient)" />
            <path
              d={d}
              fill="none"
              className="text-yellow-400 dark:text-yellow-600"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </AnimatedArea>
        </svg>

        {/* Y axis */}
        <svg
          className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          overflow-visible"
        >
          <g className="translate-x-[98%]">
            {yScale
              .ticks(8)
              .map(yScale.tickFormat(8, "d"))
              .map((value, i) => {
                if (i < 1) return null
                return (
                  <text
                    key={i}
                    y={`${yScale(+value)}%`}
                    alignmentBaseline="middle"
                    textAnchor="end"
                    className="text-xs tabular-nums text-zinc-400 dark:text-zinc-100"
                    fill="currentColor"
                  >
                    {value}
                  </text>
                )
              })}
          </g>
        </svg>
        {/* X axis */}
        <svg
          className="absolute inset-0
          h-[calc(100%-var(--marginTop))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible"
        >
          {validData.map((day, i) => {
            if (i % 6 !== 0 || i === 0 || i >= validData.length - 3) return null
            return (
              <g
                key={i}
                className="overflow-visible text-zinc-500 dark:text-zinc-200 -translate-y-3"
              >
                <text
                  x={`${xScale(day.date)}%`}
                  y="100%"
                  textAnchor={
                    i === 0
                      ? "start"
                      : i === validData.length - 1
                      ? "end"
                      : "middle"
                  }
                  fill="currentColor"
                  className="xs:inline hidden text-sm"
                  style={{ transform: "rotate(-45deg) translate(-10px, 10px)" }}
                >
                  {formatDate(day.date)}
                </text>
                <text
                  x={`${xScale(day.date)}%`}
                  y="100%"
                  textAnchor={
                    i === 0
                      ? "start"
                      : i === validData.length - 1
                      ? "end"
                      : "middle"
                  }
                  fill="currentColor"
                  className="xs:hidden text-xs"
                  style={{ transform: "rotate(-45deg) translate(-10px, 10px)" }}
                >
                  {formatDate(day.date)}
                </text>
              </g>
            )
          })}
        </svg>
      </svg>
    </div>
  )
}
