import Image from "next/image";
import Hero from "./componentes/Hero";
import Footer from "./componentes/Footer";
import ComentarioCarrusel from "./componentes/ComentarioCarrusel";

//. carpeta donde estoy parado

// Esta es la función principal de la página de inicio. Next.js muestra esto en la ruta "/"
export default function Home() {
  return (
    <>
      {/* Encabezado principal del sitio */}
      <header className="site-header">
        {/* Barra de navegación dentro del encabezado */}
        <nav className="container nav">
          {/* IZQUIERDA */}
          <div className="nav-left">
            <a className="brand">DULCE PANTALLA</a>
          </div>

          {/* CENTRO */}
          <div className="nav-center">
            <ul className="menu-center">
              <li>
                <a>INICIO</a>
              </li>
              <li>
                <a>CATEGORIAS</a>
              </li>
            </ul>
          </div>

          {/* DERECHA */}
          <div className="nav-right">
            <a className="login-link">INICIAR SESIÓN</a>
          </div>
        </nav>
      </header>

      {/* Contenido principal del sitio */}
      <main className="container">
        {/* Sección de bienvenida o "hero section" */}
        <section className="section hero-section" aria-labelledby="hero-title">
          <div className="hero-header">
            <Image
              src="/img/Logo 2.png"
              alt="Logo Dulce Pantalla"
              width={190}
              height={190}
            />
            <h1 id="hero-title">RECETAS DEL MES</h1>
          </div>
        </section>

        <Hero />
        <section className="frase">
          <blockquote>
            “Cualquiera puede cocinar.”
            <footer>- Chef Gusteau</footer>
          </blockquote>
        </section>
        {/* Sección las más famosas del cine */}
        <section className="section" aria-labelledby="feat-title">
          <div className="famosas">
            <h2 id="feat-title">LAS MÁS FAMOSAS DEL CINE</h2>

            <div className="famosas-grid">
              <article className="famosa-card">
                <img src="/img/cenicienta.jpg" alt="Feliz cumpleaños Harry" />
                <h3>Pastel de La Bellla Durmiente</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>

              <article className="famosa-card">
                <img src="/img/jumbo.jpg" alt="Cerveza de mantequilla" />
                <h3>Gumbo de Tiana</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>

              <article className="famosa-card">
                <img src="/img/merida.jpg" alt="Merida" />
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
        <h2 id="comentarios-title" className="sr-only">Comentarios</h2>
        <h2 id="section-title">COMENTARIOS</h2>

        <ComentarioCarrusel />
      </section>

        <section className="section" aria-labelledby="combo-title">
          {/* Contenedor principal con flexbox para alinear horizontalmente las dos secciones */}
          <div
            style={{
              display: "flex", // activa el layout en fila
              justifyContent: "space-between", // separa los elementos con espacio entre ellos
              alignItems: "flex-start", // alinea arriba
              gap: "2rem", // espacio entre columnas
              flexWrap: "wrap", // permite que se acomode en móviles
            }}
          >
            {/* Sección de recetas a la izquierda */}
            <div className="deCero" style={{ flex: "1", minWidth: "300px" }}>
              {/* Título de la sección de recetas */}
              <h3 id="feat-title" className="center">
                DE CERO A REPOSTERO
              </h3>

              {/* Grid de recetas, puedes agregar más artículos aquí */}
              <div className="DeCero-grid">
                <article className="famosa-card">
                  {/* Imagen del postre inspirado en Monster Inc */}
                  <img src="/img/monsters-inc-conos.jpg" />
                  {/* Nombre del postre */}
                  <h3>Conos de Nieve Monster Inc</h3>
                  {/* Botón para ver la receta completa */}
                  <button className="btn-ver">VER RECETA</button>
                </article>
              </div>
            </div>

            {/* Sección de preguntas frecuentes a la derecha */}
            <div className="columna-preguntas">
              {/* Título de la sección de preguntas */}
              <h3 id="faq-title">PREGUNTAS CON SABOR</h3>

              {/* Pregunta 1 */}
              <details className="faq-item">
                <summary>
                  ¿Las recetas son iguales a las de las películas?
                </ summary>
                <p>
                  Nos inspiramos en los sabores y estilos, pero adaptamos las
                  recetas para que sean prácticas y deliciosas en casa.
                </p>
              </details>

              {/* Pregunta 2 */}
              <details className="faq-item">
                <summary>
                  ¿Necesito ser experto en repostería para seguir las recetas?
                </summary>
                <p>
                  ¡Para nada! Están pensadas para todos los niveles, con
                  instrucciones claras y pasos sencillos.
                </p>
              </details>

              {/* Pregunta 3 */}
              <details className="faq-item">
                <summary>
                  ¿Se necesitan ingredientes difíciles de conseguir?
                </summary>
                <p>
                  Usamos ingredientes accesibles. Si hay alguno especial, te
                  damos alternativas fáciles.
                </p>
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
                <summary>
                  ¿Las recetas son unicamente de prostres?
                </summary>
                <p>
                   No, también hay platos salados inspirados en escenas icónicas.
                   ¡Hay sabores para todos los gustos!
                </p>
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
