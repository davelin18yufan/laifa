"use client"

import { useState } from "react"
import { PieChart } from "components/charts/PieChart"
import { HorizontalBarChart } from "components/charts/BarChart"
import { LineChart } from "components/charts/LineChart"
import {
  ClientTooltip,
  TooltipTrigger,
  TooltipContent,
} from "components/charts/Tooltip"
import {
  BusinessOverview,
  PopularItem,
  CategorySales,
  RevenueTrend,
  StorePerformance,
  TopCustomer,
} from "@/types"
import { AreaChart } from "components/charts/AreaChart"
import { ScatterChart } from "components/charts/ScatterChart"

interface ClientPageProps {
  businessOverview: BusinessOverview
  popularItems: PopularItem[]
  categorySales: CategorySales[]
  revenueTrend: RevenueTrend[]
  storePerformance: StorePerformance[]
  topCustomers: TopCustomer[]
}

export default function ClientPage({
  businessOverview,
  popularItems,
  categorySales,
  revenueTrend,
  storePerformance,
  topCustomers,
}: ClientPageProps) {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day")

  // 統一配色方案（品牌色）
  const colors = [
    "#F5A5DB", // 粉紅
    "#758BCF", // 淡藍
    "#33C2EA", // 青藍
    "#FFC182", // 橘黃
    "#87DB72", // 淡綠
    "#B89DFB", // 淡紫
  ]

  // 業務概覽：計算增長率（假設有上月數據）
  const growthRates = {
    totalMembers: (
      ((businessOverview.totalMembers - businessOverview.totalMembers * 0.95) /
        (businessOverview.totalMembers * 0.95)) *
      100
    ).toFixed(1),
    totalConsumption: (
      ((businessOverview.totalConsumption -
        businessOverview.totalConsumption * 0.9) /
        (businessOverview.totalConsumption * 0.9)) *
      100
    ).toFixed(1),
    totalDeposit: (
      ((businessOverview.totalDeposit - businessOverview.totalDeposit * 0.92) /
        (businessOverview.totalDeposit * 0.92)) *
      100
    ).toFixed(1),
    avgMemberBalance: (
      ((businessOverview.avgMemberBalance -
        businessOverview.avgMemberBalance * 0.98) /
        (businessOverview.avgMemberBalance * 0.98)) *
      100
    ).toFixed(1),
  }

  // 熱門品項
  const popularItemsChartData = popularItems.map((item, index) => ({
    key: item.name,
    value: item.total_revenue,
    color: colors[index % colors.length],
  }))

  // 品類銷售
  const categorySalesChartData = categorySales.map((item, index) => ({
    name: item.category,
    value: item.total_revenue,
    color: colors[index % colors.length],
  }))

  // 收入趨勢
  const revenueTrendChartData = revenueTrend
    .map((item) => {
      const date = new Date(item.date)
      if (isNaN(date.getTime())) return null // 過濾無效日期
      return {
        date,
        value: item.total_revenue,
        transaction_count: item.transaction_count,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime()) // 確保日期順序

  // 分店表現（淨收入）
  const storeNetRevenueChartData = storePerformance.map((item, index) => ({
    key: item.storeName,
    value: item.totalConsumption - item.totalDeposit,
    color: colors[index % colors.length],
    consumption: item.totalConsumption,
    deposit: item.totalDeposit,
  }))

  // 高價值客戶
  const topCustomersChartData = topCustomers.map((item, index) => ({
    days: item.order_count,
    value: item.total_spent,
    name: item.name,
    preferred_categories: item.preferred_categories,
    preferred_store: item.preferred_store,
  }))

  return (
    <div className="p-6 bg-gray-100 dark:bg-zinc-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Business Insight
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("day")}
            className={`px-3 py-1 rounded-lg ${
              timeRange === "day"
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            日
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1 rounded-lg ${
              timeRange === "week"
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            週
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 rounded-lg ${
              timeRange === "month"
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            月
          </button>
        </div>
      </div>

      {/* Bento 網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 業務概覽 */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4 *:text-center *:bg-amber-50 *:dark:bg-zinc-800 *:p-4 *:rounded-lg *:shadow-md">
          <div className="">
            <h2 className="text-sm text-gray-500 dark:text-gray-400">
              總會員數
            </h2>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              {businessOverview.totalMembers.toLocaleString()}
            </p>
            <p
              className={`text-sm ${
                +growthRates.totalMembers > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {growthRates.totalMembers}% vs 上月
            </p>
          </div>
          <div className="">
            <h2 className="text-sm text-gray-500 dark:text-gray-400">
              總消費金額
            </h2>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              ${businessOverview.totalConsumption.toLocaleString()}
            </p>
            <p
              className={`text-sm ${
                +growthRates.totalConsumption > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {growthRates.totalConsumption}% vs 上月
            </p>
          </div>
          <div className="">
            <h2 className="text-sm text-gray-500 dark:text-gray-400">
              總存款金額
            </h2>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              ${businessOverview.totalDeposit.toLocaleString()}
            </p>
            <p
              className={`text-sm ${
                +growthRates.totalDeposit > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {growthRates.totalDeposit}% vs 上月
            </p>
          </div>
          <div className="">
            <h2 className="text-sm text-gray-500 dark:text-gray-400">
              平均會員餘額
            </h2>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              ${businessOverview.avgMemberBalance.toLocaleString()}
            </p>
            <p
              className={`text-sm ${
                +growthRates.avgMemberBalance > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {growthRates.avgMemberBalance}% vs 上月
            </p>
          </div>
        </div>

        {/* 收入趨勢 */}
        <div className="bg-amber-50 dark:bg-zinc-800 p-4 rounded-lg shadow-md col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            收入趨勢
          </h2>
          <ClientTooltip>
            <TooltipTrigger>
              <AreaChart data={revenueTrendChartData} />
            </TooltipTrigger>
            <TooltipContent>
              {revenueTrendChartData.map((item, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  <span className="font-bold text-gray-500/80 dark:text-gray-200/80 mr-1">
                    {item.date.toLocaleDateString()}:
                  </span>
                  <span className="text-amber-500 dark:text-amber-400">
                    ${item.value.toLocaleString()} ({item.transaction_count}{" "}
                    筆交易)
                  </span>
                </div>
              ))}
            </TooltipContent>
          </ClientTooltip>
        </div>

        {/* 熱門品項 */}
        <div className="bg-amber-50 dark:bg-zinc-800 p-4 rounded-lg shadow-md ">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            熱門品項
          </h2>
          <ClientTooltip>
            <TooltipTrigger>
              <HorizontalBarChart data={popularItemsChartData} />
            </TooltipTrigger>
            <TooltipContent>
              {popularItems.map((item, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  <span className="font-bold text-gray-500/80 dark:text-gray-200/80 mr-1">
                    {item.name}:
                  </span>
                  <span className="text-amber-500 dark:text-amber-400">
                    ${item.total_revenue.toLocaleString()} (
                    {item.total_quantity} 份)
                  </span>
                </div>
              ))}
            </TooltipContent>
          </ClientTooltip>
        </div>

        {/* 品類銷售 */}
        <div className="bg-amber-50 dark:bg-zinc-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            品類銷售佔比
          </h2>
          <ClientTooltip>
            <TooltipTrigger>
              <PieChart data={categorySalesChartData} singleColor="blue" />
            </TooltipTrigger>
            <TooltipContent>
              {categorySales.map((item, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  <span className="font-bold text-gray-500/80 dark:text-gray-200/80 mr-1">
                    {item.category}:
                  </span>
                  <span className="text-amber-500 dark:text-amber-400">
                    ${item.total_revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </TooltipContent>
          </ClientTooltip>
        </div>

        {/* 分店表現 */}
        <div className="bg-amber-50 dark:bg-zinc-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            分店淨收入
          </h2>
          <ClientTooltip>
            <TooltipTrigger>
              <HorizontalBarChart data={storeNetRevenueChartData} />
            </TooltipTrigger>
            <TooltipContent>
              {storePerformance.map((item, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  <span className="font-bold text-gray-500/80 dark:text-gray-200/80 mr-1">
                    {item.storeName}:
                  </span>{" "}
                  <span className="text-amber-500 dark:text-amber-400">
                    淨收入 $
                    {storeNetRevenueChartData[index].value.toLocaleString()}{" "}
                    (消費 ${item.totalConsumption.toLocaleString()}, 存款 $
                    {item.totalDeposit.toLocaleString()})
                  </span>
                </div>
              ))}
            </TooltipContent>
          </ClientTooltip>
        </div>

        {/* 高價值客戶 */}
        <div className="bg-amber-50 dark:bg-zinc-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            高價值客戶
          </h2>
          <ClientTooltip>
            <TooltipTrigger>
              <ScatterChart data={topCustomersChartData} />
            </TooltipTrigger>
            <TooltipContent>
              {topCustomers.map((item, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  <span className="font-bold text-gray-500/80 dark:text-gray-200/80 mr-1">
                    {item.name}:
                  </span>
                  <span className="text-amber-500 dark:text-amber-400">
                    ${item.total_spent.toLocaleString()} ({item.order_count} 次,
                    偏好: {item.preferred_categories})
                  </span>
                </div>
              ))}
            </TooltipContent>
          </ClientTooltip>
        </div>
      </div>
    </div>
  )
}
