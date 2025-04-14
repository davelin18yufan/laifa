import { getMenuItems } from "@/actions/menu.action"
import OrderClientPage from "./clientPage"

interface Product {
  id: string
  name: string
  price: number
  category: string
}

export default async function OrderPage({
  params,
}: {
  params: { storeId: string }
}) {
  const { storeId } = params

  // 抓取菜單（全域）
  const menuItems = await getMenuItems()

  // 轉換資料格式
  const products: Product[] = menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    category: item.category,
  }))

  return <OrderClientPage storeId={storeId} initialProducts={products} />
}
