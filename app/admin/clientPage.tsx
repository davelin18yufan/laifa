"use client"

import { useState } from "react"
import { createMenuItem, updateMenuItem } from "@/actions/admin.action"
import { MenuItem } from "@/types/Order"

interface ClientPageProps {
  menuItems: MenuItem[]
}

export default function ClientPage({
  menuItems: initialMenuItems,
}: ClientPageProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    category: "",
    imageUrl: "",
    isAvailable: true,
    cost: 0,
  })
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 新增菜單項目
  const handleCreate = async () => {
    try {
      const createdItem = await createMenuItem({
        name: newItem.name,
        price: newItem.price,
        category: newItem.category,
        imageUrl: newItem.imageUrl || undefined,
        isAvailable: newItem.isAvailable,
        cost: newItem.cost
      })
      setMenuItems([...menuItems, createdItem])
      setNewItem({
        name: "",
        price: 0,
        category: "",
        imageUrl: "",
        isAvailable: true,
        cost: 0
      })
      setError(null)
    } catch (err: any) {
      setError(err.message || "無法新增菜單項目")
    }
  }

  // 開始編輯
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
  }

  // 更新菜單項目
  const handleUpdate = async () => {
    if (!editingItem) return
    try {
      const updatedItem = await updateMenuItem(editingItem.id, {
        name: editingItem.name,
        price: editingItem.price,
        category: editingItem.category,
        imageUrl: editingItem.imageUrl,
        isAvailable: editingItem.isAvailable,
      })
      setMenuItems(
        menuItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      )
      setEditingItem(null)
      setError(null)
    } catch (err: any) {
      setError(err.message || "無法更新菜單項目")
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700">菜單管理</h1>

      {/* 新增表單 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          新增菜單項目
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="名稱"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="價格"
            value={newItem.price}
            onChange={(e) =>
              setNewItem({ ...newItem, price: Number(e.target.value) })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="類別"
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="圖片 URL（選填）"
            value={newItem.imageUrl}
            onChange={(e) =>
              setNewItem({ ...newItem, imageUrl: e.target.value })
            }
            className="p-2 border rounded"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newItem.isAvailable}
              onChange={(e) =>
                setNewItem({ ...newItem, isAvailable: e.target.checked })
              }
              className="mr-2"
            />
            可提供
          </label>
        </div>
        <button
          onClick={handleCreate}
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          新增
        </button>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* 菜單清單 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">菜單項目</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">名稱</th>
              <th className="p-2">價格</th>
              <th className="p-2">類別</th>
              <th className="p-2">可提供</th>
              <th className="p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2">${item.price.toFixed(2)}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.isAvailable ? "是" : "否"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:underline"
                  >
                    編輯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 編輯模態框 */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              編輯菜單項目
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="名稱"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="價格"
                value={editingItem.price}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    price: Number(e.target.value),
                  })
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="類別"
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="圖片 URL（選填）"
                value={editingItem.imageUrl || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, imageUrl: e.target.value })
                }
                className="p-2 border rounded"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingItem.isAvailable}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      isAvailable: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                可提供
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 text-gray-500 hover:underline"
              >
                取消
              </button>
              <button
                onClick={handleUpdate}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
