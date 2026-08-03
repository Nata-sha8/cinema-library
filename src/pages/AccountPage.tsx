import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FilmCard from "../components/FilmCard/FilmCard";
import SwiperWrapper from "../components/SwiperWrapper/SwiperWrapper";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../hooks/useFavorites";
import "swiper/css";
import "swiper/css/free-mode";

type TabType = "favorites" | "settings";

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("favorites");

  // Используем хук для избранного
  const { favorites, isLoading: favoritesLoading, error, loadFavorites, removeFromFavorites } = useFavorites();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Если пользователь не авторизован — редирект на главную
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  // Состояние загрузки
  if (isLoading) {
    return (
      <section className="account container">
        <h2 className="account__title">Мой аккаунт</h2>
        <p>Проверка авторизации...</p>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  if (favoritesLoading) {
    return (
      <section className="account container">
        <h2 className="account__title">Мой аккаунт</h2>
        <p>Загрузка избранных фильмов...</p>
      </section>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <section className="account container">
        <h2 className="account__title">Мой аккаунт</h2>
        <p style={{ color: "red" }}>Ошибка: {error}</p>
        <button onClick={loadFavorites}>Попробовать снова</button>
      </section>
    );
  }

  return (
    <>
      <h1 className="visually-hidden">Аккаунт пользователя</h1>
      <section className="account container">
        <h2 className="account__title">Мой аккаунт</h2>
        <nav className="account__nav">
          <ul className="account__nav-list">
            <li className="account__nav-item">
              <button
                className={`account__nav-btn ${activeTab === "favorites" ? "account__nav-btn--active" : ""}`}
                onClick={() => setActiveTab("favorites")}
                data-tab="favorites"
              >
                <svg className="account__icon account__icon--like" width="24" height="24" viewBox="0 0 24 24">
                  <use href="/img/sprite.svg#like"></use>
                </svg>
                <span className="account__nav-title account__nav-title--full">Избранные фильмы</span>
                <span className="account__nav-title account__nav-title--short">Избранное</span>
              </button>
            </li>
            <li className="account__nav-item">
              <button
                className={`account__nav-btn ${activeTab === "settings" ? "account__nav-btn--active" : ""}`}
                onClick={() => setActiveTab("settings")}
                data-tab="settings"
              >
                <svg className="account__icon" width="24" height="24" viewBox="0 0 24 24">
                  <use href="/img/sprite.svg#user"></use>
                </svg>
                <span className="account__nav-title account__nav-title--full">Настройка аккаунта</span>
                <span className="account__nav-title account__nav-title--short">Настройки</span>
              </button>
            </li>
          </ul>
        </nav>

        {activeTab === "favorites" && (
          <div className="account-tab favorites" id="favorites-tab">
            {favorites.length === 0 ? (
              <p className="account__empty">У вас пока нет избранных фильмов</p>
            ) : (
              <>
                {/* Десктопная сетка */}
                <ul className="cards">
                  {favorites.map((film) => (
                    <li className="cards__item" key={film.id}>
                      <FilmCard film={film} showRemoveButton={true} onRemove={removeFromFavorites} />
                    </li>
                  ))}
                </ul>

                {/* Мобильный свайпер */}
                <SwiperWrapper>
                  {favorites.map((film) => (
                    <div className="swiper-slide cards__item" key={film.id}>
                      <FilmCard film={film} showRemoveButton={true} onRemove={removeFromFavorites} />
                    </div>
                  ))}
                </SwiperWrapper>
              </>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="account-tab settings" id="settings-tab">
            <ul className="settings__list">
              <li className="settings__item">
                <div className="settings__badge">
                  {user?.name && user?.surname
                    ? `${user.name.charAt(0).toUpperCase()}${user.surname.charAt(0).toUpperCase()}`
                    : "U"}
                </div>
                <div className="settings__info-block">
                  <dt className="settings__term">Имя Фамилия</dt>
                  <dd className="settings__details">
                    {user?.name} {user?.surname}
                  </dd>
                </div>
              </li>
              <li className="settings__item">
                <div className="settings__badge">
                  <svg className="settings__icon" width="24" height="24" viewBox="0 0 24 24">
                    <use href="/img/sprite.svg#mail"></use>
                  </svg>
                </div>
                <div className="settings__info-block">
                  <dt className="settings__term">Электронная почта</dt>
                  <dd className="settings__details">{user?.email}</dd>
                </div>
              </li>
            </ul>
            <Link to="/" className="settings__btn btn btn--primary" onClick={handleLogout}>
              Выйти из аккаунта
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
