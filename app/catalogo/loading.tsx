export default function CatalogoLoading() {
  return (
    <>
      {/* Header skeleton */}
      <header className="cat-header">
        <div className="ag-container">
          <div
            style={{
              width: 120,
              height: 14,
              borderRadius: 4,
              background: 'var(--silver)',
              opacity: 0.4,
              marginBottom: 16,
              animation: 'shimmer-pulse 1.4s ease-in-out infinite',
            }}
          />
          <div
            style={{
              width: 240,
              height: 40,
              borderRadius: 8,
              background: 'var(--silver)',
              opacity: 0.3,
              marginBottom: 12,
              animation: 'shimmer-pulse 1.4s ease-in-out infinite',
            }}
          />
          <div
            style={{
              width: '60%',
              height: 18,
              borderRadius: 4,
              background: 'var(--silver)',
              opacity: 0.25,
              animation: 'shimmer-pulse 1.4s ease-in-out infinite',
            }}
          />
        </div>
      </header>

      {/* Grid skeleton */}
      <section style={{ paddingBottom: 60 }}>
        <div className="ag-container">
          {/* Filter bar skeleton */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 80 + i * 10,
                  height: 36,
                  borderRadius: 20,
                  background: 'var(--silver)',
                  opacity: 0.25,
                  animation: `shimmer-pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="cat-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  borderRadius: 20,
                  background: `linear-gradient(135deg, var(--sand-deep), var(--mist))`,
                  opacity: 0.4,
                  animation: `shimmer-pulse 1.4s ease-in-out ${i * 0.08}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer-pulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="shimmer-pulse"] { animation: none !important; }
        }
      `}</style>
    </>
  )
}
