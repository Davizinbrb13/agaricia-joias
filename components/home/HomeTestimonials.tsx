"use client";

import Link from "next/link";

export default function HomeTestimonials() {
  return (
    <section className="testimonials placeholder-testimonials" style={{ padding: '8rem 0', textAlign: 'center' }}>
      <div className="ag-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--serif)' }}>O que as clientes dizem</h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: '1.125rem' }}>Em breve, histórias reais de quem já recebeu a Agaricia em casa.</p>
        <Link href="/contato" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Seja a próxima — agendar visita
        </Link>
      </div>
    </section>
  );
}
