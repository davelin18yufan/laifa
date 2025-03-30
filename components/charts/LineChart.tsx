import { CSSProperties } from "react"
import { scaleLinear, max, line as d3_line } from "d3"
import { AnimatedLine } from "./AnimatedContainer"

interface LineChartProps {
  data: { key: number; value: number }[]
}

export function LineChart({ data }: LineChartProps) {
  // X 軸使用 key（數字，例如小時），Y 軸使用 value（數值，例如交易次數）
  const xScale = scaleLinear()
    .domain([0, max(data.map((d) => d.key)) ?? 0])
    .range([0, 100])

  const yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([100, 0])

  const line = d3_line<any>()
    .x((d) => xScale(d.key))
    .y((d) => yScale(d.value))

  const pathData = line(data)

  if (!pathData) {
    return null
  }

  return (
    <div
      className="relative w-full h-full"
      style={
        {
          "--marginTop": "20px",
          "--marginRight": "20px",
          "--marginBottom": "30px",
          "--marginLeft": "30px",
        } as CSSProperties
      }
    >
      {/* X 軸 */}
      <svg className="absolute inset-0 w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] h-[calc(100%-var(--marginBottom))] translate-y-4 overflow-visible">
        <g className="overflow-visible">
          {xScale.ticks(5).map((value, i) => (
            <text
              key={i}
              x={`${xScale(value)}%`}
              y="100%"
              textAnchor="middle"
              fill="currentColor"
              className="text-xs text-gray-600"
            >
              {value}
            </text>
          ))}
        </g>
      </svg>

      {/* Y 軸 */}
      <svg className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] translate-y-[var(--marginTop)] overflow-visible">
        <g className="translate-x-[calc(var(--marginLeft)-8px)]">
          {yScale.ticks(5).map((value, i) => (
            <text
              key={i}
              x="0"
              y={`${yScale(value)}%`}
              dy=".35em"
              textAnchor="end"
              fill="currentColor"
              className="text-xs text-gray-600"
            >
              {value}
            </text>
          ))}
        </g>
      </svg>

      {/* 圖表區域 */}
      <svg className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
        <defs>
          <linearGradient id="line1-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5A5DB" /> {/* 更新為柔和配色 */}
            <stop offset="100%" stopColor="#33C2EA" />
          </linearGradient>
        </defs>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* 網格線 */}
          {yScale.ticks(5).map((active, i) => (
            <g
              transform={`translate(0,${yScale(active)})`}
              className="text-gray-300/80 dark:text-gray-800/80"
              key={i}
            >
              <line
                x1={0}
                x2={100}
                stroke="currentColor"
                strokeDasharray="6,5"
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
          {/* 折線 */}
          <AnimatedLine>
            <path
              d={pathData}
              fill="none"
              stroke="url(#line1-gradient)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </AnimatedLine>
          {/* 數據點 */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.key)}
              cy={yScale(d.value)}
              r="3"
              fill="#758BCF"
            />
          ))}
        </svg>
      </svg>
    </div>
  )
}
