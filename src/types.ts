// Core fields we actually use in UI
export type MealLite = {
    idMeal: string;
    strMeal: string;
    strMealThumb: string | null;
    strCategory?: string | null;
    strArea?: string | null;
  };
  
  export type Meal = MealLite & {
    strInstructions?: string | null;
    strTags?: string | null;
    // TheMealDB stores 20 ingredient/measure pairs; we'll normalize later
    [key: string]: any;
  };
  
  export type Category = {
    idCategory?: string;
    strCategory: string;
    strCategoryThumb?: string;
    strCategoryDescription?: string;
  };
  
  export type ApiList<T> = { meals: T[] | null };
  export type ApiCategories = { categories: Category[] };
  