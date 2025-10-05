// frontend/src/utils/storage.js
export const STORAGE_KEY = "expenses";

// Generate a unique ID
export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Load expenses from localStorage
export function loadExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error loading expenses:", err);
    return [];
  }
}

// Save expenses to localStorage
export function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error("Error saving expenses:", err);
  }
}
