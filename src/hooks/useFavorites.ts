import { useState, useEffect, useCallback } from "react";
import { getFavorites, addFavorite, removeFavorite } from "../api";
import type { Film } from "../types/film";

/* eslint-disable react-hooks/set-state-in-effect */

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка избранных фильмов
  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки избранного");
      console.error("Ошибка загрузки избранного:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Добавление в избранное
  const addToFavorites = useCallback(
    async (movieId: number) => {
      try {
        await addFavorite(movieId);
        // После успешного добавления обновляем список
        await loadFavorites();
      } catch (err) {
        console.error("Ошибка добавления в избранное:", err);
        throw err;
      }
    },
    [loadFavorites],
  );

  // Удаление из избранного
  const removeFromFavorites = useCallback(async (movieId: number) => {
    try {
      await removeFavorite(movieId);
      // После успешного удаления обновляем список
      setFavorites((prev) => {
        const newFavorites = prev.filter((film) => film.id !== movieId);
        return newFavorites;
      });
    } catch (err) {
      console.error("Ошибка удаления из избранного:", err);
      throw err;
    }
  }, []);

  // Проверка, находится ли фильм в избранном
  const isFavorite = useCallback(
    (movieId: number) => {
      return favorites.some((film) => film.id === movieId);
    },
    [favorites],
  );

  // Загружаем избранное при монтировании
  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    favorites,
    isLoading,
    error,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
};
