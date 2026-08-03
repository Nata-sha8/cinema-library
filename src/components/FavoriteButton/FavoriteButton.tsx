import { useAuth } from "../../contexts/AuthContext";
import { useFavorites } from "../../hooks/useFavorites";

interface FavoriteButtonProps {
  filmId: number;
  className?: string;
  onLoginRequired?: () => void; // Колбэк для открытия модалки логина
}

export default function FavoriteButton({ filmId, className = "", onLoginRequired }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const isFilmFavorite = isFavorite(filmId);
  const isAuthenticated = !!user;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Если не авторизован — показываем модалку логина
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    try {
      if (isFilmFavorite) {
        await removeFromFavorites(filmId);
      } else {
        await addToFavorites(filmId);
      }
    } catch (error) {
      console.error("Ошибка при работе с избранным:", error);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-label={isFilmFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <svg
        className={`hero__like-icon ${isFilmFavorite ? "hero__like-icon--like" : ""}`}
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <use href="/img/sprite.svg#like"></use>
      </svg>
    </button>
  );
}
