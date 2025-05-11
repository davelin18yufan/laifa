"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  createMenuItem,
  deleteMenuItem,
  updateMenuItem,
} from "@/actions/admin.action"
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
} from "@/components/Dialog"
import { MenuItem } from "@/types/Order"
import { FaTrashAlt, FaChevronCircleDown, FaPlusCircle } from "react-icons/fa"
import { cn } from "@/lib/utils"

interface EditableMenuItem {
  name: string
  price: number | null
  category: string
  imageUrl: string
  isAvailable: boolean
  cost: number | null
}

interface ClientPageProps {
  menuItems: MenuItem[]
  categories: string[]
}

export default function ClientPage({
  menuItems: initialMenuItems,
  categories,
}: ClientPageProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [newItem, setNewItem] = useState<EditableMenuItem>({
    name: "",
    price: null,
    category: "",
    imageUrl: "",
    isAvailable: true,
    cost: null,
  })
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("")
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean
  }>({})
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false)

  // 按分類分組
  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || "未分類"
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as { [key: string]: MenuItem[] })

  // 排序分類
  const sortedCategories = Object.keys(groupedItems).sort()

  // 設置默認標籤
  useEffect(() => {
    if (activeTab === "" && sortedCategories.length > 0) {
      setActiveTab(sortedCategories[0])
    }
  }, [sortedCategories])

  // 新增菜單項目
  const handleCreate = async () => {
    if (
      !newItem.name ||
      newItem.price === null ||
      !newItem.category ||
      newItem.category === "__custom"
    ) {
      setError("名稱、價格和類別為必填欄位")
      return
    }
    try {
      const createdItem = await createMenuItem({
        name: newItem.name,
        price: newItem.price ?? 0,
        category: newItem.category,
        imageUrl: newItem.imageUrl || undefined,
        isAvailable: newItem.isAvailable,
        cost: newItem.cost ?? 0,
      })
      setMenuItems([...menuItems, createdItem])
      setNewItem({
        name: "",
        price: null,
        category: "",
        imageUrl: "",
        isAvailable: true,
        cost: null,
      })
      setError(null)
    } catch (err: any) {
      console.error("Create menu item failed:", err)
      setError(err.message || "無法新增菜單項目")
    }
  }

  // 更新菜單項目
  const handleUpdate = async (item: MenuItem) => {
    try {
      const updatedItem = await updateMenuItem(item.id, {
        name: item.name,
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
        cost: item.cost,
      })
      setMenuItems(
        menuItems.map((i) => (i.id === updatedItem.id ? updatedItem : i))
      )
      setEditingItem(null)
      setError(null)
    } catch (err: any) {
      console.error("Update menu item failed:", err)
      setError(err.message || "無法更新菜單項目")
    }
  }

  // 批量刪除
  const handleDelete = async () => {
    const selectedIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    )
    if (selectedIds.length === 0) return

    let errors: string[] = []
    for (const id of selectedIds) {
      try {
        await deleteMenuItem(id)
      } catch (err: any) {
        console.error("Delete menu item failed:", err)
        errors.push(err.message || `無法刪除項目（ID: ${id}）`)
      }
    }

    if (errors.length > 0) {
      setError(errors.join("; "))
    } else {
      setMenuItems(menuItems.filter((item) => !selectedIds.includes(item.id)))
      setSelectedItems({})
      setSelectAll(false)
      if (
        groupedItems[activeTab]?.length === selectedIds.length &&
        sortedCategories.length > 1
      ) {
        const currentIndex = sortedCategories.indexOf(activeTab)
        const nextTab =
          sortedCategories[currentIndex + 1] || sortedCategories[0]
        setActiveTab(nextTab)
      }
      setError(null)
    }
  }

  // 單獨刪除
  const handleSingleDelete = async (id: string) => {
    try {
      await deleteMenuItem(id)
      setMenuItems(menuItems.filter((item) => item.id !== id))
      setDeletingItemId(null)
      setSelectedItems((prev) => {
        const newSelected = { ...prev }
        delete newSelected[id]
        return newSelected
      })
      if (
        groupedItems[activeTab]?.length === 1 &&
        sortedCategories.length > 1
      ) {
        const currentIndex = sortedCategories.indexOf(activeTab)
        const nextTab =
          sortedCategories[currentIndex + 1] || sortedCategories[0]
        setActiveTab(nextTab)
      }
      setError(null)
    } catch (err: any) {
      console.error("Delete menu item failed:", err)
      setError(err.message || "無法刪除菜單項目")
    }
  }

  // 處理全選
  const handleSelectAll = (category: string) => {
    const newSelectedItems = { ...selectedItems }
    const categoryItems = groupedItems[category]
    const newSelectAllState = !selectAll
    setSelectAll(newSelectAllState)
    categoryItems.forEach((item) => {
      newSelectedItems[item.id] = newSelectAllState
    })
    setSelectedItems(newSelectedItems)
  }

  // 處理單個項目選擇
  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
    setSelectAll(false) // 單選時取消全選
  }

  return (
    <div className="p-6 bg-amber-50 dark:bg-zinc-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">菜單管理</h1>

      {/* 可展開的新增表單 */}
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md mb-8 overflow-hidden">
        <button
          onClick={() => setIsFormExpanded(!isFormExpanded)}
          className="w-full px-6 py-4 flex justify-between items-center bg-amber-500 dark:bg-amber-900 text-white hover:bg-amber-600 hover:dark:bg-amber-800 transition-colors"
        >
          <div className="flex items-center">
            <FaPlusCircle size={20} className="mr-2" />
            <span className="text-xl font-semibold">新增菜單項目</span>
          </div>
          <FaChevronCircleDown
            size={20}
            className={cn(
              isFormExpanded && "rotate-180",
              "transition-transform duration-300 delay-100"
            )}
          />
        </button>

        <AnimatePresence>
          {isFormExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 border-l-4 border-amber-500 dark:border-amber-800 overflow-hidden"
              layout
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="名稱"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="number"
                  placeholder="價格"
                  value={newItem.price ?? ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      price: Number(e.target.value) || null,
                    })
                  }
                  className="p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="number"
                  placeholder="成本"
                  value={newItem.cost ?? ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      cost: Number(e.target.value) || null,
                    })
                  }
                  className="p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="p-3 border border-amber-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">選擇類別</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom">➕ 新增自定義類別</option>
                  </select>
                  {newItem.category === "__custom" && (
                    <input
                      type="text"
                      placeholder="輸入新類別"
                      value={
                        newItem.category === "__custom" ? "" : newItem.category
                      }
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      className="mt-2 p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                    />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="圖片網址（選填）"
                  value={newItem.imageUrl}
                  onChange={(e) =>
                    setNewItem({ ...newItem, imageUrl: e.target.value })
                  }
                  className="p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.isAvailable}
                    onChange={(e) =>
                      setNewItem({ ...newItem, isAvailable: e.target.checked })
                    }
                    className="mr-2 h-5 w-5 text-amber-600"
                  />
                  <span className="text-gray-700 dark:text-gray-50">上架?</span>
                </label>
              </div>
              <button
                onClick={handleCreate}
                className="mt-4 bg-amber-500 dark:bg-amber-800 text-white py-2 px-6 rounded-lg hover:bg-amber-600 transition duration-200 font-medium"
              >
                新增項目
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-red-100 dark:bg-red-800 dark:text-red-100 text-red-700 p-4 rounded-lg mb-6 border-l-4 border-red-500">
          {error}
        </div>
      )}

      {/* Tab 導航 */}
      <div className="relative mb-4 border-b border-amber-200">
        <ul className="flex flex-wrap -mb-px relative">
          {sortedCategories.map((category) => (
            <li key={category} className="mr-2 relative">
              <button
                className={`inline-block py-3 px-4 font-medium rounded-t-lg ${
                  activeTab === category
                    ? "text-amber-700 dark:text-amber-600"
                    : "text-gray-500 hover:text-amber-700 hover:border-amber-300"
                }`}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </button>
              {activeTab === category && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-t"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 當前分類菜單項目 */}
      {activeTab && groupedItems[activeTab] && (
        <div className="bg-zinc-50 dark:bg-slate-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-amber-700">
              {activeTab}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                disabled={
                  Object.values(selectedItems).filter(Boolean).length === 0
                }
                className={`flex items-center px-3 py-1 rounded text-zinc-950 ${
                  Object.values(selectedItems).filter(Boolean).length === 0
                    ? "bg-gray-300 cursor-not-allowed text-white"
                    : "bg-red-500 dark:bg-red-600 hover:bg-rose-600 transition"
                }`}
              >
                <FaTrashAlt size={16} className="mr-1" />
                刪除所選
              </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse font-mono">
            <thead>
              <tr className="bg-amber-100 dark:bg-transparent">
                <th className="p-2 rounded-tl-lg w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => handleSelectAll(activeTab)}
                    className="h-5 w-5 text-amber-600 border-2 border-amber-300 rounded"
                  />
                </th>
                <th className="p-3">名稱</th>
                <th className="p-3">價格</th>
                <th className="p-3">成本</th>
                <th className="p-3">圖片</th>
                <th className="p-3">狀態</th>
                <th className="p-3 rounded-tr-lg">操作</th>
              </tr>
            </thead>
            <tbody>
              {groupedItems[activeTab].map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b ${
                    index % 2 === 0
                      ? "bg-white dark:bg-slate-900"
                      : "bg-amber-50 dark:bg-slate-800"
                  } hover:bg-amber-100 hover:dark:bg-slate-950 transition cursor-pointer`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!selectedItems[item.id]}
                      onChange={() => handleSelectItem(item.id)}
                      className="h-5 w-5 text-amber-600 rounded"
                    />
                  </td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">${item.price.toFixed(2)}</td>
                  <td className="p-3">${item.cost?.toFixed(2) || "未設定"}</td>
                  <td className="p-3">
                    {item.imageUrl ? (
                      <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              "/api/placeholder/40/40"
                          }}
                        />
                      </div>
                    ) : (
                      "無圖片"
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isAvailable ? "可提供" : "下架"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Dialog>
                      <DialogTrigger className="text-amber-600 hover:text-amber-800 font-medium">
                        編輯
                      </DialogTrigger>
                      <DialogContainer>
                        <DialogContent className="bg-amber-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md min-w-sm">
                          <DialogClose className="text-gray-500 hover:text-gray-700 absolute right-4 top-4" />
                          <h3 className="text-xl font-semibold mb-4 text-amber-700">
                            編輯菜單項目
                          </h3>
                          <div className="grid grid-cols-1 gap-4 text-gray-700 dark:text-slate-50">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                名稱
                              </label>
                              <input
                                type="text"
                                placeholder="名稱"
                                value={
                                  editingItem?.id === item.id
                                    ? editingItem.name
                                    : item.name
                                }
                                onChange={(e) =>
                                  setEditingItem(
                                    editingItem?.id === item.id
                                      ? { ...editingItem, name: e.target.value }
                                      : { ...item, name: e.target.value }
                                  )
                                }
                                className="p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                價格
                              </label>
                              <input
                                type="number"
                                placeholder="價格"
                                value={
                                  editingItem?.id === item.id
                                    ? editingItem.price
                                    : item.price
                                }
                                onChange={(e) =>
                                  setEditingItem(
                                    editingItem?.id === item.id
                                      ? {
                                          ...editingItem,
                                          price: Number(e.target.value),
                                        }
                                      : {
                                          ...item,
                                          price: Number(e.target.value),
                                        }
                                  )
                                }
                                className="p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                成本
                              </label>
                              <input
                                type="number"
                                placeholder="成本"
                                value={
                                  editingItem?.id === item.id
                                    ? editingItem.cost ?? ""
                                    : item.cost ?? ""
                                }
                                onChange={(e) =>
                                  setEditingItem(
                                    editingItem?.id === item.id
                                      ? {
                                          ...editingItem,
                                          cost: Number(e.target.value),
                                        }
                                      : {
                                          ...item,
                                          cost: Number(e.target.value),
                                        }
                                  )
                                }
                                className="p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                類別
                              </label>
                              <input
                                type="text"
                                placeholder="類別"
                                value={
                                  editingItem?.id === item.id
                                    ? editingItem.category
                                    : item.category
                                }
                                onChange={(e) =>
                                  setEditingItem(
                                    editingItem?.id === item.id
                                      ? {
                                          ...editingItem,
                                          category: e.target.value,
                                        }
                                      : { ...item, category: e.target.value }
                                  )
                                }
                                className="p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                圖片 URL
                              </label>
                              <input
                                type="text"
                                placeholder="圖片 URL（選填）"
                                value={
                                  editingItem?.id === item.id
                                    ? editingItem.imageUrl || ""
                                    : item.imageUrl || ""
                                }
                                onChange={(e) =>
                                  setEditingItem(
                                    editingItem?.id === item.id
                                      ? {
                                          ...editingItem,
                                          imageUrl: e.target.value,
                                        }
                                      : { ...item, imageUrl: e.target.value }
                                  )
                                }
                                className="p-3 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"
                              />
                            </div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={
                                  editingItem?.id === item.id
                                    ? editingItem.isAvailable
                                    : item.isAvailable
                                }
                                onChange={(e) =>
                                  setEditingItem(
                                    editingItem?.id === item.id
                                      ? {
                                          ...editingItem,
                                          isAvailable: e.target.checked,
                                        }
                                      : {
                                          ...item,
                                          isAvailable: e.target.checked,
                                        }
                                  )
                                }
                                className="mr-2 h-5 w-5 text-amber-600"
                              />
                              <span className="text-gray-700 dark:text-gray-200">
                                上架?
                              </span>
                            </label>
                          </div>
                          <button
                            onClick={() =>
                              handleUpdate(
                                editingItem?.id === item.id ? editingItem : item
                              )
                            }
                            className="mt-6 bg-amber-500 dark:bg-slate-900 text-white p-3 rounded-lg hover:bg-amber-600 hover:dark:bg-amber-800 transition duration-200 w-full font-medium"
                          >
                            保存
                          </button>
                        </DialogContent>
                      </DialogContainer>
                    </Dialog>
                    {/* <Dialog>
                      <DialogTrigger className="text-red-600 hover:text-red-800 font-medium">
                        <FaTrashAlt size={16} />
                      </DialogTrigger>
                      <DialogContainer>
                        <DialogContent className="bg-amber-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
                          <DialogClose className="text-gray-500 hover:text-gray-700 absolute right-4 top-4" />
                          <h3 className="text-xl font-semibold mb-4 text-amber-700">
                            刪除確認
                          </h3>
                          <p className="text-gray-700 dark:text-gray-200 mb-4">
                            確定要刪除「{item.name}」嗎？此操作無法恢復。
                          </p>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setDeletingItemId(null)}
                              className="p-2 text-gray-500 hover:text-gray-700"
                            >
                              取消
                            </button>
                            <button
                              onClick={() => handleSingleDelete(item.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              確認
                            </button>
                          </div>
                        </DialogContent>
                      </DialogContainer>
                    </Dialog> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// 伺服器端獲取類別
export async function getServerSideProps() {
  const { getMenuItems, getMenuCategories } = await import(
    "@/actions/admin.action"
  )
  const menuItems = await getMenuItems()
  const categories = await getMenuCategories()
  return {
    props: {
      menuItems,
      categories,
    },
  }
}
