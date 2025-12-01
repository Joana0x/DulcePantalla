"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Header from "../../../componentes/Header";
import Footer from "../../../componentes/Footer";
import { auth, db } from "../../../lib/firebase-client";
import Link from "next/link";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";

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

  creadorNombre?: string | null;
  creadorUid?: string;
  creadorEmail?: string | null;
};

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

type UsuarioBD = {
  nombre_usuario?: string;
  nombres?: string;
  apellidos?: string;
};

export default function VerRecetaPage() {
  // Usuario actual de Firebase
  const user = auth.currentUser;

  const params = useParams<{ id: string }>();
  const idReceta = params.id;

  // ---------- ESTADO DE LA RECETA ----------
  const [receta, setReceta] = useState<Receta | null>(null);
  const [loadingReceta, setLoadingReceta] = useState(true);
  const [errorReceta, setErrorReceta] = useState<string | null>(null);

  // ---------- ESTADO DE COMENTARIOS ----------
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loadingComentarios, setLoadingComentarios] = useState(true);
  const [errorComentarios, setErrorComentarios] = useState<string | null>(null);

  // formulario de comentario
  const [tituloComentario, setTituloComentario] = useState("");
  const [textoComentario, setTextoComentario] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  // nombre del usuario que comenta (desde colección "usuarios")
  const [nombreUsuarioActual, setNombreUsuarioActual] = useState<string | null>(
    null
  );

  // ---------- CARGAR RECETA ----------
  useEffect(() => {
    if (!idReceta) return;

    async function cargarReceta() {
      try {
        setErrorReceta(null);
        setLoadingReceta(true);

        const ref = doc(db, "recetas", idReceta);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setErrorReceta("Esta receta no existe o fue eliminada.");
          setReceta(null);
        } else {
          const data = snap.data() as Receta;
          setReceta(data);
        }
      } catch (e) {
        console.error("Error al cargar la receta:", e);
        setErrorReceta("Ocurrió un error al cargar la receta.");
      } finally {
        setLoadingReceta(false);
      }
    }

    void cargarReceta();
  }, [idReceta]);

  // ---------- CARGAR NOMBRE DEL USUARIO (para comentar) ----------
  useEffect(() => {
    async function cargarNombreUsuario() {
      if (!user) {
        setNombreUsuarioActual(null);
        return;
      }

      try {
        const refUsuario = doc(db, "usuarios", user.uid);
        const snapUsuario = await getDoc(refUsuario);

        if (snapUsuario.exists()) {
          const datos = snapUsuario.data() as UsuarioBD;

          let nombre = "";
          if (datos.nombre_usuario && datos.nombre_usuario.trim() !== "") {
            nombre = datos.nombre_usuario;
          } else {
            nombre = `${datos.nombres ?? ""} ${datos.apellidos ?? ""}`.trim();
          }

          if (nombre) {
            setNombreUsuarioActual(nombre);
          } else {
            setNombreUsuarioActual(user.email ?? null);
          }
        } else {
          setNombreUsuarioActual(user.email ?? null);
        }
      } catch (e) {
        console.error("Error al obtener datos del usuario:", e);
        setNombreUsuarioActual(user?.email ?? null);
      }
    }

    void cargarNombreUsuario();
  }, [user]);

  // ---------- CARGAR COMENTARIOS ----------
  useEffect(() => {
    async function cargarComentarios() {
      try {
        setErrorComentarios(null);
        setLoadingComentarios(true);

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
        setErrorComentarios("Ocurrió un error al cargar los comentarios.");
      } finally {
        setLoadingComentarios(false);
      }
    }

    if (idReceta) {
      void cargarComentarios();
    }
  }, [idReceta]);

  // ---------- ENVIAR NUEVO COMENTARIO ----------
  async function manejarSubmitComentario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!textoComentario.trim() || !tituloComentario.trim()) return;

    if (!user) {
      setErrorComentarios("Debes iniciar sesión para escribir una opinión.");
      return;
    }

    const nombreParaComentario =
      nombreUsuarioActual ?? user.email ?? "Invitado";

    try {
      setEnviandoComentario(true);
      setErrorComentarios(null);

      const ref = collection(db, "recetas", idReceta, "comentarios");

      await addDoc(ref, {
        usuarioId: user.uid,
        nombreUsuario: nombreParaComentario,
        titulo: tituloComentario.trim(),
        texto: textoComentario.trim(),
        estrellas,
        creadoEn: serverTimestamp(),
      });

      // limpiar formulario
      setTituloComentario("");
      setTextoComentario("");
      setEstrellas(5);

      // recargar comentarios
      const snap = await getDocs(query(ref, orderBy("creadoEn", "desc")));
      const datos: Comentario[] = snap.docs.map((docSnap) => {
        const data = docSnap.data() as Comentario;
        return { ...data, id: docSnap.id };
      });
      setComentarios(datos);
    } catch (e) {
      console.error("Error al enviar comentario:", e);
      setErrorComentarios("No se pudo guardar tu opinión. Inténtalo de nuevo.");
    } finally {
      setEnviandoComentario(false);
    }
  }

  return (
    <>
      <Header showLoginButton={!user} user={user} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white z-0" />

        <div className="relative z-10">
          {/* HERO con imagen */}
          {receta && receta.imagen && (
            <div className="relative w-full h-72 md:h-[420px]">
              <img
                src={receta.imagen}
                alt={receta.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          )}

          {/* Contenido principal */}
          <div className="max-w-5xl mx-auto px-4 py-12">
            {loadingReceta && (
              <p className="text-center text-lg text-gray-600">
                Cargando receta...
              </p>
            )}

            {errorReceta && !loadingReceta && (
              <p className="text-center text-sm text-red-700">{errorReceta}</p>
            )}

            {!loadingReceta && !errorReceta && !receta && (
              <p className="text-center text-lg text-gray-600">
                No se encontró la receta.
              </p>
            )}

            {!loadingReceta && !errorReceta && receta && (
              <div className="space-y-8">
                {/* ENCABEZADO: creador + título + categorías */}
                <header className="text-center md:text-left">
                       {receta.creadorNombre && (
                    <div className="mb-4 flex items-center justify-center md:justify-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-6 h-6 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.121 17.804A9.004 9.004 0 0112 15c2.21 0 4.21.802 5.879 2.121M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>

                      {/* Nombre y rol */}
                      <div className="text-left">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          {receta.creadorNombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          Creador de esta receta
                        </p>
                      </div>
                    </div>
                  )}

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

                {/* Procedimiento */}
                <div className="mt-8 pt-6 border-t border-gray-200">
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

                {/* ---------- OPINIONES DE CLIENTES + FORMULARIO ---------- */}
                <div className="pt-8 border-t border-gray-200">
                  <h2
                    className="text-xl md:text-2xl font-semibold mb-4"
                    style={{ color: "var(--text)" }}
                  >
                    Opiniones de clientes
                  </h2>

                  {loadingComentarios && (
                    <p className="text-gray-600 mb-4">Cargando opiniones...</p>
                  )}

                  {errorComentarios && (
                    <p className="text-red-700 mb-4 text-sm">
                      {errorComentarios}
                    </p>
                  )}

                  {!loadingComentarios && comentarios.length === 0 && (
                    <p className="text-gray-700 mb-8">
                      Aún no hay opiniones para esta receta. ¡Sé la primera
                      persona en comentar!
                    </p>
                  )}

                  {/* Lista de comentarios */}
                  <div className="space-y-4 mb-10">
                    {comentarios.map((coment) => (
                      <article
                        key={coment.id}
                        className="bg-[#f0eef0] rounded-3xl px-5 py-4 flex gap-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-[#c9b1c5] flex items-center justify-center text-white font-bold">
                            {(coment.nombreUsuario || "I")[0]}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {coment.nombreUsuario || "Invitado"}
                          </h3>
                          <div className="text-sm mb-1">
                            {"★".repeat(coment.estrellas)}{" "}
                            {"☆".repeat(5 - coment.estrellas)}
                          </div>
                          <p className="font-semibold mb-1">{coment.titulo}</p>
                          <p className="text-sm text-gray-800">
                            {coment.texto}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Formulario nueva opinión */}
                  <section className="mt-8 max-w-xl mx-auto">
                    <h3 className="text-2xl font-semibold mb-2">
                      Escribe una opinión para esta receta
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Comparte tu opinión con otros amantes de la repostería.
                    </p>

                    {!user && (
                      <p className="text-sm text-gray-700 mb-4">
                        Para escribir una opinión necesitas iniciar sesión.{" "}
                        <Link
                          href="/log-in"
                          className="text-[#5d1225] underline font-semibold"
                        >
                          Inicia sesión aquí.
                        </Link>
                      </p>
                    )}

                    {user && (
                      <>
                        <p className="text-sm text-gray-700 mb-3">
                          Comentando como{" "}
                          <span className="font-semibold">
                            {nombreUsuarioActual ?? user.email}
                          </span>
                        </p>

                        <form
                          onSubmit={manejarSubmitComentario}
                          className="space-y-4 max-w-xl"
                        >
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Estrellas
                            </label>
                            <select
                              value={estrellas}
                              onChange={(e) =>
                                setEstrellas(Number(e.target.value))
                              }
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
                              Título de tu opinión
                            </label>
                            <input
                              type="text"
                              value={tituloComentario}
                              onChange={(e) =>
                                setTituloComentario(e.target.value)
                              }
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
                              value={textoComentario}
                              onChange={(e) =>
                                setTextoComentario(e.target.value)
                              }
                              className="w-full border rounded-xl px-3 py-2 min-h-[120px]"
                              placeholder="Cuéntanos qué te pareció la receta..."
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={enviandoComentario}
                            className="w-full md:w-auto px-6 py-3 rounded-full border border-[#5d1225] bg-[#f4dde4] text-[#5d1225] font-semibold hover:bg-[#5d1225] hover:text-white transition disabled:opacity-50"
                          >
                            {enviandoComentario
                              ? "Enviando opinión..."
                              : "Escribir mi opinión"}
                          </button>
                        </form>
                      </>
                    )}
                  </section>
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
