import axios from "axios";
import type { ApiList, ApiCategories, Meal, MealLite, Category } from "../types";

const api = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1",
  timeout: 10000,
});

// tiny in-memory cache to be gentle on rate limits
const cache = new Map<string, any>();
async function get<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url);
  const { data } = await api.get<T>(url);
  cache.set(url, data);
  return data;
}

// ---- Endpoints ----

// Search by name (full Meal objects)
export async function searchMealsByName(q: string): Promise<Meal[]> {
  const data = await get<ApiList<Meal>>(`/search.php?s=${encodeURIComponent(q)}`);
  return data.meals ?? [];
}

// Lookup full meal by id
export async function getMealById(id: string): Promise<Meal | null> {
  const data = await get<ApiList<Meal>>(`/lookup.php?i=${encodeURIComponent(id)}`);
  return data.meals?.[0] ?? null;
}

// List categories (names & thumbs)
export async function getCategories(): Promise<Category[]> {
  const data = await get<ApiCategories>(`/categories.php`);
  return data.categories ?? [];
}

// Filter by category → returns lite meals (id, name, thumb only)
export async function filterMealsByCategory(category: string): Promise<MealLite[]> {
  const data = await get<ApiList<MealLite>>(`/filter.php?c=${encodeURIComponent(category)}`);
  return data.meals ?? [];
}

// Optional: list areas (cuisines)
export async function getAreas(): Promise<string[]> {
  const data = await get<{ meals: { strArea: string }[] | null }>(`/list.php?a=list`);
  return (data.meals ?? []).map(m => m.strArea);
}

// Utility to normalize ingredients (for Detail page later)
export function extractIngredients(meal: Meal): Array<{ ingredient: string; measure: string }> {
  const pairs: Array<{ ingredient: string; measure: string }> = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) pairs.push({ ingredient: ing.trim(), measure: (meas ?? "").trim() });
  }
  return pairs;
}
