import ClientPage from "./clientPage"
import { getFrequentMembersByStore } from "@/actions/member.action"
import { getAllStores } from "@/actions/store.action"

export const dynamic = "force-dynamic" // 強制重新驗證

export default async function ShopKeeperPage() {
  const [storeLocations, allStores] = await Promise.all([
    getFrequentMembersByStore(),
    getAllStores(),
  ])

  return (
    <ClientPage
      storeLocations={storeLocations}
      allStores={allStores}
    />
  )
}
