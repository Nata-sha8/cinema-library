import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';
import { getEmbedUrl } from './utils/video';
import "./styles/main.scss";

// Компоненты
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LoginModal from "./components/Modals/LoginModal";
import RegisterModal from "./components/Modals/RegisterModal";
import SuccessModal from "./components/Modals/SuccessModal";
import VideoModal from "./components/Modals/VideoModal";

// Страницы
import MainPage from "./pages/MainPage";
import GenresPage from "./pages/GenresPage";
import GenreFilmsPage from "./pages/GenreFilmsPage";
import AccountPage from "./pages/AccountPage";
import FilmPage from "./pages/FilmPage";

// API
import { searchMoviesByTitle } from "./api/index";
import type { Film } from "./types/film";

function App() {
  // Состояния для модалок
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Состояния для поиска
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

   const { user } = useAuth(); 

   const handleLoginRequired = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  // 🔥 2. Поиск на клиенте (фильтруем загруженные фильмы)
  useEffect(() => {
    const performSearch = async () => {
      // Если запрос пустой или короче 3 символов
      if (!searchQuery.trim() || searchQuery.length < 3) {
        setSearchResults([]);
        setIsSearchLoading(false);
        return;
      }
      setIsSearchLoading(true);

      try {
        const results = await searchMoviesByTitle(searchQuery);
        setSearchResults(results.slice(0, 5)); // Ограничиваем 5 результатами
      } catch (error) {
        console.error("Ошибка поиска:", error);
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    };

    const timer = setTimeout(performSearch, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // обновлениt поискового запроса
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleLoginClick = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  return (
    <BrowserRouter>
      <Header
        user={user}
        onLoginClick={handleLoginClick}
        onSearch={handleSearch}
        searchResults={searchResults}
        searchQuery={searchQuery}
        isSearchLoading={isSearchLoading}
      />

      <main className="main">
        <Routes>
          <Route path="/" element={<MainPage onLoginRequired={handleLoginRequired} />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/genres/:genreId" element={<GenreFilmsPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/film/:id" element={<FilmPage onLoginRequired={handleLoginRequired} />} />
        </Routes>
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
        onSuccess={() => setIsSuccessOpen(true)}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        onLogin={() => {
          setIsSuccessOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={getEmbedUrl('https://www.youtube.com/watch?v=...')}
        title="Название трейлера"
      />

    </BrowserRouter>
  );
}

export default App;
