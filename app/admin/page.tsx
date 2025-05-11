import { getMenuItems } from "@/actions/admin.action"
import ClientPage from "./clientPage"
import { MenuItem } from "@/types/Order"

export default async function AdminPage() {
  // 獲取菜單項目
  const menuItems = await getMenuItems()

  if (!menuItems) {
    throw new Error("Failed to fetch menu items")
  }

  return <ClientPage menuItems={menuItems as MenuItem[]} />
}
