import { CSSProperties } from "react"
import { scaleLinear, max, line as d3_line } from "d3"
import { AnimatedLine } from "./AnimatedContainer"
import { ClientTooltip, TooltipTrigger, TooltipContent } from "./Tooltip"

interface LineChartProps {
  data: { key: string; value: number; transaction_count: number }[]
}

export function LineChart({ data }: LineChartProps) {
  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([0, 100])

  const yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([100, 0])

  const line = d3_line<any>()
    .x((_, i) => xScale(i))
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
          "--marginBottom": "40px",
          "--marginLeft": "40px",
        } as CSSProperties
      }
    >
      {/* X 軸 */}
      <svg className="absolute inset-0 w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] h-[calc(100%-var(--marginBottom))] translate-y-4 overflow-visible">
        <g className="overflow-visible">
          {data.map((d, i) => (
            <text
              key={i}
              x={`${xScale(i)}%`}
              y="100%"
              textAnchor="middle"
              fill="currentColor"
              className="text-xs text-gray-600 dark:text-gray-400"
              style={{ transform: "rotate(-45deg)", transformOrigin: "center" }}
            >
              {d.key}
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
              className="text-xs text-gray-600 dark:text-gray-400"
            >
              ${value.toLocaleString()}
            </text>
          ))}
        </g>
      </svg>

      {/* 圖表區域 */}
      <ClientTooltip>
        <TooltipTrigger>
          <svg className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
            <defs>
              <linearGradient
                id="line1-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#F5A5DB" />
                <stop offset="100%" stopColor="#33C2EA" />
              </linearGradient>
            </defs>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
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
              <AnimatedLine>
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#line1-gradient)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </AnimatedLine>
              {data.map((d, i) => (
                <circle
                  key={i}
                  cx={xScale(i)}
                  cy={yScale(d.value)}
                  r="3"
                  fill="#758BCF"
                />
              ))}
            </svg>
          </svg>
        </TooltipTrigger>
        <TooltipContent>
          {data.map((d, i) => (
            <div key={i} className="text-sm text-gray-700 dark:text-gray-200">
              {d.key}: ${d.value.toLocaleString()} ({d.transaction_count}{" "}
              筆交易)
            </div>
          ))}
        </TooltipContent>
      </ClientTooltip>
    </div>
  )
}
