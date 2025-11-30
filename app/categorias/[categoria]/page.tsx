'use client';

import { use } from 'react';
import Header from '../../../componentes/Header';
import Footer from '../../../componentes/Footer';
import VideosCategorias from '../../../componentes/VideosCategorias';
import { auth } from '../../../lib/firebase-client';

type Props = {
  params: Promise<{ categoria: string }>;
};

export default function CategoriaPage({ params }: Props) {
  const { categoria } = use(params);

  // Usuario actual de Firebase
  const user = auth.currentUser;

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
      <Footer />
    </>
  );
}
