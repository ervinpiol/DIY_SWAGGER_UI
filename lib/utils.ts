import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getEndpointId = (method: string, path: string) => {
  return `endpoint-${method}-${path}`
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
};

export const methodStyles: Record<
  string,
  { wrapper: string; badge: string; text: string; accent: string }
> = {
  GET: {
    wrapper: "bg-blue-50/50 border-blue-200",
    badge: "bg-blue-600 text-white",
    text: "text-blue-700",
    accent: "border-blue-200 bg-blue-50 text-blue-900",
  },
  POST: {
    wrapper: "bg-green-50/50 border-green-200",
    badge: "bg-green-600 text-white",
    text: "text-green-700",
    accent: "border-green-200 bg-green-50 text-green-900",
  },
  PUT: {
    wrapper: "bg-orange-50/50 border-orange-200",
    badge: "bg-orange-500 text-white",
    text: "text-orange-700",
    accent: "border-orange-200 bg-orange-50 text-orange-900",
  },
  DELETE: {
    wrapper: "bg-red-50/50 border-red-200",
    badge: "bg-red-600 text-white",
    text: "text-red-700",
    accent: "border-red-200 bg-red-50 text-red-900",
  },
  PATCH: {
    wrapper: "bg-yellow-50/50 border-yellow-200",
    badge: "bg-yellow-500 text-white",
    text: "text-yellow-700",
    accent: "border-yellow-200 bg-yellow-50 text-yellow-900",
  },
};
