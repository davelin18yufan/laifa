import { getMenuItems } from "@/actions/admin.action"
import ClientPage from "./clientPage"
import { MenuItem } from "@/types/Order"
import { getMenuCategories } from "@/actions/admin.action"

export default async function AdminPage() {
  // 獲取菜單項目
  const [menuItems, categories] = await Promise.all([
    getMenuItems(),
    getMenuCategories()
  ])

  if (!menuItems) {
    throw new Error("Failed to fetch menu items")
  }

  return <ClientPage menuItems={menuItems as MenuItem[]} categories={categories} />
}
