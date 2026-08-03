import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Swiper from "swiper";
import { FreeMode } from "swiper/modules";

interface SwiperWrapperProps {
  children: ReactNode;
  spaceBetween?: number;
  slidesPerView?: "auto" | number;
  loop?: boolean;
  freeMode?: boolean;
  grabCursor?: boolean;
}

export default function SwiperWrapper({
  children,
  spaceBetween = 40,
  slidesPerView = "auto",
  loop = true,
  freeMode = true,
  grabCursor = true,
}: SwiperWrapperProps) {
  const swiperRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<Swiper | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 767;
      setIsMobile(newIsMobile);
    };

    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 300);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
  
    // Уничтожаем старый экземпляр
    if (swiperInstanceRef.current) {
      swiperInstanceRef.current.destroy(true, true);
      swiperInstanceRef.current = null;
    }
    // Создаём новый только если мобильная версия 
    if (isMobile && swiperRef.current) {
      swiperInstanceRef.current = new Swiper(swiperRef.current, {
        modules: [FreeMode],
        direction: "horizontal",
        loop,
        slidesPerView,
        spaceBetween,
        freeMode,
        grabCursor,
        mousewheel: {
          enabled: true,
          releaseOnEdges: true,
          thresholdDelta: 50,
          thresholdTime: 300,
        },
        watchSlidesProgress: true,
      });
    }
    // Очистка при размонтировании
    return () => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    };
  }, [isMobile, loop, slidesPerView, spaceBetween, freeMode, grabCursor]);

  if (!isMobile) return null;

  return (
    <div key={isMobile ? "mobile" : "desktop"} className="swiper best-films__swiper" ref={swiperRef}>
      <ul className="cards cards--swiper swiper-wrapper">{children}</ul>
    </div>
  );
}
