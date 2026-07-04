export type CategoryColor = {
  color: string;
  bg: string;
};

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  Food: { color: "#007dfe", bg: "#dbeafe" },
  Transport: { color: "#39baa6", bg: "#d1fae5" },
  Shopping: { color: "#f97316", bg: "#ffedd5" },
  Activities: { color: "#a855f7", bg: "#f3e8ff" },
};

export const DEFAULT_CATEGORY_COLOR: CategoryColor = {
  color: "#717786",
  bg: "#ebedf8",
};

export function getCategoryColor(category: string): CategoryColor {
  return CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR;
}