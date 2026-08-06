import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { getProfile, logout as apiLogout, login as apiLogin, register as apiRegister } from "../api";
import type { User } from "../types/user";

/* eslint-disable react-refresh/only-export-components */

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { email: string; password: string; name: string; surname: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    await apiLogin(email, password); // Логинимся (сервер создаёт сессию)
    const userProfile = await getProfile(); // Загружаем профиль пользователя
    setUser(userProfile); //Сохраняем пользователя
    return userProfile;
  }, []);

  const register = useCallback(
    async (data: { email: string; password: string; name: string; surname: string }) => {
      await apiRegister(data);
      await login(data.email, data.password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
          setUser(null);
        } else {
          console.error("Ошибка проверки авторизации:", error);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Метод useAuth необходимо использовать внутри AuthProvider.");
  }
  return context;
};
/* eslint-enable react-refresh/only-export-components */