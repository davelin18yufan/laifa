import { StoreLocation } from "@/types"
import ClientPage from "./clientPage"
import { getFrequentMembersByStore } from "@/actions/member.action"

export default async function ShopKeeperPage() {
  const storeLocations: StoreLocation[] = await getFrequentMembersByStore()

  return <ClientPage storeLocations={storeLocations} />
}
