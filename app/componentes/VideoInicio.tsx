'use client';

type Props = {
  videoId: string;         // p.ej. "jOWSGDCMiE0"
  startSeconds?: number;   // p.ej. 156 = 2:36
  titulo?: string;
  subtitulo?: string;
  overlay?: string;        // opacidad del velo: "bg-black/35", etc.
  heightClass?: string;    // "h-[70vh] md:h-[80vh]" por default
};

export default function VideoInicio({
  videoId,
  startSeconds = 0,
  titulo = '',
  subtitulo,
  overlay = 'bg-black/35',
  heightClass = 'h-[70vh] md:h-[80vh]',
}: Props) {
  const src =
    `https://www.youtube.com/embed/${videoId}` +
    `?start=${startSeconds}&autoplay=1&mute=1&controls=0&playsinline=1` +
    `&loop=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;

  return (
    <section className={`relative w-screen ${heightClass} overflow-hidden`}>
      {/* IFRAME que "cubre" como background */}
      <iframe
        className="yt-cover pointer-events-none"
        src={src}
        title="Video de portada"
        frameBorder="0"
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
      />

      {/* Capa para contraste del texto */}
      <div className={`absolute inset-0 ${overlay}`} />

      {/* Contenido encima */}
      <div className="relative z-10 grid h-full place-items-center px-6 text-center">
        <div className="max-w-4xl">
          {titulo && (
            <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wide">
              {titulo}
            </h1>
          )}
          {subtitulo && (
            <p className="mt-4 text-white/90 text-lg md:text-xl">{subtitulo}</p>
          )}
        </div>
      </div>

      {/* CSS para cubrir sin franjas negras */}
      <style jsx>{`
        .yt-cover {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          /* Por defecto, que intente cubrir con viewport-height */
          width: 177.78vh;   /* 100 * (16/9) */
          height: 100vh;
        }
        /* Si la ventana es más ancha que 16:9, cubrimos por width */
        @media (min-aspect-ratio: 16/9) {
          .yt-cover {
            width: 100vw;
            height: 56.25vw; /* 100 * (9/16) */
          }
        }
      `}</style>
    </section>
  );
}
