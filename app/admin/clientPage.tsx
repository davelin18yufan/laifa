"use client"

import { PieChart } from "components/charts/PieChart"
import { HorizontalBarChart } from "components/charts/BarChart"
import { LineChart } from "components/charts/LineChart" 
import {
  BusinessOverview,
  PeakTransactionHour,
  NoteCategoryStat,
  StorePerformance,
  TopSpendingMember,
} from "@/types"

interface ClientPageProps {
  businessOverview: BusinessOverview
  peakHoursData: PeakTransactionHour[]
  noteStatsData: NoteCategoryStat[]
  storePerformanceData: StorePerformance[]
  topSpendersData: TopSpendingMember[]
}

export default function ClientPage({
  businessOverview,
  peakHoursData,
  noteStatsData,
  storePerformanceData,
  topSpendersData,
}: ClientPageProps) {
  // 更新配色方案
  const colors = [
    "#F5A5DB", // 粉紅
    "#B89DFB", // 淡紫
    "#758BCF", // 淡藍
    "#33C2EA", // 青藍
    "#FFC182", // 橘黃
    "#87DB72", // 淡綠
  ]

  // 準備 Peak Transaction Hours 的資料
  const peakHoursChartData = peakHoursData.map((item, index) => ({
    key: `${item.hourOfDay}點`,
    value: item.transactionCount,
    color: colors[index % colors.length],
  }))

  // 準備 Note Category Stats 的資料
  const noteStatsChartData = noteStatsData.map((item) => ({
    name: item.category,
    value: item.noteCount,
  }))

  // 準備 Store Performance 的資料（消費）
  const storeConsumptionChartData = storePerformanceData.map((item, index) => ({
    key: item.storeName,
    value: item.totalConsumption,
    color: colors[index % colors.length],
  }))

  // 準備 Store Performance 的資料（存款）
  const storeDepositChartData = storePerformanceData.map((item, index) => ({
    key: item.storeName,
    value: item.totalDeposit,
    color: colors[index % colors.length],
  }))

  // 準備 Top Spending Members 的資料
  const topSpendersChartData = topSpendersData.map((item, index) => ({
    key: item.name,
    value: item.totalSpent,
    color: colors[index % colors.length],
  }))

  const lineChartData = peakHoursData.map((item) => ({
    key: item.hourOfDay,
    value: item.transactionCount,
  }))

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Bento 格局網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 業務概覽卡片 */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500">總會員數</h2>
            <p className="text-2xl font-semibold text-gray-700">
              {businessOverview.totalMembers}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500">總消費金額</h2>
            <p className="text-2xl font-semibold text-gray-700">
              ${businessOverview.totalConsumption.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500">總存款金額</h2>
            <p className="text-2xl font-semibold text-gray-700">
              ${businessOverview.totalDeposit.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm text-gray-500">平均會員餘額</h2>
            <p className="text-2xl font-semibold text-gray-700">
              ${businessOverview.avgMemberBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Peak Transaction Hours */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            高峰交易時段
          </h2>
          <HorizontalBarChart data={peakHoursChartData} />
        </div>

        {/* Note Category Stats */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            備註類別統計
          </h2>
          <PieChart data={noteStatsChartData} singleColor="green" />
        </div>

        {/* Store Performance - Consumption */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            分店消費總額
          </h2>
          <HorizontalBarChart data={storeConsumptionChartData} />
        </div>

        {/* Store Performance - Deposit */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            分店存款總額
          </h2>
          <HorizontalBarChart data={storeDepositChartData} />
        </div>

        {/* Top Spending Members */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            高消費會員
          </h2>
          <HorizontalBarChart data={topSpendersChartData} />
        </div>

        {/* Vertical Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1 lg:row-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">交易趨勢</h2>
          <LineChart data={lineChartData} />
        </div>
      </div>
    </div>
  )
}
