"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="bg-brand-dark focus-visible:outline-brand fixed right-6 bottom-6 z-50 flex size-12 items-center justify-center rounded-full border border-white/20 text-xl text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 sm:right-8 sm:bottom-8"
      aria-label="ページ上部へ戻る"
      title="ページ上部へ戻る"
    >
      ↑
    </button>
  );
}
