'use client';

type Props = {
  videoUrl: string;
  titulo: string;
  subtitulo?: string;
  overlay?: string;
  heightClass?: string;
};

export default function VideosCategorias({
  videoUrl,
  titulo,
  subtitulo,
  overlay = 'bg-black/35',
  heightClass = 'h-[70vh] md:h-[80vh]',
}: Props) {
  const videoId = videoUrl.split('/embed/')[1];

  const src =
    `${videoUrl}?autoplay=1&mute=1&controls=0&playsinline=1` +
    `&loop=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;

  return (
    <section className={`relative w-screen ${heightClass} overflow-hidden`}>
      <iframe
        className="yt-cover pointer-events-none"
        src={src}
        title={`Video ${titulo}`}
        frameBorder="0"
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
      />

      <div className={`absolute inset-0 ${overlay}`} />

      <div className="relative z-10 grid h-full place-items-center px-6 text-center">
        <div className="max-w-4xl">
          <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wide">
            {titulo}
          </h1>
          {subtitulo && (
            <p className="mt-4 text-white/90 text-lg md:text-xl">{subtitulo}</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .yt-cover {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 177.78vh;
          height: 100vh;
        }
        @media (min-aspect-ratio: 16/9) {
          .yt-cover {
            width: 100vw;
            height: 56.25vw;
          }
        }
      `}</style>
    </section>
  );
}
