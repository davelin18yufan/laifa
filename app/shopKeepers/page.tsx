import { StoreLocation } from "@/types"
import ClientPage from "./clientPage"
import { getFrequentMembersByStore } from "@/actions/member.action"

export const revaldate = 60 * 60 // 1小時
export const dynamic = "force-dynamic" // 強制重新驗證

export default async function ShopKeeperPage() {
  const storeLocations: StoreLocation[] = await getFrequentMembersByStore()

  return <ClientPage storeLocations={storeLocations} />
}
