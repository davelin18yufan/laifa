import {
  getBusinessOverview,
  getPeakTransactionHours,
  getNoteCategoryStats,
  getStorePerformance,
  getTopSpendingMembers,
} from "@/actions/admin.action"
import {
  BusinessOverview,
  PeakTransactionHour,
  NoteCategoryStat,
  StorePerformance,
  TopSpendingMember,
} from "@/types"
import ClientPage from "./clientPage"

export default async function AdminPage() {
  // 獲取所有 View 資料
  const [
    businessOverview,
    peakHoursData,
    noteStatsData,
    storePerformanceData,
    topSpendersData,
  ] = await Promise.all([
    getBusinessOverview(),
    getPeakTransactionHours(),
    getNoteCategoryStats(),
    getStorePerformance(),
    getTopSpendingMembers(),
  ])

  // 檢查是否有錯誤或空數據
  if (
    !businessOverview ||
    !peakHoursData ||
    !noteStatsData ||
    !storePerformanceData ||
    !topSpendersData
  ) {
    throw new Error("Failed to fetch data from one or more views")
  }

  return (
    <ClientPage
      businessOverview={businessOverview as BusinessOverview}
      peakHoursData={peakHoursData as PeakTransactionHour[]}
      noteStatsData={noteStatsData as NoteCategoryStat[]}
      storePerformanceData={storePerformanceData as StorePerformance[]}
      topSpendersData={topSpendersData as TopSpendingMember[]}
    />
  )
}
