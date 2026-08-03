import { useEffect, useRef, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import type { Film } from "../../types/film";
import type { User } from "../../types/user";
import SearchModal from "../Modals/SearchModal";

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onSearch: (query: string) => void;
  searchResults: Film[];
  searchQuery: string;
  isSearchLoading: boolean;
}

export default memo(function Header({
  user,
  onLoginClick,
  onSearch,
  searchResults,
  searchQuery,
  isSearchLoading,
}: HeaderProps) {
  const location = useLocation();
  const prevPathnameRef = useRef(location.pathname);

  const {
    searchInputValue,
    isSearchOpen,
    isMobileSearchActive,
    searchInputRef,
    searchModalRef,
    searchFormRef,
    searchToggleBtnRef,
    searchClearBtnRef,
    searchOverlayRef,
    handleSearchFocus,
    handleInputChange,
    handleMobileSearchToggle,
    handleClear,
    handleOverlayClick,
    closeSearchModal,
    clearAll,
    resetMobileMode,
  } = useSearch({ onSearch });

  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      resetMobileMode();

      if (searchInputValue || isSearchOpen) {
        clearAll();
      }
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname, clearAll, searchInputValue, isSearchOpen]);

  return (
    <header className="header">
      <div className="container header__wrapper">
        <Link className="header__logo-link" to="/">
          <img className="header__logo-img" src="/img/logo.png" alt="логотип ВК Маруся" />
          <svg className="header__logo-title" width="100" height="21" viewBox="0 0 100 21">
            <use href="/img/sprite.svg#logo-title"></use>
          </svg>
        </Link>

        <nav className="header__nav" aria-label="Основное меню">
          <ul className="header__nav-list">
            <li className={`header__nav-item ${location.pathname === "/" ? "header__nav-item--active" : ""}`}>
              <Link className="header__nav-link" to="/">
                Главная
              </Link>
            </li>
            <li className={`header__nav-item ${location.pathname === "/genres" ? "header__nav-item--active" : ""}`}>
              <Link className="header__nav-link" to="/genres">
                <svg className="header__genres-icon" width="24" height="24" viewBox="0 0 24 24">
                  <use href="/img/sprite.svg#genres"></use>
                </svg>
                <span className="header__nav-title">Жанры</span>
              </Link>
            </li>
          </ul>
        </nav>

        <form ref={searchFormRef} className="header__search-form" onSubmit={(e) => e.preventDefault()} id="search-form">
          <input
            ref={searchInputRef}
            className={`header__search-input ${isMobileSearchActive ? "is-active" : ""}`}
            id="search-input"
            aria-label="поиск по каталогу"
            type="text"
            name="search"
            autoComplete="off"
            placeholder="Поиск"
            minLength={3}
            maxLength={80}
            pattern="[А-Яа-яЁёA-Za-z0-9\s]+"
            title="Допустимы только кириллица, латиница, цифры и пробелы"
            value={searchInputValue}
            onChange={handleInputChange}
            onFocus={handleSearchFocus}
          />
          <svg className="header__search-icon" width="24" height="24" viewBox="0 0 24 24">
            <use href="/img/sprite.svg#search"></use>
          </svg>

          <button
            ref={searchToggleBtnRef}
            className="header__search-btn"
            id="mobile-search-toggle"
            type="button"
            aria-label="Поиск"
            onClick={handleMobileSearchToggle}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <use href="/img/sprite.svg#search"></use>
            </svg>
          </button>

          <button
            ref={searchClearBtnRef}
            className="header__search-close-btn"
            id="search-clear-btn"
            type="button"
            aria-label="Очистить"
            onClick={handleClear}
            hidden
          >
            <svg className="header__close-icon" width="13" height="13" viewBox="0 0 13 13">
              <use href="/img/sprite.svg#close"></use>
            </svg>
          </button>
        </form>
        <div ref={searchOverlayRef} className="header__search-overlay" id="search-overlay" onClick={handleOverlayClick}></div>

        {user ? (
          <Link
            to="/account"
            className={`header__user ${location.pathname === "/account" ? "header__user--active" : ""}`}
          >
            <svg className="header__user-icon" width="24" height="24" viewBox="0 0 24 24">
              <use href="/img/sprite.svg#user"></use>
            </svg>
            <span className="header__user-title">{user.name || user.email}</span>
          </Link>
        ) : (
          <button className="header__user" id="show-login-modal" type="button" onClick={onLoginClick}>
            <svg className="header__user-icon" width="24" height="24" viewBox="0 0 24 24">
              <use href="/img/sprite.svg#user"></use>
            </svg>
            <span className="header__user-title">Войти</span>
          </button>
        )}

        <SearchModal
          ref={searchModalRef}
          isOpen={isSearchOpen}
          onClose={closeSearchModal}
          results={searchResults}
          query={searchQuery}
          loading={isSearchLoading}
        />
      </div>
    </header>
  );
});
