
"use client";

import { useEffect, useState } from "react";
import { auth } from "../lib/firebase-client";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";

import Footer from "../componentes/Footer";
import ComentarioCarrusel from "../componentes/ComentarioCarrusel";
import VideoInicio from "../componentes/VideoInicio";
import Header from "../componentes/Header";

import Image from "next/image";

import Link from "next/link";


export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        router.push("/dashboard"); // redirige al dashboard
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return null;

  return (
    <>
      {/* En la landing siempre mostramos el botón de login */}
      <Header showLoginButton={true} />

      {/* Video principal */}
      <div className="full-bleed">
        <VideoInicio
          videoId="jOWSGDCMiE0"
          startSeconds={156}
          titulo="“Cualquiera puede cocinar”"
          subtitulo="- Chef Gusteau"
          overlay="bg-black/30"
          heightClass="h-[50vh] md:h-[60vh]"
        />
      </div>

      <main className="container">
        <div className="my-16"></div>


        <footer></footer>


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

                <img src="/img/rataoulle.jpg" alt="Ratatouille" />

                <h3>Ratatouille</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="comentarios-title">
          <h2 id="comentarios-title" className="sr-only">
            Comentarios
          </h2>
          <h2 id="section-title">COMENTARIOS</h2>

          <ComentarioCarrusel />
        </section>

        {/* Recetas y preguntas */}
        <section className="section" aria-labelledby="combo-title">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
            <div className="deCero" style={{ flex: "1", minWidth: "300px" }}>
              <h3 id="feat-title" className="center">DE CERO A REPOSTERO</h3>
              <div className="DeCero-grid">
                <article className="famosa-card">
                  <Image src="/img/monsters-inc-conos.jpg" alt="Conos de Nieve Monster Inc" width={400} height={300} />
                  <h3>Conos de Nieve Monster Inc</h3>

                  {/* Botón para ver la receta completa */}
                  <Link
                    href="/recetas/0YPvKGxgWAO5aTwVazyh"
                    className="btn-ver"
                  >
                    VER RECETA
                  </Link>
                </article>
              </div>
            </div>

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
              {/* Pregunta 4 */}
              <details className="faq-item">
                <summary>
                  ¿Puedo sugerir una receta de mi película o serie favorita?
                </summary>
                <p>
                  ¡Claro! Nos encanta recibir ideas. Puedes enviarlas desde la
                  sección de contacto o por redes sociales.
                </p>
              </details>

              {/* Pregunta 5 */}
              <details className="faq-item">
                <summary>¿Las recetas son unicamente de prostres?</summary>
                <p>
                  No, también hay platos salados inspirados en escenas icónicas.
                  ¡Hay sabores para todos los gustos!
                </p>

              </details>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
