"use server"

import { createClient } from "@/lib/supabase/server"
import {
  BusinessOverview,
  PeakTransactionHour,
  NoteCategoryStat,
  StorePerformance,
  TopSpendingMember,
  CategorySales,
  PopularItem,
  RevenueTrend,
  TopCustomer,
} from "@/types"
import { snakeToCamel } from "@/lib/utils"
import { MenuItem } from "@/types/Order"

export async function getBusinessOverview(): Promise<BusinessOverview> {
  const supabase = await createClient()
  const { data } = await supabase.from("business_overview").select("*").single()
  return snakeToCamel(data) as BusinessOverview
}

export async function getPeakTransactionHours(): Promise<
  PeakTransactionHour[]
> {
  const supabase = await createClient()
  const { data } = await supabase.from("peak_transaction_hours").select("*")
  return snakeToCamel(data) as PeakTransactionHour[]
}

export async function getNoteCategoryStats(): Promise<NoteCategoryStat[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("note_category_stats").select("*")
  return snakeToCamel(data) as NoteCategoryStat[]
}

export async function getStorePerformance(): Promise<StorePerformance[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("store_performance").select("*")
  return snakeToCamel(data) as StorePerformance[]
}

export async function getTopSpendingMembers(): Promise<TopSpendingMember[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("top_spending_members").select("*")
  return snakeToCamel(data) as TopSpendingMember[]
}

// 獲取菜單項目
export async function getMenuItems(isAvailable?: boolean): Promise<MenuItem[]> {
  const supabase = await createClient();
  let query = supabase.from("menu_items").select("*").order("category").order("name");

  if (isAvailable !== undefined) {
    query = query.eq("is_available", isAvailable);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching menu items:", error);
    throw new Error("無法獲取菜單項目");
  }

  const formattedData = snakeToCamel(data) as MenuItem[];

  return formattedData || [];
}

// 獲取菜單類別
export async function getMenuCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("category")
    .not("category", "is", null)
    .order("category");

  if (error) {
    console.error("Error fetching menu categories:", error);
    throw new Error("無法獲取菜單類別");
  }

  const categories = Array.from(
    new Set(data.map((item) => item.category as string))
  ).sort();
  return categories;
}

// 新增菜單項目
export async function createMenuItem(input: {
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  cost: number;
}): Promise<MenuItem> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      name: input.name,
      price: input.price,
      category: input.category,
      image_url: input.imageUrl,
      is_available: input.isAvailable,
      cost: input.cost,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating menu item:", error);
    throw new Error(error.message || "無法新增菜單項目");
  }

  return data;
}

// 更新菜單項目
export async function updateMenuItem(
  id: string,
  input: {
    name?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
    isAvailable?: boolean;
    cost?: number;
  }
): Promise<MenuItem> {
  const supabase = await createClient();

  if (!input || Object.keys(input).length === 0) {
    throw new Error("更新資料不可為空");
  }
  if (!id) {
    throw new Error("菜單項目 ID 不可為空");
  }
  if (input.price && input.price < 0) {
    throw new Error("價格不可為負數");
  }
  if (input.cost && input.cost < 0) {
    throw new Error("成本不可為負數");
  }
  if (input.isAvailable === undefined) {
    throw new Error("可用性不可為空");
  }
  if (input.name && input.name.length > 20) {
    throw new Error("名稱長度不可超過 20 個字元");
  }

  const updateData = {
    ...(input.name && { name: input.name }),
    ...(input.price && { price: input.price }),
    ...(input.category && { category: input.category }),
    ...(input.imageUrl && { image_url: input.imageUrl }),
    ...(input.isAvailable !== undefined && { is_available: input.isAvailable }),
    ...(input.cost && { cost: input.cost }),
  };

  const { data, error } = await supabase
    .from("menu_items")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating menu item:", error);
    throw new Error(error.message || "無法更新菜單項目");
  }

  return data;
}


// 刪除菜單項目
export async function deleteMenuItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting menu item:", error);
    if (error.code === "23503") {
      throw new Error("無法刪除，因為此項目已被訂單使用");
    }
    throw new Error(error.message || "無法刪除菜單項目");
  }
}

// 獲取熱門品項
export async function getPopularItems(): Promise<PopularItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc("get_popular_items")
    .select("name, category, order_count, total_quantity, total_revenue")
    .order("total_revenue", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching popular items:", error)
    throw new Error("無法獲取熱門品項")
  }

  return data || []
}

// 品類銷售佔比
export async function getCategorySales(): Promise<CategorySales[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc("get_category_sales")
    .select("category, total_revenue")
    .order("total_revenue", { ascending: false })

  if (error) {
    console.error("Error fetching category sales:", error)
    throw new Error("無法獲取品類銷售")
  }

  return data || []
}

// 收入趨勢
export async function getRevenueTrend(
  timeRange: "day" | "week" | "month" = "day"
): Promise<RevenueTrend[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc("get_revenue_trend", { time_range: timeRange })
    .select("date, transaction_count, total_revenue")
    .order("date")

  if (error) {
    console.error("Error fetching revenue trend:", error)
    throw new Error("無法獲取收入趨勢")
  }

  return data || []
}

// 高價值客戶
export async function getTopCustomers(): Promise<TopCustomer[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .rpc("get_top_customers")
    .select(
      "name, order_count, total_spent, preferred_categories, preferred_store"
    )
    .order("total_spent", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching top customers:", error)
    throw new Error("無法獲取高價值客戶")
  }

  return data || []
}
