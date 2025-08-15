import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Returns the initials from a full name.
 *
 * @param name - Full name as a string (e.g., "Arun Kumar")
 * @returns Initials in uppercase (e.g., "AK")
 */
export const getInitials = (name?: string): string => {
  if (!name) return '?'; // or return 'NA', '?' etc.

  return name
    // Split the name by spaces to get each word
    .split(' ')
    // Filter out any empty strings (in case of extra spaces)
    .filter(Boolean)
    // Take the first character of each word and convert to uppercase
    .map((word) => word[0].toUpperCase())
    // Combine all initials into a single string
    .join('');
};
