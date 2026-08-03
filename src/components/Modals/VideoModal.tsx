import { useEffect, useRef, useState, useCallback } from "react";
import { getEmbedUrl } from "../../utils/video";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl = "", title = "" }: VideoModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");

  // ========== УПРАВЛЕНИЯ ПЛЕЕРОМ ==========

  // Отправка команд в iframe
  const sendCommandToPlayer = useCallback((command: string, args: any[] = []) => {
    if (!iframeRef.current?.contentWindow) return; //iframe не готов
    const message = JSON.stringify({
      event: "command",
      func: command,
      args: args,
    });
    iframeRef.current.contentWindow.postMessage(message, "https://www.youtube.com");
  }, []);

  //Переключение паузы/воспроизведения
  const togglePlayPause = useCallback(() => {
    if (!iframeRef.current || !currentUrl) return; //Нет iframe или URL
    if (!isIframeReady) {
      setTimeout(() => {
        if (isIframeReady) togglePlayPause(); // Iframe повторная попытка
      }, 500);
      return;
    }

    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    if (newPausedState) {
      sendCommandToPlayer("pauseVideo");
      if (titleRef.current) {
        titleRef.current.classList.add("is-visible"); //  название при паузе
      }
    } else {
      sendCommandToPlayer("playVideo");
      if (titleRef.current) {
        titleRef.current.classList.remove("is-visible"); // скрыть название при воспроизведении
      }
    }
  }, [isPaused, isIframeReady, currentUrl, sendCommandToPlayer]);

  // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

  // Закрытие по Escape
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose],
  );

  // Пробел для паузы/воспроизведения
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Игнорируем, если ввод в поле ввода
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === " " || e.key === "Spacebar" || e.code === "Space") {
        e.preventDefault(); // Предотвращаем скролл страницы
        togglePlayPause();
      }
    },
    [togglePlayPause],
  );

  // Клик по видео → пауза/воспроизведение
  const handleWrapperClick = useCallback(
    (e: React.MouseEvent) => {
      // Игнорируем клик по кнопке закрытия
      if ((e.target as HTMLElement).closest(".video-modal__close-btn")) return;
      togglePlayPause();
    },
    [togglePlayPause],
  );

  // Закрытие по оверлею
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  // ========== ЭФФЕКТЫ ==========

  // Открытие модалки
  useEffect(() => {
    if (!isOpen) return;
    let embedUrl = getEmbedUrl(videoUrl);
    if (embedUrl && !embedUrl.includes("enablejsapi=1")) {
      const separator = embedUrl.includes("?") ? "&" : "?";
      embedUrl = `${embedUrl}${separator}autoplay=1&controls=0&rel=0&modestbranding=1&enablejsapi=1&cc_load_policy=0`;
    }
    if (!embedUrl) return; //Не удалось создать embed-ссылку
    setCurrentUrl(embedUrl);
    setCurrentTitle(title || "");
    setIsIframeReady(false);
    setIsPaused(false);
    titleRef.current?.classList.remove("is-visible");
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl;
    }
    document.body.style.overflow = "hidden"; // Блокируем скролл

    const timer = setTimeout(() => {
      setIsIframeReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOpen, videoUrl, title, getEmbedUrl]);

  // Закрытие модалки
  useEffect(() => {
    if (isOpen) return;
    if (iframeRef.current) {
      iframeRef.current.src = "";
    }
    document.body.style.overflow = "";
    setIsPaused(false);
    setCurrentUrl("");
    setIsIframeReady(false);
    titleRef.current?.classList.remove("is-visible");
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  // Пробел для паузы/воспроизведения
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // ответы от плеера
  useEffect(() => {
    const handlePlayerMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = JSON.parse(event.data);
        // Обработка изменения состояния плеера: 2 = пауза; 1 = воспроизведение
        if (data.event === "onStateChange") {
          if (data.info === 2) {
            if (titleRef.current && isPaused) {
              titleRef.current.classList.add("is-visible");
            }
          } else if (data.info === 1) {
            if (titleRef.current && !isPaused) {
              titleRef.current.classList.remove("is-visible");
            }
          }
        }
      } catch (e) {} // Игнорируем ошибки парсинга
    };
    window.addEventListener("message", handlePlayerMessage);
    return () => window.removeEventListener("message", handlePlayerMessage);
  }, [isPaused]);

  if (!isOpen) return null;

  return (
    <div className="video-modal" id="video-modal">
      <div className="video-modal__overlay" onClick={handleOverlayClick}></div>
      <div className="video-modal__container">
        <button className="video-modal__close-btn" type="button" aria-label="Закрыть" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 13 13">
            <use href="/img/sprite.svg#close"></use>
          </svg>
        </button>
        <div className="video-modal__wrapper" ref={wrapperRef} onClick={handleWrapperClick}>
          <iframe
            ref={iframeRef}
            id="video-iframe"
            className="video-modal__player"
            allow="autoplay; encrypted-media; fullscreen"
            title={currentTitle || "Трейлер"}
          ></iframe>
          <div className="video-modal__title" id="video-title" ref={titleRef}>
            {currentTitle}
          </div>
        </div>
      </div>
    </div>
  );
}
