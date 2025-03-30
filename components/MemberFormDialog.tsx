"use client"

import { useActionState } from "react"
import { Customer, StoreLocation } from "@/types"
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  useDialog,
} from "components/Dialog"
import GenderSelect from "components/GenderSelect"
import { addMember, updateMember } from "@/actions/member.action"
import { FaUserPlus, FaEdit } from "react-icons/fa"

interface MemberFormDialogProps {
  storeLocations: StoreLocation[]
  customer?: Customer | null // 若為更新模式，提供當前會員資料
  onSuccess: (updatedMember: Customer) => void // 提交成功後的回調
  isUpdate?: boolean // 是否為更新模式
}

interface FormState {
  success: boolean
  error: string | null
  payload?: {
    phone: string
    name: string
    storeId: string
    gender: Customer["gender"]
  }
}

export default function MemberFormDialog({
  storeLocations,
  customer = null,
  onSuccess,
  isUpdate = false,
}: MemberFormDialogProps) {
  const formAction = isUpdate ? updateMember : addMember

  const initialState: FormState = { success: false, error: null }

  const [formState, formActionHandler] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      const { setIsOpen } = useDialog()
      try {
        const member = await formAction(formData)
        const updatedMember: Customer = {
          id: member.memberId,
          phone: member.phone,
          balance: member.balance,
          name: member.name,
          lastVisit: member.lastBalanceUpdate,
          storeId: member.storeId,
          gender: member.gender,
          latestNote: member.latestNote,
        }
        onSuccess(updatedMember)
        setIsOpen(false) // 提交成功後關閉對話框
        return { success: true, error: null }
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
          payload: {
            phone: formData.get("phone") as string,
            name: formData.get("name") as string,
            storeId: formData.get("storeId") as string,
            gender: formData.get("gender") as Customer["gender"],
          },
        }
      }
    },
    initialState
  )

  return (
    <Dialog transition={{ duration: 0.3, ease: "easeInOut" }}>
      <DialogTrigger
        className={`${
          isUpdate
            ? "text-amber-600 hover:text-amber-800 flex items-center gap-1 text-sm transition-colors"
            : "px-4 py-2 bg-orange-300 text-black rounded-lg shadow-md hover:bg-amber-600 transition-colors flex items-center gap-2"
        }`}
      >
        {isUpdate ? (
          <>
            <FaEdit className="h-4 w-4" /> 編輯會員資料
          </>
        ) : (
          <>
            <FaUserPlus className="h-4 w-4" />
          </>
        )}
      </DialogTrigger>
      <DialogContainer className="top-10 min-w-88">
        <DialogContent className="bg-slate-50 rounded-xl p-6 relative shadow-lg">
          <DialogClose className="absolute top-4 right-4 text-gray-500 hover:text-amber-500" />
          <DialogTitle className="text-xl font-bold text-gray-800 mb-4">
            {isUpdate ? "更新會員資料" : "新增會員資料"}
          </DialogTitle>
          <DialogDescription>
            <form action={formActionHandler} className="space-y-4">
              {isUpdate && (
                <input type="hidden" name="memberId" value={customer?.id} />
              )}
              {/* 電話 */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  電話 <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  defaultValue={
                    isUpdate
                      ? customer?.phone || ""
                      : formState.payload?.phone || ""
                  }
                  placeholder="0912345678"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              {/* 姓名 */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  defaultValue={
                    isUpdate
                      ? customer?.name || ""
                      : formState.payload?.name || ""
                  }
                  placeholder="請輸入會員姓名"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>

              {/* 性別 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  性別
                </label>
                <div className="flex gap-4">
                  <GenderSelect
                    initialValue={
                      isUpdate
                        ? customer?.gender
                        : formState.payload?.gender
                    }
                  />
                </div>
              </div>

              {/* 分店 */}
              <div className="space-y-2">
                <label
                  htmlFor="storeId"
                  className="block text-sm font-medium text-gray-700"
                >
                  所屬分店 <span className="text-red-500">*</span>
                </label>
                <select
                  id="storeId"
                  name="storeId"
                  required
                  defaultValue={
                    isUpdate
                      ? customer?.storeId || ""
                      : formState.payload?.storeId || ""
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="" disabled>
                    請選擇分店
                  </option>
                  {storeLocations.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 提交按鈕 */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formState.success === false && !!formState.error}
                  className="w-full py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isUpdate ? "更新會員" : "新增會員"}
                </button>
              </div>

              {formState.error && (
                <p className="text-red-500 text-sm mt-2">{formState.error}</p>
              )}
            </form>
          </DialogDescription>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  )
}
