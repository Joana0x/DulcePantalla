"use client"; //Se usa en el navegador
import { useEffect, useRef, useState } from "react";
/*useState para saber que imagen estamos viendo
useEffect cambiar de imagen 
useRef guardar cosas */
import Image from "next/image"; //Image para ver las imagenes

type Slide = { src: string; alt: string; caption?: string; link?: string };
/*src: imagen 
alt: texto alternativo
caption?: (opcionalmente)
link?: (opcionalmente) */

const SLIDES: Slide[] = [ //array de las imagenes y textos
  { src: "/img/1comentario.png", alt: "Comentario 1", caption: "Comentario 1" },
  { src: "/img/2comentario.png", alt: "Comentario 2", caption: "Comentario 2" },
  { src: "/img/3comentario.png", alt: "Comentario 3", caption: "Comentario 3" },
];


export default function ComentarioCarrusel() { //Para usar en otras partes
  const [idx, setIdx] = useState(0); //indice actual
  const timer = useRef<NodeJS.Timeout | null>(null); //temporizador de cambio automático
  const startX = useRef<number | null>(null); //posición inicial del toque
  const paused = useRef(false); //pausa cuando pasamos el mouse

  const go = (n: number) => //cambia al siguiente o anterior
    setIdx((p) => (p + n + SLIDES.length) % SLIDES.length);
  const goTo = (n: number) => setIdx((n + SLIDES.length) % SLIDES.length); //va directamente a una imagen

  useEffect(() => { //auto cambio cada 5 segundos
    if (paused.current) return; //si esta en pausa no hace nada
    if (timer.current) clearTimeout(timer.current); //limpia el temporizador anterior
    timer.current = setTimeout(() => go(1), 5000); //cambia a la siguiente imagen
    return () => { if (timer.current) clearTimeout(timer.current); }; //limpia el temporizador al actualizar
  }, [idx]); //se ejecuta cada vez que cambia idx

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; }; //guarda la posición inicial del toque
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1);
    startX.current = null;
  }; //calcula el cambio de posición y navega si es mayor a 40px

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  }; //se puede mover con flechas

  return (
    <section //contenedor principal
      className="comentarios"
      onTouchStart={onTouchStart} //detecta el inicio del toque
      onTouchEnd={onTouchEnd} //detecta el fin del toque
      onMouseEnter={() => { paused.current = true; if (timer.current) clearTimeout(timer.current); }} //pausa al pasar el mouse
      onMouseLeave={() => { paused.current = false; setIdx((x) => x); }} //reanuda al quitar el mouse
      onKeyDown={onKeyDown} //control con teclado
      tabIndex={0}
      aria-roledescription="carrusel"
      aria-label="Comentarios de usuarios"
    >
      {/* Slides */}
      <div
        className="comentarios__track"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {SLIDES.map((s, i) => ( //va a cada imagen y muestra
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
                sizes="(max-width: 900px) 100vw, 900px" //responsive
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
          onClick={() => go(-1)} //va a la imagen anterior
        >‹</button>
        <button
          className="comentarios__btn comentarios__btn--next"
          aria-label="Siguiente comentario"
          onClick={() => go(1)} //va a la siguiente imagen
        >›</button>
      </div>

    </section>
  );
}