import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton/FavoriteButton";
import VideoModal from "../components/Modals/VideoModal";
import { getMovieById } from "../api/index";
import type { Film } from "../types/film";
import { getRatingColor } from "../utils/ratingColor";
import { getEmbedUrl } from "../utils/video";
import { formatRuntime, formatCurrency } from "../utils/format";

interface FilmPageProps {
  onLoginRequired?: () => void;
}

export default function FilmPage({ onLoginRequired }: FilmPageProps) {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const fetchFilm = async () => {
      if (!id) {
        setError("ID фильма не указан");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMovieById(Number(id));
        setFilm(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки фильма");
        console.error("Ошибка загрузки фильма:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [id]);

  if (loading) {
    return (
      <section className="hero container">
        <div className="hero__wrapper">
          <p>Загрузка...</p>
        </div>
      </section>
    );
  }

  // Состояние ошибки
  if (error || !film) {
    return (
      <section className="container">
        <h2>Фильм не найден</h2>
        <p style={{ color: "red" }}>{error || "Фильм не найден"}</p>
        <Link to="/">Вернуться на главную</Link>
      </section>
    );
  }

  return (
    <>
      <h1 className="visually-hidden">Страница фильма</h1>
      <section className="hero container">
        <div className="hero__wrapper">
          <div className="hero__left-block">
            <div className="hero__attributes">
              {film.tmdbRating != null && (
                <span className={`hero__rating hero__rating--${getRatingColor(film.tmdbRating)}`}>
                  <svg className="hero__star-icon" width="16" height="16" viewBox="0 0 16 16">
                    <use href="/img/sprite.svg#star"></use>
                  </svg>
                  {film.tmdbRating.toFixed(1)}
                </span>
              )}
              {film.releaseYear != null && <span className="hero__date">{film.releaseYear}</span>}
              {film.genres?.length > 0 && <span className="hero__genre">{film.genres?.join(", ")}</span>}
              {film.runtime != null && <span className="hero__duration">{formatRuntime(film.runtime)}</span>}
            </div>
            <h2 className="hero__title">{film.title}</h2>
            <div className="hero__description">{film.plot || "Описание отсутствует"}</div>
            <div className="hero__buttons-block hero__buttons-block--compact">
              {film.trailerUrl && (
                <button
                  className="hero__trailer-btn btn btn--primary"
                  onClick={() => setIsVideoOpen(true)}
                >
                  Трейлер
                </button>
              )}
              <FavoriteButton
                filmId={film.id}
                className="hero__favorite-btn btn btn--secondary"
                onLoginRequired={onLoginRequired}
              />
            </div>
          </div>
          <div className="hero__right-block">
            <img
              src={film.backdropUrl || "/img/cover-plug.jpg"}
              alt={film.title}
              className="hero__picture hero__picture--expanded"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <section className="about-film container">
        <h2 className="about-film__title">О фильме</h2>
        <dl className="about-film__specs-block">
          <div className="about-film__row">
            <div className="about-film__term-wrapper">
              <dt className="about-film__term">Язык оригинала</dt>
              <span className="about-film__dots"></span>
            </div>
            <dd className="about-film__details">{film.language || "нет данных"}</dd>
          </div>
          <div className="about-film__row">
            <div className="about-film__term-wrapper">
              <dt className="about-film__term">Бюджет</dt>
              <span className="about-film__dots"></span>
            </div>
            <dd className="about-film__details">{formatCurrency(film.budget)}</dd>
          </div>
          <div className="about-film__row">
            <div className="about-film__term-wrapper">
              <dt className="about-film__term">Выручка</dt>
              <span className="about-film__dots"></span>
            </div>
            <dd className="about-film__details">{formatCurrency(film.revenue)}</dd>
          </div>
          <div className="about-film__row">
            <div className="about-film__term-wrapper">
              <dt className="about-film__term">Режиссёр</dt>
              <span className="about-film__dots"></span>
            </div>
            <dd className="about-film__details">{film.director || "нет данных"}</dd>
          </div>
          <div className="about-film__row">
            <div className="about-film__term-wrapper">
              <dt className="about-film__term">Продакшен</dt>
              <span className="about-film__dots"></span>
            </div>
            <dd className="about-film__details">{film.production || "нет данных"}</dd>
          </div>
          <div className="about-film__row">
            <div className="about-film__term-wrapper">
              <dt className="about-film__term">Награды</dt>
              <span className="about-film__dots"></span>
            </div>
            <dd className="about-film__details">{film.awardsSummary || "нет данных"}</dd>
          </div>
        </dl>
      </section>
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={film.trailerUrl ? getEmbedUrl(film.trailerUrl) : ""}
        title={film.title}
      />
    </>
  );
}
