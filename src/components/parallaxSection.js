// src/components/parallaxSection.js

export function ParallaxSection({
  bgImage,
  parralaxAnchor,
  sectionEnlargment,
  children,
}) {
  return (
    <div className="relative sm:min-h-(--sh) grid place-items-center bg-fixed bg-cover bg-top max-sm:min-h-250"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        "--sh": `calc(100dvh + ${sectionEnlargment}px)`,
      }}
    >
      <div
        id={parralaxAnchor}
        className="absolute top-2/7 sm:top-1/5 md:top-1/4 lg:top-5/12 xl:top-1/3 w-full"
      />
      {/* Overlay */}
      {/* <div className="[grid-area:1/1] w-full min-h-screen bg-black/40" /> */}

      {/* Treść */}
      <div className="[grid-area:1/1] h-full text-white w-full">{children}</div>
    </div>
  );
}
