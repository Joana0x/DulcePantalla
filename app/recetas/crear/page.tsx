"use client";

import { useState } from "react";
import Header from "../../../componentes/Header";
import Footer from "../../../componentes/Footer";
//import { auth, db } from "../../lib/firebase-client";
import { db } from "../../../lib/firebase-client";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type Ingrediente = {
  nombre: string;
  cantidad: string;
  unidad: string;
};

const CATEGORIAS = [
  "Disney",
  "Pixar",
  "DreamWorks",
  "Studio Ghibli",
  "Live action",
  "Clásicos",
];

export default function CrearRecetaPage() {
  //VARIABLES QUE USAMOS EN EL FORMULARIO
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([
    { nombre: "", cantidad: "", unidad: "" },
  ]);
  const [procedimiento, setProcedimiento] = useState("");
  const [imagen, setImagen] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categoriasError, setCategoriasError] = useState<string | null>(null);
  const router = useRouter();                 
const [showSuccessModal, setShowSuccessModal] = useState(false);

  //---------------------------------------------------------------------------------------
  //se guarda el ingrediente que se agrega en el formulario
  function handleIngredientChange(
    index: number,
    field: keyof Ingrediente,
    value: string
  ) {
    const nuevos = [...ingredientes];
    nuevos[index] = { ...nuevos[index], [field]: value };
    setIngredientes(nuevos);
  }

  //---------------------------------------------------------------------------------------
  //agrega un nuevo ingrediente al formulario
  function addIngredient() {
    setIngredientes((prev) => [
      ...prev,
      { nombre: "", cantidad: "", unidad: "" },
    ]);
  }

  //---------------------------------------------------------------------------------------
  //elimina un ingrediente del formulario
  function removeIngredient(index: number) {
    if (ingredientes.length === 1) return;
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  }

  //---------------------------------------------------------------------------------------
  //agrega o quita una categoría del arreglo de categorías seleccionadas
  function toggleCategoria(cat: string) {
    setCategorias((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCategoriasError(null); // si ya eligió, quitamos el mensaje
  }

  //---------------------------------------------------------------------------------------
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      // usuario actual (opcional si quieres saber quién creó la receta)
      // const user = auth.currentUser;

      // Limpia ingredientes totalmente vacíos
      const ingredientesLimpios = ingredientes.filter(
        (ing) =>
          ing.nombre.trim() !== "" ||
          ing.cantidad.trim() !== "" ||
          ing.unidad.trim() !== ""
      );

      // Guardar en la colección "recetas"
      await addDoc(collection(db, "recetas"), {
        titulo,
        texto,
        procedimiento,
        imagen,
        categorias,
        ingredientes: ingredientesLimpios,
        //creadoPor: user ? user.uid : null,
        creadoEn: serverTimestamp(),
      });

      setSuccess("Tu receta se guardó correctamente");
setShowSuccessModal(true); 
      // Limpiar formulario
      setTitulo("");
      setTexto("");
      setProcedimiento("");
      setImagen("");
      setCategorias([]);
      setIngredientes([{ nombre: "", cantidad: "", unidad: "" }]);
    } catch (err) {
      console.error("Error al guardar la receta:", err);
      setError("No se pudo guardar la receta. Intenta de nuevo.");
    }
  }

  //---------------------------------------------------------------------------------------
  //valida los campos del formulario
  function validate(): string | null {
    setCategoriasError(null);
    if (categorias.length === 0) {
      setCategoriasError("Selecciona al menos una categoría.");
      return "Selecciona al menos una categoría.";
    }

    return null;
  }
  //---------------------------------------------------------------------------------------
  return (
    <>
      <Header showLoginButton={true} />

    {showSuccessModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 text-center">
          <h3 className="text-xl font-semibold text-[#3e2020] mb-2">
            ¡Receta creada!
          </h3>
          <p className="text-sm text-gray-700 mb-6">
            Tu receta se guardó correctamente en Dulce Pantalla.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 rounded-xl border border-[#3e2020] text-[#3e2020] hover:bg-[#3e2020] hover:text-white text-sm font-medium"
            >
              Seguir creando
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-xl bg-[#3e2020] text-white hover:bg-pink-950 text-sm font-medium"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )}

    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-white z-0" />
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 gap-12 items-start">
          {/* Texto de arriba */}
            <div className="text-center max-w-2xl mx-auto">
              <h1
                style={{ color: "var(--text)" }}
                className="text-4xl md:text-5xl font-extrabold leading-tight"
              >
                Crea una receta para
                <br />
                Dulce Pantalla.
              </h1>
              <p className="mt-5 text-gray-700 text-lg">
                Comparte el postre icónico de tus películas o series favoritas
                con la comunidad.
              </p>
             
            </div>
           

            {/* Tarjeta con el formulario */}
            <div
              style={{
                backgroundColor: "var(--brand)",
                borderColor: "var(--brand)",
              }}
              className="relative rounded-2xl p-8 shadow-[0_10px_30px_rgba(224,97,156,0.25)] backdrop-blur border w-full max-w-4xl mx-auto"
            >
              <header className="mb-6 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white mb-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-red-950"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5 11a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1H5v-1Zm1 3h12l-1 6H7l-1-6Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold !text-white">
                  Nueva receta
                </h2>
                <p className="mt-1 text-sm !text-white">
                  Llena los campos para publicar tu creación.
                </p>
              </header>
            
              {mensaje && (
                <p className="mb-4 rounded-xl bg-white border border-yellow-500 p-3 text-sm text-black font-semibold text-center">
                  {mensaje}
                </p>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                {/* Título */}
                <div>
                  <label
                    htmlFor="titulo"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Título de la receta
                  </label>
                  <input
                    id="titulo"
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder={`Ej. Pastel de chocolate de "Matilda"`}
                    required
                    className="w-full rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                  />
                </div>
                {/* Texto */}
                <div>
                  <label
                    htmlFor="texto"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Cuéntale al mundo por qué vale la pena hacer esta receta:
                  </label>
                  <textarea
                    id="texto"
                    rows={5}
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="¿Qué la hace única, diferente o simplemente irresistible?"
                    required
                    className="w-full rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                  />
                </div>

                {/* Ingredientes */}
                <div>
                  <p className="mb-2 text-md font-medium text-white">
                    Ingredientes
                  </p>

                  <div className="space-y-3">
                    {ingredientes.map((ing, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Nombre del ingrediente"
                          required
                          value={ing.nombre}
                          onChange={(e) =>
                            handleIngredientChange(
                              index,
                              "nombre",
                              e.target.value
                            )
                          }
                          className="md:col-span-2 rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                        />
                        <input
                          type="number"
                          min={0}
                          placeholder="Cant."
                          required
                          value={ing.cantidad}
                          onChange={(e) =>
                            handleIngredientChange(
                              index,
                              "cantidad",
                              e.target.value
                            )
                          }
                          className="rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                        />
                        <div className="flex gap-2 items-center">
                          <select
                            value={ing.unidad}
                            onChange={(e) =>
                              handleIngredientChange(
                                index,
                                "unidad",
                                e.target.value
                              )
                            }
                            required={
                              ing.nombre.trim() !== "" ||
                              ing.cantidad.trim() !== ""
                            }
                            className="flex-1 rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                          >
                            <option value="">Unidad</option>
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                            <option value="cdita">cdita</option>
                            <option value="cda">cda</option>
                            <option value="taza">taza</option>
                            <option value="pieza">pieza</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            disabled={ingredientes.length === 1}
                            className={`text-white/80 text-sm hover:text-white px-2 ${
                              ingredientes.length === 1
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addIngredient}
                    className="mt-3 rounded-xl border border-amber-50 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
                  >
                    + Agregar ingrediente
                  </button>
                </div>

                {/* Procedimiento */}
                <div>
                  <label
                    htmlFor="procedimiento"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Procedimiento
                  </label>
                  <textarea
                    id="procedimiento"
                    rows={5}
                    value={procedimiento}
                    onChange={(e) => setProcedimiento(e.target.value)}
                    placeholder="Describe paso a paso cómo preparar la receta."
                    required
                    className="w-full rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                  />
                </div>

                {/* Imagen */}
                <div>
                  <label
                    htmlFor="imagen"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Imagen (URL)
                  </label>
                  <input
                    id="imagen"
                    type="url"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    placeholder="https://ejemplo.com/mi-postre.png"
                    required
                    className="w-full rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                  />
                  <p className="mt-1 text-xs text-white/80">
                    Más adelante podrás subir imágenes directamente.
                  </p>
                </div>

                {/* Categorías */}
                <div>
                  <p className="mb-2 text-md font-medium text-white">
                    Categorías
                  </p>
                  <p className="text-xs text-white/80 mb-2">
                    Elige una o varias categorías para facilitar la búsqueda.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIAS.map((cat) => {
                      const activa = categorias.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategoria(cat)}
                          className={`rounded-full border px-4 py-1 text-sm font-medium transition ${
                            activa
                              ? "bg-white text-red-900 border-white shadow-md"
                              : "bg-transparent text-white/80 border-white/70 hover:bg-white/10"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {categoriasError && (
                    <div className="mt-4">
                      <p className="inline-block rounded-lg bg-[#f1cece] px-3 py-1 text-sm font-semibold text-[#3e2020]">
                        {categoriasError}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-amber-50 bg-[#3e2020] hover:bg-pink-950 text-white font-semibold px-4 py-2"
                >
                  Guardar receta
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
