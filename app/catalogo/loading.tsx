export default function CatalogoLoading() {
  return (
    <>
      {/* Header skeleton */}
      <header className="cat-header">
        <div className="ag-container flex flex-col items-center">
          <div className="skeleton w-32 h-4 mb-4" />
          <div className="skeleton w-64 h-12 mb-3" />
          <div className="skeleton w-1/2 h-5 mb-8" />
        </div>
      </header>

      {/* Grid skeleton */}
      <section style={{ paddingBottom: 60 }}>
        <div className="ag-container">
          {/* Filter bar skeleton */}
          <div className="flex gap-3 mb-10 flex-wrap justify-center sm:justify-start">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-9 rounded-full"
                style={{ width: `${80 + i * 15}px` }}
              />
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="cat-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="skeleton rounded-3xl aspect-[1/1.15]"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
