"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../componentes/Header";
import Footer from "../../componentes/Footer";
import { db } from "../../lib/firebase-client";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

type Ingrediente = {
  nombre: string;
  cantidad: string;
  unidad: string;
};

type Receta = {
  titulo: string;
  texto?: string;
  procedimiento: string;
  imagen?: string;
  categorias: string[];
  ingredientes: Ingrediente[];
};

export default function VerRecetaPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [receta, setReceta] = useState<Receta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // si por alguna razón id viene undefined, no hacemos nada
    if (!id) return;

    async function cargarReceta() {
      try {
        setError(null);
        setLoading(true);

        const ref = doc(db, "recetas", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("Esta receta no existe o fue eliminada.");
          setReceta(null);
        } else {
          const data = snap.data() as Receta;
          setReceta(data);
        }
      } catch (e) {
        console.error("Error al cargar la receta:", e);
        setError("Ocurrió un error al cargar la receta.");
      } finally {
        setLoading(false);
      }
    }

    cargarReceta();
  }, [id]);

  return (
    <>
      <Header showLoginButton={true} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white z-0" />

        <div className="relative z-10">
          {/* HERO solo con la imagen a todo lo ancho */}
          {receta && receta.imagen && (
            <div className="relative w-full h-72 md:h-[420px]">
              <img
                src={receta.imagen}
                alt={receta.titulo}
                className="w-full h-full object-cover"
              />
              {/* capa oscura ligera para que se vea más cine */}
              <div className="absolute inset-0 bg-black/25" />
            </div>
          )}

          {/* Contenido de abajo */}
          <div className="max-w-5xl mx-auto px-4 py-12">
            {loading && (
              <p className="text-center text-lg text-gray-600">
                Cargando receta...
              </p>
            )}

            {error && !loading && (
              <p className="text-center text-sm text-red-700">{error}</p>
            )}

            {!loading && !error && !receta && (
              <p className="text-center text-lg text-gray-600">
                No se encontró la receta.
              </p>
            )}

            {!loading && !error && receta && (
              <div className="space-y-8">
                {/* Título y categorías (ya NO sobre la imagen) */}
                <header className="text-center md:text-left">
                  <h1
                    style={{ color: "var(--text)" }}
                    className="text-3xl md:text-4xl font-extrabold leading-tight mb-3"
                  >
                    {receta.titulo}
                  </h1>

                  {receta.categorias && receta.categorias.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {receta.categorias.map((cat) => (
                        <span
                          key={cat}
                          className="rounded-full bg-[#f7f2f0] text-[#3e2020] px-3 py-1 text-lg font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </header>

                {/* Texto de inspiración */}
                {receta.texto && (
                  <p className="text-lg text-gray-700">{receta.texto}</p>
                )}

                {/* Ingredientes */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                <div>
                  <h2
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    Ingredientes
                  </h2>
                  <ul className="list-disc list-inside text-lg text-gray-800 space-y-1">
                    {receta.ingredientes?.map((ing, index) => (
                      <li key={index}>
                        {ing.cantidad && ing.unidad
                          ? `${ing.cantidad} ${ing.unidad} `
                          : ""}
                        {ing.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
                </div>

                {/* Procedimiento */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                <div>
                  <h2
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    Procedimiento
                  </h2>
                  <p className="text-lg text-gray-800 whitespace-pre-line">
                    {receta.procedimiento}
                  </p>
                </div>
                </div>

                {/* Opiniones de clientes / botón */}
                <div className="pt-8 border-t border-gray-200">
                  <h2
                    className="text-xl md:text-2xl font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    Opiniones de clientes
                  </h2>
                  <p className="text-sm text-gray-700 mb-4">
                    Descubre qué opinan otras personas sobre esta receta o
                    comparte tu propia experiencia.
                  </p>

                  <Link
                    href={`/recetas/${id}/comentarios`}
                    className="inline-flex px-6 py-3 rounded-full border border-[#5d1225] bg-[#f4dde4] text-[#5d1225] font-semibold hover:bg-[#5d1225] hover:text-white transition"
                  >
                    Ver comentarios
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
