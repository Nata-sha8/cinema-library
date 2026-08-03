import { Link } from "react-router-dom";
import RemoveFavoriteButton from "../RemoveFavoriteButton/RemoveFavoriteButton";

interface FilmCardProps {
  film: {
    id: number;
    title: string;
    posterUrl: string | null;
  };

  showRank?: boolean; // номер для топа
  rank?: number; // Номер фильма (если showRank=true)
  showRemoveButton?: boolean; //кнопка удаления из избранного
  onRemove?: (id: number) => Promise<void>; // Колбэк при удалении из избранного
}

export default function FilmCard({ film, showRank = false, rank, showRemoveButton = false, onRemove }: FilmCardProps) {
  return (
    <div className="cards__card-wrapper">
      <Link to={`/film/${film.id}`} className="cards__card" title={film.title}>
        {showRank && rank !== undefined && <div className="cards__label">{rank}</div>}
        <img src={film.posterUrl || "/img/poster-plug.png"} alt={film.title} className="cards__poster" loading="lazy" />
      </Link>
      {showRemoveButton && onRemove && <RemoveFavoriteButton filmId={film.id} onRemove={onRemove} />}
    </div>
  );
}
