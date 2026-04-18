'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f7f3ea', color: '#0f2444', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: '0 24px' }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            style={{ margin: '0 auto 24px' }}
            aria-hidden="true"
          >
            <circle cx="32" cy="32" r="28" stroke="#3d6b9c" strokeWidth="1.5" opacity="0.4" />
            <path d="M32 20v16" stroke="#3d6b9c" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="42" r="2" fill="#3d6b9c" />
          </svg>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, marginBottom: 12 }}>
            Erro crítico
          </h2>
          <p style={{ color: '#8a92a0', marginBottom: 32, lineHeight: 1.6 }}>
            Ocorreu um erro inesperado na aplicação.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#3d6b9c',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 28px',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
