// Форматирует длительность фильма из минут в формат "х часов ч мин"
export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} мин`;
  }

  return `${hours} ч ${mins} мин`;
};

// Форматирует бюджет/выручку в валютный вид
export const formatCurrency = (value: string | number | null | undefined): string => {
  if (!value) return "нет данных";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "нет данных";

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numValue);
};
