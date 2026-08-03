export type RatingColor = "gold" | "green" | "gray" | "red";

export const getRatingColor = (rating: number | null | undefined): RatingColor => {
  if (rating === null || rating === undefined) return "gray";

  if (rating >= 8) return "gold";
  if (rating >= 7) return "green";
  if (rating >= 5) return "gray";
  if (rating >= 1) return "red";

  return "gray";
};
