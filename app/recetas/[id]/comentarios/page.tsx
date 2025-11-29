"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Header from "../../../componentes/Header";
import Footer from "../../../componentes/Footer";
import { db } from "../../../lib/firebase-client";
import type { Timestamp } from "firebase/firestore";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

type Comentario = {
  id?: string;
  usuarioId: string | null;
  nombreUsuario: string;
  avatarUrl?: string;
  titulo: string;
  texto: string;
  estrellas: number;
  creadoEn?: Timestamp | null;
};


export default function ComentariosRecetaPage() {
  const params = useParams<{ id: string }>();
  const idReceta = params.id;

  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // estado del formulario
  const [nombre, setNombre] = useState("");
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [enviando, setEnviando] = useState(false);

  // Cargar comentarios
  useEffect(() => {
    async function cargarComentarios() {
      try {
        setError(null);
        setLoading(true);

        const ref = collection(db, "recetas", idReceta, "comentarios");
        const q = query(ref, orderBy("creadoEn", "desc"));
        const snap = await getDocs(q);

        const datos: Comentario[] = snap.docs.map((docSnap) => {
          const data = docSnap.data() as Comentario;
          return { ...data, id: docSnap.id };
        });

        setComentarios(datos);
      } catch (e) {
        console.error("Error al cargar comentarios:", e);
        setError("Ocurrió un error al cargar los comentarios.");
      } finally {
        setLoading(false);
      }
    }

    if (idReceta) {
      cargarComentarios();
    }
  }, [idReceta]);

  // Enviar comentario nuevo
  async function manejarSubmit(e: FormEvent) {
    e.preventDefault();
    if (!texto.trim() || !titulo.trim()) return;

    try {
      setEnviando(true);
      setError(null);

      const ref = collection(db, "recetas", idReceta, "comentarios");

      await addDoc(ref, {
        usuarioId: null, // después se rellena con user.uid
        nombreUsuario: nombre.trim() || "Invitado",
        titulo: titulo.trim(),
        texto: texto.trim(),
        estrellas,
        creadoEn: serverTimestamp(),
      });

      // limpiar formulario
      setTitulo("");
      setTexto("");
      setNombre("");
      setEstrellas(5);

      // recargar comentarios rápido (simple y efectivo)
      const snap = await getDocs(query(ref, orderBy("creadoEn", "desc")));
      const datos: Comentario[] = snap.docs.map((docSnap) => {
        const data = docSnap.data() as Comentario;
        return { ...data, id: docSnap.id };
      });
      setComentarios(datos);
    } catch (e) {
      console.error("Error al enviar comentario:", e);
      setError("No se pudo guardar tu opinión. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Header showLoginButton={true} />

      <main className="container py-10">
        <section className="section">
          <h1
            className="text-3xl md:text-4xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-titles)" }}
          >
            Opiniones de clientes
          </h1>

          {loading && (
            <p className="text-gray-600 mb-4">Cargando opiniones...</p>
          )}

          {error && (
            <p className="text-red-700 mb-4 text-sm">{error}</p>
          )}

          {/* Lista de comentarios */}
          {!loading && comentarios.length === 0 && (
            <p className="text-gray-700 mb-8">
              Aún no hay opiniones para esta receta. ¡Sé la primera persona en
              comentar!
            </p>
          )}

          <div className="space-y-4 mb-10">
            {comentarios.map((coment) => (
              <article
                key={coment.id}
                className="bg-[#f0eef0] rounded-3xl px-5 py-4 flex gap-4"
              >
                {/* Avatar simple redondo */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#c9b1c5] flex items-center justify-center text-white font-bold">
                    {(coment.nombreUsuario || "I")[0]}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {coment.nombreUsuario || "Invitado"}
                  </h3>

                  {/* estrellitas simples */}
                  <div className="text-sm mb-1">
                    {"★".repeat(coment.estrellas)}{" "}
                    {"☆".repeat(5 - coment.estrellas)}
                  </div>

                  <p className="font-semibold mb-1">{coment.titulo}</p>
                  <p className="text-sm text-gray-800">{coment.texto}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Formulario para nueva opinión */}
          <section className="mt-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-2">
              Escribe una opinión para esta receta
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Comparte tu opinión con otros amantes de la repostería.
            </p>

            <form onSubmit={manejarSubmit} className="space-y-4 max-w-xl">
                <div>
                <label className="block text-sm font-medium mb-1">
                  Estrellas
                </label>
                <select
                  value={estrellas}
                  onChange={(e) => setEstrellas(Number(e.target.value))}
                  className="border rounded-xl px-3 py-2"
                >
                  <option value={5}>★★★★★</option>
                  <option value={4}>★★★★☆</option>
                  <option value={3}>★★★☆☆</option>
                  <option value={2}>★★☆☆☆</option>
                  <option value={1}>★☆☆☆☆</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tu nombre (opcional)
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2"
                  placeholder="Ej. Esperanza Sánchez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Título de tu opinión
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2"
                  placeholder="Ej. Deliciosa y fácil de hacer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tu opinión
                </label>
                <textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 min-h-[120px]"
                  placeholder="Cuéntanos qué te pareció la receta..."
                  required
                />
              </div>

              

              <button
                type="submit"
                disabled={enviando}
                className="w-full md:w-auto px-6 py-3 rounded-full border border-[#5d1225] bg-[#f4dde4] text-[#5d1225] font-semibold hover:bg-[#5d1225] hover:text-white transition disabled:opacity-50"
              >
                {enviando ? "Enviando opinión..." : "Escribir mi opinión"}
              </button>
            </form>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
