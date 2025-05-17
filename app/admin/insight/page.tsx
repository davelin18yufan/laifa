import {
  getBusinessOverview,
  getPopularItems,
  getCategorySales,
  getRevenueTrend,
  getStorePerformance,
  getTopCustomers,
} from "@/actions/admin.action"
import {
  BusinessOverview,
  PopularItem,
  CategorySales,
  RevenueTrend,
  StorePerformance,
  TopCustomer,
} from "@/types"
import ClientPage from "./clientPage"

export default async function InsightPage() {
  const [
    businessOverview,
    popularItems,
    categorySales,
    revenueTrend,
    storePerformance,
    topCustomers,
  ] = await Promise.all([
    getBusinessOverview(),
    getPopularItems(),
    getCategorySales(),
    getRevenueTrend("day"),
    getStorePerformance(),
    getTopCustomers(),
  ])

  // if (
  //   !businessOverview ||
  //   !popularItems ||
  //   !categorySales ||
  //   !revenueTrend ||
  //   !storePerformance ||
  //   !topCustomers
  // ) {
  //   throw new Error("Failed to fetch data from one or more sources")
  // }

  return (
    <ClientPage
      businessOverview={businessOverview as BusinessOverview}
      popularItems={popularItems as PopularItem[]}
      categorySales={categorySales as CategorySales[]}
      revenueTrend={revenueTrend as RevenueTrend[]}
      storePerformance={storePerformance as StorePerformance[]}
      topCustomers={topCustomers as TopCustomer[]}
    />
  )
}
