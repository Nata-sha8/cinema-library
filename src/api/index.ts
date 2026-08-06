import type { Film } from "../types/film";
import type { User } from "../types/user";

const BASE_URL = "https://cinemaguide.skillbox.cc";

// Вспомогательная функция для обработки ответов
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include", // Важно для работы с куками (авторизация)
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    // Если сервер вернул ошибку, пытаемся получить текст ошибки
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка: ${response.status}`);
  }

  return response.json();
}

// --- МЕТОДЫ ДЛЯ ФИЛЬМОВ ---

// Получить топ-10 фильмов
export const getTop10 = (): Promise<Film[]> => request("/movie/top10");

// Получить список жанров
export const getGenres = (): Promise<string[]> => request("/movie/genres");

// Получить фильм по ID
export const getMovieById = (id: number): Promise<Film> => request(`/movie/${id}`);

// Получить случайный фильм (для hero-блока)
export const getRandomMovie = (): Promise<Film> => request("/movie/random");

// Обновлённая функция с поддержкой пагинации
export const getMovies = (params?: {
  genre?: string;
  count?: number;
  page?: number;
  title?: string;
}): Promise<Film[]> => {
  const query = new URLSearchParams();
  if (params?.genre) query.append("genre", params.genre);
  if (params?.count) query.append("count", String(params.count));
  if (params?.page !== undefined) query.append("page", String(params.page));
  if (params?.title) query.append("title", params.title);
  const queryString = query.toString();
  return request(`/movie${queryString ? `?${queryString}` : ""}`);
};

export const searchMoviesByTitle = async (title: string): Promise<Film[]> => {
  try {
    const films = await getMovies({ title });
    return films;
  } catch {
    return [];
  }
};

// ============ АВТОРИЗАЦИЯ ============

// Логин
export const login = async (email: string, password: string): Promise<{ user: User }> => {
  const response = await request<{ user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response;
};

// Регистрация
export const register = async (data: {
  email: string;
  password: string;
  name: string;
  surname: string;
}): Promise<{ success: boolean }> => {
  const response = await request<{ success: boolean }>("/user", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

// Выход
export const logout = async (): Promise<void> => {
  await request("/auth/logout", {
    method: "GET",
  });
};

// Получение профиля (для проверки авторизации)
export const getProfile = async (): Promise<User> => {
  const response = await request<User>("/profile", {
    method: "GET",
  });
  return response;
};

// ============ ИЗБРАННОЕ ============

// Получить список избранных фильмов
export const getFavorites = async (): Promise<Film[]> => {
  const response = await request<Film[]>("/favorites", {
    method: "GET",
  });
  return response;
};

// Добавить фильм в избранное
export const addFavorite = async (movieId: number): Promise<void> => {
  const formData = new URLSearchParams();
  formData.append("id", String(movieId));

  await request("/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });
};

// Удалить фильм из избранного
export const removeFavorite = async (movieId: number): Promise<void> => {
  await request(`/favorites/${movieId}`, {
    method: "DELETE",
  });
};
