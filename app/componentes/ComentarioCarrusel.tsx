"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Slide = { src: string; alt: string; caption?: string; link?: string };

const SLIDES: Slide[] = [
  { src: "/img/1comentario.png", alt: "Comentario 1", caption: "Comentario 1" },
  { src: "/img/2comentario.png", alt: "Comentario 2", caption: "Comentario 2" },
  { src: "/img/3comentario.png", alt: "Comentario 3", caption: "Comentario 3" },
];

export default function ComentarioCarrusel() {
  const [idx, setIdx] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const startX = useRef<number | null>(null);
  const paused = useRef(false);

  const go = (n: number) =>
    setIdx((p) => (p + n + SLIDES.length) % SLIDES.length);
  const goTo = (n: number) => setIdx((n + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => go(1), 5000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [idx]);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1);
    startX.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  return (
    <section
      className="comentarios"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => { paused.current = true; if (timer.current) clearTimeout(timer.current); }}
      onMouseLeave={() => { paused.current = false; setIdx((x) => x); }}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-roledescription="carrusel"
      aria-label="Comentarios de usuarios"
    >
      {/* Slides */}
      <div
        className="comentarios__track"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <figure key={i} className="comentarios__slide" aria-hidden={i !== idx}>
            <div className="comentarios__media">
              <Image
                src={s.src}
                alt={s.alt}
                width={1302}
                height={459}
                className="comentarios__img"
                priority={i === idx}
                style={{ width: "100%", height: "auto" }}
                sizes="(max-width: 900px) 100vw, 900px"
              />
            </div>
          </figure>
        ))}
      </div>

      {/* Controles */}
      <div className="comentarios__controls">
        <button
          className="comentarios__btn comentarios__btn--prev"
          aria-label="Comentario anterior"
          onClick={() => go(-1)}
        >‹</button>
        <button
          className="comentarios__btn comentarios__btn--next"
          aria-label="Siguiente comentario"
          onClick={() => go(1)}
        >›</button>
      </div>

    </section>
  );
}