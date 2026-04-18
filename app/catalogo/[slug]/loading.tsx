export default function ProductLoading() {
  return (
    <section>
      <div className="ag-container">
        <div className="produto-inner">
          {/* Gallery skeleton */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                aspectRatio: '1',
                borderRadius: 20,
                background: 'linear-gradient(135deg, var(--sand-deep), var(--mist))',
                opacity: 0.4,
                marginBottom: 16,
                animation: 'shimmer-pulse 1.4s ease-in-out infinite',
              }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 10,
                    background: 'var(--silver)',
                    opacity: 0.3,
                    animation: `shimmer-pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="produto-info">
            <div
              style={{
                width: 100,
                height: 14,
                borderRadius: 4,
                background: 'var(--silver)',
                opacity: 0.3,
                marginBottom: 24,
                animation: 'shimmer-pulse 1.4s ease-in-out infinite',
              }}
            />
            {[280, 200, 260].map((w, i) => (
              <div
                key={i}
                style={{
                  width: w,
                  maxWidth: '100%',
                  height: i === 0 ? 48 : 20,
                  borderRadius: 8,
                  background: 'var(--silver)',
                  opacity: 0.3 - i * 0.05,
                  marginBottom: 16,
                  animation: `shimmer-pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
            <div
              style={{
                width: 120,
                height: 32,
                borderRadius: 8,
                background: 'var(--ocean)',
                opacity: 0.2,
                marginTop: 8,
                animation: 'shimmer-pulse 1.4s ease-in-out infinite',
              }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 50,
                    borderRadius: 12,
                    background: 'var(--silver)',
                    opacity: 0.25,
                    animation: `shimmer-pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer-pulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="shimmer-pulse"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
