'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase-client';
import Header from '../../../componentes/Header';
import Footer from '../../../componentes/Footer';
import VideosCategorias from '../../../componentes/VideosCategorias';

// Tipo seguro para recetas
interface Receta {
  id: string;
  titulo: string;
  texto: string;
  imagen: string;
  categorias: string[];
  creadorEmail: string;
  creadoEn: Timestamp;
}

type Props = {
  params: Promise<{ categoria: string }>;
};

export default function CategoriaPage({ params }: Props) {
  const { categoria } = use(params);
  const user = auth.currentUser;

  const [recetas, setRecetas] = useState<Receta[]>([]);

  // Normaliza la categoría para que coincida con Firestore (ej. "Disney")
  const categoriaNormalizada =
    categoria.charAt(0).toUpperCase() + categoria.slice(1);

  // Escuchar recetas en tiempo real
  useEffect(() => {
    const q = query(
      collection(db, 'recetas'),
      where('categorias', 'array-contains', categoriaNormalizada),
      orderBy('creadoEn', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Receta[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Receta, 'id'>),
      }));
      setRecetas(docs);
    });

    return () => unsubscribe();
  }, [categoriaNormalizada]);

  const nombresBonitos: Record<string, string> = {
    disney: 'Disney',
    pixar: 'Pixar',
    'studio-ghibli': 'Studio Ghibli',
    dreamworks: 'DreamWorks',
    nickelodeon: 'Nickelodeon',
    netflix: 'Netflix',
  };

  const videoMap: Record<string, string> = {
    disney: 'https://www.youtube.com/embed/cvDxdUcxPUE',
    pixar: 'https://www.youtube.com/embed/gX0CmJa5Gdk',
    'studio-ghibli': 'https://www.youtube.com/embed/mTykJy2yrLg',
    dreamworks: 'https://www.youtube.com/embed/CutwdrSS8N8',
    nickelodeon: 'https://www.youtube.com/embed/w1QDyEF3MfU',
    netflix: 'https://www.youtube.com/embed/c5Py8ocxPok',
  };

  const nombre = nombresBonitos[categoria];
  const videoUrl = videoMap[categoria];

  if (!nombre || !videoUrl) {
    return (
      <>
        <Header user={user} />
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-3xl font-semibold mb-4">Categoría no encontrada</h1>
          <p className="text-gray-400">La categoría {categoria} no existe.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header user={user} />
      <VideosCategorias
        videoUrl={videoUrl}
        titulo={nombre}
        subtitulo={`Recetas inspiradas en ${nombre}`}
        overlay="bg-black/40"
      />

      {/* Listado de recetas */}
      <main className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recetas.map((receta) => (
          <article
            key={receta.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full justify-between transition hover:shadow-lg"
          >
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-red-900">{receta.titulo}</h2>
              <p className="text-gray-700 text-sm line-clamp-3">{receta.texto}</p>

              {receta.imagen && (
                <img
                  src={receta.imagen}
                  alt={receta.titulo}
                  className="rounded-lg aspect-video object-cover shadow-sm"
                />
              )}

              <p className="text-xs text-gray-500">
                Creado el {receta.creadoEn.toDate().toLocaleDateString()} por{' '}
                <span className="font-medium text-red-700">{receta.creadorEmail}</span>
              </p>
            </div>

            {/* Botón guinda refinado */}
            <button
              className="mt-4 bg-red-700 hover:bg-red-900 text-white text-sm font-semibold tracking-wide py-2 px-4 rounded-lg transition"
              onClick={() => alert(`Mostrar receta completa: ${receta.titulo}`)}
            >
              Ver receta
            </button>
          </article>
        ))}
      </main>

      <Footer />
    </>
  );
}
