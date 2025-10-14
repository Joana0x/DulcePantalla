import Image from "next/image";
import Hero from "./componentes/Hero";
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
            <a className="login-link">INICIAR SESIÓN.</a>
          </div>
        </nav>
      </header>

      {/* Contenido principal del sitio */}
      <main className="container">
        {/* Sección de bienvenida o "hero section" */}
        <section className="section hero-section" aria-labelledby="hero-title">
          <div className="hero-header">
            <Image
              src="/Logo 2.png"
              alt="Logo Dulce Pantalla"
              width={160}
              height={160}
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
                <img src="/cenicienta.jpg" alt="Feliz cumpleaños Harry" />
                <h3>Pastel de cenicienta</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>

              <article className="famosa-card">
                <img src="/jumbo.jpg" alt="Cerveza de mantequilla" />
                <h3>Gumbo de Tiana</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>

              <article className="famosa-card">
                <img src="/merida.jpg" alt="Merida" />
                <h3>Pastelito de Merida</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>

              <article className="famosa-card">
                <img src="rataoulle.jpg" alt="Ratatouille" />
                <h3>Ratatouille</h3>
                <button className="btn-ver">VER RECETA</button>
              </article>
            </div>
          </div>
        </section>
        {/* Sección de preguntas frecuentes */}
        <section className="section" aria-labelledby="faq-title">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "600px", width: "100%" }}>
              <h2
                id="faq-title"
                style={{
                  textAlign: "center",
                  fontSize: "2rem",
                  marginBottom: "2rem",
                  color: "#7b1e3b", // tono vino
                }}
              >
                PREGUNTAS CON SABOR
              </h2>

              {/* Pregunta 1 */}
              <details
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  background: "#fff7f9",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#7b1e3b",
                  }}
                >
                  ¿Las recetas son exactamente iguales a las de las películas o
                  series?
                </summary>
                <p style={{ marginTop: "0.5rem" }}>
                  Nos inspiramos en los sabores y estilos, pero adaptamos las
                  recetas para que sean prácticas y deliciosas en casa.
                </p>
              </details>

              {/* Pregunta 2 */}
              <details
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  background: "#fff7f9",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#7b1e3b",
                  }}
                >
                  ¿Necesito ser experto en repostería para seguir las recetas?
                </summary>
                <p style={{ marginTop: "0.5rem" }}>
                  ¡Para nada! Están pensadas para todos los niveles, con
                  instrucciones claras y pasos sencillos.
                </p>
              </details>

              {/* Pregunta 3 */}
              <details
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  background: "#fff7f9",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#7b1e3b",
                  }}
                >
                  ¿Se necesitan ingredientes difíciles de conseguir?
                </summary>
                <p style={{ marginTop: "0.5rem" }}>
                  Usamos ingredientes accesibles. Si hay alguno especial, te
                  damos alternativas fáciles.
                </p>
              </details>

              {/* Pregunta 4 */}
              <details
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  background: "#fff7f9",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#7b1e3b",
                  }}
                >
                  ¿Puedo sugerir una receta de mi película, serie o caricatura
                  favorita?
                </summary>
                <p style={{ marginTop: "0.5rem" }}>
                  ¡Claro! Nos encanta recibir ideas. Puedes enviarlas desde la
                  sección de contacto o por redes sociales.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* Pie de página del sitio */}
      <footer>Footer</footer>
    </>
  );
}
