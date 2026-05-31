export default function ProductLoading() {
  return (
    <section>
      <div className="ag-container">
        <div className="produto-inner">
          {/* Gallery skeleton */}
          <div style={{ width: "100%" }}>
            <div className="skeleton rounded-3xl aspect-square w-full mb-4" />
            <div className="flex gap-3 justify-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton w-[72px] h-[72px] rounded-xl"
                />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="produto-info">
            <div className="skeleton w-24 h-4 mb-6" />
            <div className="skeleton w-3/4 h-12 mb-4" />
            <div className="skeleton w-1/2 h-6 mb-3" />
            <div className="skeleton w-2/3 h-6 mb-8" />
            <div className="skeleton w-32 h-8 mt-2 mb-8" />
            <div className="flex gap-4">
              <div className="skeleton flex-1 h-[50px] rounded-full" />
              <div className="skeleton flex-1 h-[50px] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
