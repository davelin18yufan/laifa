import { CSSProperties } from "react"
import { scaleLinear, max, line as d3_line, min } from "d3"
import { AnimatedCircle } from "./AnimatedContainer"

export function ScatterChart({data}: { data: { days: number; value: number }[] }) {
  let xScale = scaleLinear()
    .domain([data[0].days, data[data.length - 1].days])
    .range([0, 100])
  let yScale = scaleLinear()
    .domain([
      (min(data.map((d) => d.value)) ?? 0) - 1,
      (max(data.map((d) => d.value)) ?? 0) + 1,
    ])
    .range([100, 0])

  let line = d3_line<(typeof data)[number]>()
    .x((d) => xScale(d.days))
    .y((d) => yScale(d.value))

  let d = line(data)

  if (!d) {
    return null
  }

  return (
    <div
      className="@container relative h-72 w-full"
      style={
        {
          "--marginTop": "25px",
          "--marginRight": "8px",
          "--marginBottom": "25px",
          "--marginLeft": "25px",
        } as CSSProperties
      }
    >
      {/* X axis */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        {data.map((day, i) => {
          if (i !== 0 && i !== data.length - 1 && i % 4 !== 0) return null
          return (
            <g key={i} className="overflow-visible text-zinc-500">
              <text
                x={`${xScale(day.days)}%`}
                y="100%"
                textAnchor={
                  i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"
                }
                fill="currentColor"
                className="@sm:inline hidden text-sm"
              >
                {day.days}
              </text>
              <text
                x={`${xScale(day.days)}%`}
                y="100%"
                textAnchor={
                  i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"
                }
                fill="currentColor"
                className="@sm:hidden text-xs"
              >
                {day.days}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Y axis */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        <g className="translate-x-4">
          {yScale
            .ticks(3)
            .map(yScale.tickFormat(3, "d"))
            .map((value, i) => (
              <text
                key={i}
                y={`${yScale(+value)}%`}
                alignmentBaseline="middle"
                textAnchor="end"
                className="text-xs tabular-nums text-zinc-500"
                fill="currentColor"
              >
                {value}
              </text>
            ))}
        </g>
      </svg>

      {/* Chart area */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Horizontal grid lines */}
          {yScale
            .ticks(8)
            .map(yScale.tickFormat(8, "d"))
            .map((active, i) => (
              <g
                transform={`translate(0,${yScale(+active)})`}
                className="text-zinc-500/20 dark:text-zinc-700/50"
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

          {/* Vertical grid lines */}
          {xScale.ticks(8).map((active, i) => (
            <g
              transform={`translate(${xScale(active)},0)`}
              className="text-zinc-500/20 dark:text-zinc-700/50"
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

          {/* Points */}
          {data.map((d, i) => (
            <AnimatedCircle key={d.days.toString()} index={i}>
              <path
                key={d.days.toString()}
                d={`M ${xScale(d.days)} ${yScale(d.value)} l 0.0001 0`}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                fill="none"
                stroke="currentColor"
                className="text-violet-400"
              />
            </AnimatedCircle>
          ))}
        </svg>
      </svg>
    </div>
  )
}
