import { useState, useRef, useEffect, useCallback } from "react";

interface UseSearchProps {
  onSearch: (query: string) => void;
}

export const useSearch = ({ onSearch }: UseSearchProps) => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const searchToggleBtnRef = useRef<HTMLButtonElement>(null);
  const searchClearBtnRef = useRef<HTMLButtonElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  // ========== ФУНКЦИИ ==========
  const isMobile = () => window.innerWidth <= 767;

  // позиционирование модального окна
  const positionSearchModal = useCallback(() => {
    if (!searchInputRef.current || !searchModalRef.current || !isSearchOpen) return;

    const rect = searchInputRef.current.getBoundingClientRect();
    const modal = searchModalRef.current;
    const isMobileView = isMobile();
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const rightPosition = window.innerWidth - rect.right - scrollbarWidth;

    if (isMobileView) {
      modal.style.position = "";
      modal.style.top = "";
      modal.style.right = "";
      modal.style.left = "";
      modal.style.width = "";
      modal.style.opacity = "1";
      modal.style.visibility = "visible";
    } else {
      modal.style.position = "fixed";
      modal.style.top = `${rect.bottom + 12}px`;
      modal.style.right = `${rightPosition}px`;
      modal.style.left = "auto";
      modal.style.opacity = "1";
      modal.style.visibility = "visible";
    }
  }, [isSearchOpen]);

  // управление оверлеем
  const updateOverlayVisibility = useCallback(() => {
    if (!searchOverlayRef.current) return;
    const isMobileView = isMobile();
    const shouldShowOverlay = isMobileView && (isMobileSearchActive || searchInputValue.trim().length > 0);

    // показываем только если активен мобильный режим
    if (shouldShowOverlay) {
      searchOverlayRef.current.classList.add("is-active");
      document.body.style.overflow = "hidden";
    } else {
      searchOverlayRef.current.classList.remove("is-active");
      document.body.style.overflow = "";
    }
  }, [isMobileSearchActive, searchInputValue]);

  //открытие модального окна
  const openSearchModal = useCallback(() => {
    if (isSearchOpen) return;
    setIsSearchOpen(true);
    updateOverlayVisibility();
    if (isMobile() && searchModalRef.current) {
      searchModalRef.current.style.opacity = "0";
      searchModalRef.current.style.visibility = "hidden";
    }
    requestAnimationFrame(() => {
      positionSearchModal();
    });
  }, [isSearchOpen, updateOverlayVisibility]);

  //закрытие модального окна
  const closeSearchModal = useCallback(() => {
    if (!isSearchOpen) return;
    setIsSearchOpen(false);
    document.body.style.overflow = "";
    updateOverlayVisibility();
    if (isMobile() && searchToggleBtnRef.current) {
      searchToggleBtnRef.current.style.display = "flex";
    }
    if (searchClearBtnRef.current) {
      searchClearBtnRef.current.hidden = searchInputValue.trim().length === 0;
    }
  }, [isSearchOpen, updateOverlayVisibility, searchInputValue]);

  const clearAll = useCallback(() => {
    setSearchInputValue("");
    onSearch("");
    setIsSearchOpen(false);
    document.body.style.overflow = "";

    if (searchClearBtnRef.current) {
      searchClearBtnRef.current.hidden = true;
    }
    searchOverlayRef.current?.classList.remove("is-active");
    searchInputRef.current?.classList.remove("is-active");

    if (isMobileSearchActive) {
      setIsMobileSearchActive(false);
      if (searchToggleBtnRef.current) {
        searchToggleBtnRef.current.style.display = "flex";
      }
    }
  }, [onSearch, isMobileSearchActive]);

  // клик по оверлею
  const handleOverlayClick = useCallback(() => {
    if (isMobile()) {
      clearAll();
    } else {
      closeSearchModal(); // На десктопе - только закрываем модалку, текст сохраняем
    }
  }, [clearAll, closeSearchModal, isMobile]);

  const resetMobileMode = useCallback(() => {
    setIsMobileSearchActive(false);
    document.body.style.overflow = "";
    searchOverlayRef.current?.classList.remove("is-active");
    searchInputRef.current?.classList.remove("is-active");
    if (searchToggleBtnRef.current) {
      searchToggleBtnRef.current.style.display = "none";
    }
    if (searchClearBtnRef.current) {
      searchClearBtnRef.current.hidden = searchInputValue.trim().length === 0;
    }
    if (isSearchOpen) {
      setTimeout(() => {
        positionSearchModal();
      }, 50);
    }
  }, [isSearchOpen, searchInputValue, positionSearchModal]);

  // Фокус на поле ввода
  const handleSearchFocus = useCallback(() => {
    const hasValue = searchInputValue.trim().length > 0;
    if (hasValue) {
      openSearchModal();
      onSearch(searchInputValue);
    }
  }, [searchInputValue, openSearchModal, onSearch]);

  // Ввод текста
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInputValue(value);
      onSearch(value);
      if (searchClearBtnRef.current) {
        searchClearBtnRef.current.hidden = !value.length;
      }
      updateOverlayVisibility();
      if (value.trim().length > 0) {
        openSearchModal();
      } else {
        closeSearchModal();
      }
    },
    [onSearch, openSearchModal, closeSearchModal, updateOverlayVisibility],
  );

  // Клик по кнопке поиска (мобилка)
  const activateMobileSearch = useCallback(() => {
    setIsMobileSearchActive(true);
    searchOverlayRef.current?.classList.add("is-active");
    if (searchToggleBtnRef.current) {
      searchToggleBtnRef.current.style.display = "none";
    }
    searchInputRef.current?.classList.add("is-active");
    setTimeout(() => searchInputRef.current?.focus(), 0); // Фокусируемся на поле после открытия
  }, []);

  const handleMobileSearchToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isMobileSearchActive) return;
      activateMobileSearch();
      if (searchInputValue.trim().length > 0) {
        openSearchModal(); // Если в поле уже есть текст - показываем модалку
        onSearch(searchInputValue);
      }
    },
    [isMobileSearchActive, searchInputValue, openSearchModal, onSearch],
  );

  // Очистка по крестику
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      clearAll();
      if (isMobile()) {
        setIsMobileSearchActive(false);
        searchOverlayRef.current?.classList.remove("is-active");
        if (searchToggleBtnRef.current) {
          searchToggleBtnRef.current.style.display = "flex";
        }
      }
    },
    [clearAll, isMobile],
  );

  // Позиционируем при открытии
  useEffect(() => {
    if (isSearchOpen) {
      const timeoutId = setTimeout(() => {
        positionSearchModal();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isSearchOpen, positionSearchModal]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleUpdate = () => positionSearchModal();
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, { passive: true, capture: true });
    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate);
    };
  }, [isSearchOpen, positionSearchModal]);

  // Сброс мобильного режима при ресайзе
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = isMobile();
      if (isMobileView && searchInputValue.trim().length > 0 && !isMobileSearchActive) {
        setIsMobileSearchActive(true);
        searchOverlayRef.current?.classList.add("is-active");
        if (searchToggleBtnRef.current) {
          searchToggleBtnRef.current.style.display = "none";
        }
        searchInputRef.current?.classList.add("is-active");
        document.body.style.overflow = "hidden";
      }
      if (!isMobileView && isMobileSearchActive) {
        resetMobileMode();
      }
      if (searchToggleBtnRef.current) {
        searchToggleBtnRef.current.style.display = isMobileView ? "flex" : "none";
      }
      if (isSearchOpen) {
        positionSearchModal();
        if (searchClearBtnRef.current) {
          searchClearBtnRef.current.hidden = searchInputValue.trim().length === 0;
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSearchActive, resetMobileMode, isSearchOpen, positionSearchModal, searchInputValue]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        if (isSearchOpen) {
          if (isMobile()) {
            clearAll(); // На мобилке - полная очистка
          } else {
            closeSearchModal(); // На десктопе - только закрываем модалку
          }
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen, closeSearchModal, clearAll, isMobile]);

  // Закрытие при клике ВНЕ для десктопа (на мобилке обрабатываем через оверлей)
  useEffect(() => {
    if (!isSearchOpen || isMobile()) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isClickOnModal = searchModalRef.current?.contains(target);
      const isClickOnInput = searchInputRef.current?.contains(target);
      const isClickOnClearBtn = searchClearBtnRef.current?.contains(target);
      const isClickOnToggleBtn = searchToggleBtnRef.current?.contains(target);
      const isClickOnOverlay = searchOverlayRef.current?.contains(target);
      if (isClickOnOverlay) return;
      if (!isClickOnModal && !isClickOnInput && !isClickOnClearBtn && !isClickOnToggleBtn) {
        closeSearchModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen, closeSearchModal]);

  // Инициализация
  useEffect(() => {
    if (searchClearBtnRef.current) {
      searchClearBtnRef.current.hidden = true;
    }
    searchOverlayRef.current?.classList.remove("is-active");
  }, []);

  return {
    // Состояния
    searchInputValue,
    isSearchOpen,
    isMobileSearchActive,

    // Refs
    searchInputRef,
    searchModalRef,
    searchFormRef,
    searchToggleBtnRef,
    searchClearBtnRef,
    searchOverlayRef,

    // Методы
    openSearchModal,
    closeSearchModal,
    clearAll,
    handleSearchFocus,
    handleInputChange,
    handleMobileSearchToggle,
    handleClear,
    handleOverlayClick,
    positionSearchModal,
    resetMobileMode,
  };
};
