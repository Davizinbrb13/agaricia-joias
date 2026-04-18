'use client'

import { useEffect } from 'react'

export default function Error({
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
    <div className="section-padding min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          className="mx-auto mb-6"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="28" stroke="var(--ocean)" strokeWidth="1.5" opacity="0.4" />
          <path d="M32 20v16" stroke="var(--ocean)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="42" r="2" fill="var(--ocean)" />
        </svg>
        <h2 className="font-serif text-4xl text-brand-dark mb-4">
          Algo deu errado
        </h2>
        <p className="text-brand-muted mb-8 leading-relaxed">
          Ocorreu um erro inesperado. Tente novamente ou volte ao início.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn btn-primary"
          >
            Tentar novamente
          </button>
          <a href="/" className="btn btn-ghost">
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  )
}
