import { getMenuItems } from "@/actions/admin.action"
import { getStoreById } from "@/actions/store.action"
import OrderClientPage from "./clientPage"
import { type Product } from "@/types/Order"

export default async function OrderPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params

  // 抓取菜單
  const [menuItems, store] = await Promise.all([
    getMenuItems(true),
    getStoreById(storeId),
  ])

  // 轉換資料格式
  const products: Product[] = menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    category: item.category,
  }))

  return <OrderClientPage store={store} initialProducts={products} />
}
