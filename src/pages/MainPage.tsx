import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SwiperWrapper from "../components/SwiperWrapper/SwiperWrapper";
import FavoriteButton from "../components/FavoriteButton/FavoriteButton";
import VideoModal from "../components/Modals/VideoModal";
import FilmCard from "../components/FilmCard/FilmCard";
import { getTop10, getRandomMovie } from "../api/index";
import type { Film } from "../types/film";
import { getRatingColor } from "../utils/ratingColor";
import { formatRuntime } from "../utils/format";
import { getEmbedUrl } from "../utils/video";
import "swiper/css";
import "swiper/css/free-mode";

interface MainPageProps {
  onLoginRequired?: () => void;
}

export default function MainPage({ onLoginRequired }: MainPageProps) {
  const [heroFilm, setHeroFilm] = useState<Film | null>(null);
  const [topFilms, setTopFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [randomMovie, top10] = await Promise.all([getRandomMovie(), getTop10()]);

        setImageKey(Date.now());
        setHeroFilm(randomMovie);
        setTopFilms(top10);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Состояние загрузки
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
  if (error) {
    return (
      <section className="hero container">
        <div className="hero__wrapper">
          <p style={{ color: "red" }}>Ошибка: {error}</p>
          <button onClick={() => window.location.reload()}>Попробовать снова</button>
        </div>
      </section>
    );
  }

  // Если нет фильмов
  if (!heroFilm || topFilms.length === 0) {
    return (
      <section className="hero container">
        <div className="hero__wrapper">
          <p>Нет фильмов для отображения</p>
        </div>
      </section>
    );
  }

  // Обновление случайного фильма
  const handleUpdateHero = async () => {
    if (isUpdating) return; // Защита от двойного клика

    try {
      setIsUpdating(true);
      const newRandomMovie = await getRandomMovie();
      setHeroFilm(newRandomMovie);
    } catch (error) {
      console.error("Ошибка обновления случайного фильма:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <h1 className="visually-hidden">Кинотека VK Маруся</h1>
      <section className="hero container">
        <div className="hero__wrapper">
          <div className="hero__left-block">
            <div className="hero__attributes">
              {heroFilm.tmdbRating != null && (
                <span className={`hero__rating hero__rating--${getRatingColor(heroFilm.tmdbRating)}`}>
                  <svg className="hero__star-icon" width="16" height="16" viewBox="0 0 16 16">
                    <use href="img/sprite.svg#star"></use>
                  </svg>
                  {heroFilm.tmdbRating.toFixed(1)}
                </span>
              )}
              {heroFilm.releaseYear != null && <span className="hero__date">{heroFilm?.releaseYear}</span>}
              {heroFilm.genres?.length > 0 && <span className="hero__genre">{heroFilm.genres.join(", ")}</span>}
              {heroFilm.runtime != null && <span className="hero__duration">{formatRuntime(heroFilm.runtime)}</span>}
            </div>
            <h2 className="hero__title">{heroFilm?.title}</h2>
            <div className="hero__description">{heroFilm?.plot}</div>
            <div className="hero__buttons-block">
              <button className="hero__trailer-btn btn btn--primary" onClick={() => setIsVideoOpen(true)}>
                Трейлер
              </button>
              <Link to={`/film/${heroFilm?.id}`} className="hero__about-btn btn btn--secondary">
                О&nbsp;фильме
              </Link>
              <FavoriteButton
                filmId={heroFilm.id}
                className="hero__favorite-btn btn btn--secondary"
                onLoginRequired={onLoginRequired}
              />
              <button className="hero__update-btn btn btn--secondary" onClick={handleUpdateHero} disabled={isUpdating}>
                <svg className="hero__update-icon" width="20" height="20" viewBox="0 0 20 20">
                  <use href="img/sprite.svg#update"></use>
                </svg>
              </button>
            </div>
          </div>
          <div className="hero__right-block">
            <img
              key={imageKey}
              src={heroFilm?.backdropUrl || "/img/cover-plug.jpg"}
              alt={heroFilm?.title}
              className="hero__picture"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <section className="best-films container">
        <h2 className="best-films__title">Топ 10 фильмов</h2>

        {/* Блок для широких экранов */}
        <ul className="best-films__list cards">
          {topFilms.map((film, index) => (
            <li className="cards__item" key={film.id}>
              <FilmCard film={film} showRank={true} rank={index + 1} />
            </li>
          ))}
        </ul>

        {/* Блок для мобильных экранов со свайпером */}
        <SwiperWrapper>
          {topFilms.map((film, index) => (
            <div className="swiper-slide cards__item" key={film.id}>
              <FilmCard film={film} showRank={true} rank={index + 1} />
            </div>
          ))}
        </SwiperWrapper>
      </section>
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={heroFilm?.trailerUrl ? getEmbedUrl(heroFilm.trailerUrl) : ""}
        title={heroFilm?.title || ""}
      />
    </>
  );
}
