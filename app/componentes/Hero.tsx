"use client";
import { useEffect, useRef, useState } from "react"; //importamos para que sea dinamico
// useEffect temporizador o escucha eventos
// useRef para guardar el temporizador y posicion tactil
// useState guarda valores que cambian con el tiempo
import Image from "next/image";

type Slide = { src: string; alt: string; caption?: string; link?: string };
const SLIDES: Slide[] = [
  { src: "/cartas.jpg",     alt: "Pastel feliz cumpleaños Harry", caption: "Feliz cumpleaños, Harry" },
  { src: "/cer.jpg",  alt: "Cerveza de mantequilla",        caption: "Cerveza de mantequilla" },
  { src: "/receta.jpg", alt: "Galleta de jengibre",           caption: "Galleta de jengibre" },
  //src ruta de la imagen
  //alt Texto alternativo
  //caption Texto del pie de foto
];

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const startX = useRef<number | null>(null);

  const go = (n: number) => setIdx(p => (p + n + SLIDES.length) % SLIDES.length);
  const goTo = (n: number) => setIdx((n + SLIDES.length) % SLIDES.length);

  // autoplay
  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => go(1), 5000);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [idx]);

  // swipe móvil
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1);
    startX.current = null;
  };

  return (
  <section className="carousel">
    <div
      className="carousel__track"
      style={{ transform: `translateX(-${idx * 100}%)` }}
    >
      {SLIDES.map((s, i) => (
        <figure key={i} className="carousel__slide">
          <div className="carousel__media">
            <Image
              src={s.src}
              alt={s.alt}
              fill
              className="carousel__img"
              priority={i === idx}
            />
          </div>
        </figure>
      ))}
    </div>
  </section>
);
}