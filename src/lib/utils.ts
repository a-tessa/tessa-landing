import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const homeSpacing = "px-12 sm:px-64 lg:px-90"

export const sectionCardShellSpacing = "w-screen px-4 sm:px-5 lg:px-7"

export const freeSectionShellSpacing = "w-screen px-20 sm:px-56 lg:px-87"

export const insideCardSpacing = "px-20 sm:px-54 lg:px-82"