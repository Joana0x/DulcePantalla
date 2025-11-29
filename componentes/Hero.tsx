"use client";
import { useEffect, useRef, useState } from "react"; //importamos para que sea dinamico
// useEffect temporizador o escucha eventos
// useRef para guardar el temporizador y posicion tactil
// useState guarda valores que cambian con el tiempo
import Image from "next/image";


type Slide = { src: string; alt: string; caption?: string; link?: string }; //difine la forma de cada slide

const SLIDES: Slide[] = [ //array de las imagenes y textos
  { src: "/cartas.jpg",     alt: "Pastel feliz cumpleaños Harry", caption: "Feliz cumpleaños, Harry" },
  { src: "/cer.jpg",  alt: "Cerveza de mantequilla",        caption: "Cerveza de mantequilla" },
  { src: "/receta.jpg", alt: "Galleta de jengibre",           caption: "Galleta de jengibre" },
  //src ruta de la imagen
  //alt Texto alternativo
  //caption Texto del pie de foto
];

export default function Hero() { //forma de usar en otros lados 
  const [idx, setIdx] = useState(0); //indice actual y setIdx para cambiarlo
  const timer = useRef<NodeJS.Timeout | null>(null);

  const go = (n: number) => setIdx(p => (p + n + SLIDES.length) % SLIDES.length); //cambia al siguiente

  // autoplay
  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => go(1), 4000); //cambia cada 4 segundos
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [idx]);

  return (
  <section className="carousel">
    <div
      className="carousel__track"
      style={{ transform: `translateX(-${idx * 100}%)` }} //mueve la imagen 
    >
      {SLIDES.map((s, i) => ( //recorre las imagenes y muestra
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

