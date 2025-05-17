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
          "--marginLeft": `${longestWord * 11}px`,
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

interface VerticalBarChartProps {
  data: { key: string; value: number; color: string }[]
}

export function VerticalBarChart({ data }: VerticalBarChartProps) {
  // X 軸：使用 scaleBand 分配每個柱子的位置
  const xScale = scaleBand()
    .domain(data.map((d) => d.key))
    .range([0, 100])
    .padding(0.175)

  // Y 軸：根據最大值縮放柱子高度
  const yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.value)) ?? 0])
    .range([100, 0])
    .nice() // 優化 Y 軸刻度範圍

  // 計算左邊距以容納 Y 軸標籤
  const maxValue = max(data.map((d) => d.value)) || 1
  const longestYLabel = maxValue.toFixed(0).length * 8

  return (
    <div
      className="relative w-full min-h-66"
      style={
        {
          "--marginTop": "20px",
          "--marginRight": "8px",
          "--marginBottom": "60px", // 增加底部空間以容納 X 軸標籤
          "--marginLeft": `${longestYLabel + 8}px`, // 根據 Y 軸標籤長度調整
        } as CSSProperties
      }
    >
      {/* 圖表主區域 */}
      <div className="absolute inset-0 z-10 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-hidden">
        {data.map((d, index) => {
          const barHeight = 100 - yScale(d.value) // 從底部向上計算高度
          const barWidth = xScale.bandwidth()
          return (
            <AnimatedBar key={index} index={index}>
              <div
                style={{
                  position: "absolute",
                  left: `${xScale(d.key)}%`,
                  bottom: "0", // 柱子從底部開始
                  width: `${barWidth}%`,
                  height: `${barHeight}%`,
                  backgroundColor: d.color,
                  borderRadius: "6px 6px 0 0", // 上方圓角
                }}
              />
            </AnimatedBar>
          )
        })}
        {/* Y 軸格線 */}
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
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
        </svg>
      </div>

      {/* Y 軸標籤 */}
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
              className="text-xs text-gray-400"
            >
              {value.toLocaleString()}
            </text>
          ))}
        </g>
      </svg>

      {/* X 軸標籤 */}
      <svg className="absolute inset-0 w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] h-[calc(100%-var(--marginBottom))] translate-y-4 overflow-visible">
        <g className="overflow-visible">
          {data.map((entry, i) => (
            <text
              key={i}
              x={`${xScale(entry.key)! + xScale.bandwidth() / 2}%`}
              y="100%"
              textAnchor="middle"
              fill="currentColor"
              className="text-xs text-gray-400"
              style={{ transform: "rotate(-45deg) translate(-10px, 10px)" }} // 旋轉標籤以節省空間
            >
              {entry.key}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}