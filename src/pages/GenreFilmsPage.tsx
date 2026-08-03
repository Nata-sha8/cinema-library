import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovies } from "../api/index";
import { genres } from "../data/genres";
import type { Film } from "../types/film";
import FilmCard from "../components/FilmCard/FilmCard";

const LOAD_STEP = 10; // Количество фильмов, подгружаемых за раз
const INITIAL_LIMIT = 15; // Сколько фильмов показываем сначала

export default function GenreFilmsPage() {
  const { genreId } = useParams<{ genreId: string }>();
  const [allFilms, setAllFilms] = useState<Film[]>([]); // Все фильмы из API
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_LIMIT); // Сколько сейчас показываем
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Находим жанр в локальном файле для красивого названия
  const genre = genres.find((g) => g.id === genreId);

  useEffect(() => {
    const fetchFilms = async () => {
      if (!genreId) {
        setError("Жанр не указан");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMovies({ genre: genreId });
        setAllFilms(data);
        setVisibleCount(INITIAL_LIMIT); // Сбрасываем количество при новом жанре
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки фильмов");
        console.error("Ошибка загрузки фильмов:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [genreId]);

  // Фильмы, которые сейчас показываем
  const visibleFilms = allFilms.slice(0, visibleCount);

  // Проверяем, есть ли ещё фильмы для показа
  const hasMoreFilms = allFilms.length > visibleCount;

  // Функция для подгрузки следующей порции
  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_STEP, allFilms.length));
  };

  // Состояние загрузки
  if (loading) {
    return (
      <section className="genre container">
        <div className="genre__title-wrapper">
          <Link className="genre__genres-link" to="/genres">
            <svg className="genre__back-genres-icon" width="13" height="22" viewBox="0 0 13 22">
              <use href="/img/sprite.svg#arrow"></use>
            </svg>
          </Link>
          <h1 className="genre__title">{genre?.name || "Жанр"}</h1>
        </div>
        <p>Загрузка фильмов...</p>
      </section>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <section className="genre container">
        <div className="genre__title-wrapper">
          <Link className="genre__genres-link" to="/genres">
            <svg className="genre__back-genres-icon" width="13" height="22" viewBox="0 0 13 22">
              <use href="/img/sprite.svg#arrow"></use>
            </svg>
          </Link>
          <h1 className="genre__title">{genre?.name || "Жанр"}</h1>
        </div>
        <p style={{ color: "red" }}>Ошибка: {error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </section>
    );
  }

  return (
    <>
      <h1 className="visually-hidden">Жанры фильмов</h1>
      <section className="genre container">
        <div className="genre__title-wrapper">
          <Link className="genre__genres-link" to="/genres">
            <svg className="genre__back-genres-icon" width="13" height="22" viewBox="0 0 13 22">
              <use href="/img/sprite.svg#arrow"></use>
            </svg>
          </Link>
          <h1 className="genre__title">{genre?.name || "Жанр"}</h1>
        </div>

        <ul className="genre__list cards">
          {visibleFilms.length > 0 ? (
            visibleFilms.map((film) => (
              <li className="cards__item" key={film.id}>
                <FilmCard film={film} />
              </li>
            ))
          ) : (
            <p className="genre__empty">Фильмов в этом жанре пока нет</p>
          )}
        </ul>
        {hasMoreFilms && (
          <button type="button" className="genre__more-card-btn btn btn--primary" onClick={handleShowMore}>
            Показать ещё
          </button>
        )}
      </section>
    </>
  );
}
