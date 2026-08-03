import { forwardRef } from "react";
import { Link } from "react-router-dom";
import type { Film } from "../../types/film";
import { getRatingColor } from '../../utils/ratingColor';
import { formatRuntime } from '../../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: Film[];
  query: string;
  loading: boolean;
}

const SearchModal = forwardRef<HTMLDivElement, SearchModalProps>(
  ({ isOpen, onClose, results, query, loading }, ref) => {
  
    return (
      <div className="search" id="search-modal" ref={ref} style={{ display: isOpen ? "block" : "none" }}>
        {isOpen && (
          <>
            {/* Если запрос пустой */}
            {!query.trim() && (
              <div className="search__empty">
                <p>Введите запрос для поиска</p>
              </div>
            )}

            {/* Если идёт загрузка */}
            {loading && query.trim() && (
              <div className="search__loading">
                <p>Поиск...</p>
              </div>
            )}

            {/* Если нет результатов */}
            {!loading && query.trim() && results.length === 0 && (
              <div className="search__empty">
                <p>Ничего не найдено по запросу "{query}"</p>
              </div>
            )}

            {/* Если есть результаты */}
            {!loading && query.trim() && results.length > 0 && (
              <ul className="search__list" id="search-results">
                {results.map((film) => (
                  <li className="search__item" key={film.id}>
                    <Link to={`/film/${film.id}`} className="search__link" onClick={onClose}>
                      <img
                        className="search__poster"
                        src={film.posterUrl || "/img/poster-plug.png"}
                        alt={`Постер фильма ${film.title}`}
                      />
                      <div className="search__info">
                        <div className="search__attributes">
                          {film.tmdbRating != null && (
                            <span className={`search__rating search__rating--${getRatingColor(film.tmdbRating)}`}>
                              <svg className="search__star-icon" width="10" height="10" viewBox="0 0 16 16">
                                <use href="/img/sprite.svg#star"></use>
                              </svg>
                              {film.tmdbRating.toFixed(1)}
                            </span>
                          )}
                          {film.releaseYear != null && <span className="search__date">{film.releaseYear}</span>}
                          {film.genres?.length > 0 && <span className="search__genre">{film.genres.join(", ")}</span>}
                          {film.runtime != null && (
                            <span className="search__duration">{formatRuntime(film.runtime)}</span>
                          )}
                        </div>
                        <div className="search__title">{film.title}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    );
  },
);

SearchModal.displayName = "SearchModal";

export default SearchModal;
