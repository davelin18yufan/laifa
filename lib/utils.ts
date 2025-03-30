import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Snake Case 轉 Camel Case 的工具函數
export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item));
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// debounce 函數
export function debounce<T extends unknown>(func: Function, wait: number = 300) {
  let timeout: NodeJS.Timeout;
  return function (this: T, ...args: any[]) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleDateString("zh-TW", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}
