"use client";

import { useState, useEffect } from "react";
import { auth } from "../lib/firebase-client";
import type { User } from "firebase/auth";

import Image from "next/image";
import Footer from "../componentes/Footer";
import ComentarioCarrusel from "../componentes/ComentarioCarrusel";
import VideoInicio from "../componentes/VideoInicio";
import Header from "../componentes/Header";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u as User | null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Encabezado principal del sitio */}
      <Header showLoginButton={!user} user={user} />

      {/* Video */}
      <div className="full-bleed">
        <VideoInicio
          videoId="jOWSGDCMiE0"
          startSeconds={156}
          titulo="“Cualquiera puede cocinar”"
          subtitulo={user ? `¡Hola ${user.displayName ?? user.email}!` : "- Chef Gusteau"}
          overlay="bg-black/30"
          heightClass="h-[50vh] md:h-[60vh]"
        />
      </div>

      {/* Contenido principal del sitio */}
      <main className="container">
        <div className="my-16"></div>

        {/* Sección las más famosas del cine */}
        <section className="section" aria-labelledby="feat-title">
          <div className="famosas">
            <h2 id="feat-title">LAS MÁS FAMOSAS DEL CINE</h2>

            <div className="famosas-grid">
              <article className="famosa-card">
                <Image src="/img/cenicienta.jpg" alt="Pastel de La Bella Durmiente" width={400} height={300} />
                <h3>Pastel de La Bella Durmiente</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>

              <article className="famosa-card">
                <Image src="/img/jumbo.jpg" alt="Gumbo de Tiana" width={400} height={300} />
                <h3>Gumbo de Tiana</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>

              <article className="famosa-card">
                <Image src="/img/merida.jpg" alt="Pastelito de Merida" width={400} height={300} />
                <h3>Pastelito de Merida</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>

              <article className="famosa-card">
                <Image src="/img/rataoulle.jpg" alt="Ratatouille" width={400} height={300} />
                <h3>Ratatouille</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>
            </div>
          </div>
        </section>

        {/* Comentarios */}
        <section className="section" aria-labelledby="comentarios-title">
          <h2 id="comentarios-title" className="sr-only">Comentarios</h2>
          <h2 id="section-title">COMENTARIOS</h2>
          <ComentarioCarrusel />
        </section>

        {/* Recetas y preguntas */}
        <section className="section" aria-labelledby="combo-title">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            {/* Recetas */}
            <div className="deCero" style={{ flex: "1", minWidth: "300px" }}>
              <h3 id="feat-title" className="center">DE CERO A REPOSTERO</h3>
              <div className="DeCero-grid">
                <article className="famosa-card">
                  <Image src="/img/monsters-inc-conos.jpg" alt="Conos de Nieve Monster Inc" width={400} height={300} />
                  <h3>Conos de Nieve Monster Inc</h3>
                  <button className="btn-ver">VER RECETA</button>
                </article>
              </div>
            </div>

            {/* Preguntas frecuentes */}
            <div className="columna-preguntas">
              <h3 id="faq-title">PREGUNTAS CON SABOR</h3>

              <details className="faq-item">
                <summary>¿Las recetas son iguales a las de las películas?</summary>
                <p>Nos inspiramos en los sabores y estilos, pero adaptamos las recetas para que sean prácticas y deliciosas en casa.</p>
              </details>

              <details className="faq-item">
                <summary>¿Necesito ser experto en repostería para seguir las recetas?</summary>
                <p>¡Para nada! Están pensadas para todos los niveles, con instrucciones claras y pasos sencillos.</p>
              </details>

              <details className="faq-item">
                <summary>¿Se necesitan ingredientes difíciles de conseguir?</summary>
                <p>Usamos ingredientes accesibles. Si hay alguno especial, te damos alternativas fáciles.</p>
              </details>

              <details className="faq-item">
                <summary>¿Puedo sugerir una receta de mi película o serie favorita?</summary>
                <p>¡Claro! Nos encanta recibir ideas. Puedes enviarlas desde la sección de contacto o por redes sociales.</p>
              </details>

              <details className="faq-item">
                <summary>¿Las recetas son únicamente de postres?</summary>
                <p>No, también hay platos salados inspirados en escenas icónicas. ¡Hay sabores para todos los gustos!</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* Pie de página del sitio */}
      <Footer />
    </>
  );
}
