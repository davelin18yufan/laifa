import React, { CSSProperties } from "react"
import { scaleBand, scaleLinear, max } from "d3"
import { AnimatedBar } from "./AnimatedContainer"

interface BarChartProps {
  data: { key: string; value: number; color: string }[]
}

export function HorizontalBarChart({ data }: BarChartProps) {
  const yScale = scaleBand()
    .domain(data.map((d) => d.key))
    .range([0, 100])
    .padding(0.175)

  const xScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([0, 100])

  const longestWord = max(data.map((d) => d.key.length)) || 1
  return (
    <div
      className="relative w-full min-h-66"
      style={
        {
          "--marginTop": "20px",
          "--marginRight": "8px",
          "--marginBottom": "25px",
          "--marginLeft": `${longestWord * 7}px`,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 z-10 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-hidden">
        {data.map((d, index) => {
          const barWidth = xScale(d.value)
          const barHeight = yScale.bandwidth()
          return (
            <AnimatedBar key={index} index={index}>
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  top: `${yScale(d.key)}%`,
                  width: `${barWidth}%`,
                  height: `${barHeight}%`,
                  backgroundColor: d.color,
                  borderRadius: "0 6px 6px 0",
                }}
              />
            </AnimatedBar>
          )
        })}
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {xScale
            .ticks(8)
            .map(xScale.tickFormat(8, "d"))
            .map((active, i) => (
              <g
                transform={`translate(${xScale(+active)},0)`}
                className="text-gray-300/80 dark:text-gray-800/80"
                key={i}
              >
                <line
                  y1={0}
                  y2={100}
                  stroke="currentColor"
                  strokeDasharray="6,5"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
        </svg>
      </div>
      <svg className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] translate-y-[var(--marginTop)] overflow-visible">
        <g className="translate-x-[calc(var(--marginLeft)-8px)]">
          {data.map((entry, i) => (
            <text
              key={i}
              x="0"
              y={`${yScale(entry.key)! + yScale.bandwidth() / 2}%`}
              dy=".35em"
              textAnchor="end"
              fill="currentColor"
              className="text-xs text-zinc-400 "
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              {entry.key}
            </text>
          ))}
        </g>
      </svg>
      <svg className="absolute inset-0 w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] h-[calc(100%-var(--marginBottom))] translate-y-4 overflow-visible">
        <g className="overflow-visible">
          {xScale.ticks(4).map((value, i) => (
            <text
              key={i}
              x={`${xScale(value)}%`}
              y="100%"
              textAnchor="middle"
              fill="currentColor"
              className="text-xs tabular-nums text-gray-400"
            >
              {value}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}
