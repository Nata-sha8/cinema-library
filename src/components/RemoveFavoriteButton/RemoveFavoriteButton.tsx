interface RemoveFavoriteButtonProps {
  filmId: number;
  onRemove: (id: number) => Promise<void>;
}

export default function RemoveFavoriteButton({ filmId, onRemove }: RemoveFavoriteButtonProps) {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await onRemove(filmId);
    } catch (error) {
      console.error("Ошибка удаления из избранного:", error);
    }
  };

  return (
    <button className="favorites__remove-btn" type="button" aria-label="Удалить из избранного" onClick={handleRemove}>
      <svg width="13" height="13" viewBox="0 0 13 13">
        <use href="/img/sprite.svg#close"></use>
      </svg>
    </button>
  );
}
