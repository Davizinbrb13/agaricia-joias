"use client";

import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    q: "Nunca pensei que comprar joias pudesse ser tão confortável. Atendimento impecável, peças lindíssimas. Já indiquei para todas as amigas.",
    who: "Carolina Santos",
    where: "Saquarema",
  },
  {
    q: "Adorei a experiência. A vendedora trouxe tudo na minha casa e pude experimentar com calma. As peças são maravilhosas e a prata é de qualidade incrível.",
    who: "Mariana Silva",
    where: "Araruama",
  },
  {
    q: "Comprei um conjunto para usar no meu casamento e fiquei encantada. A qualidade da prata 925 é visível. Recomendo de olhos fechados.",
    who: "Fernanda Oliveira",
    where: "São Pedro da Aldeia",
  },
];

export default function HomeTestimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIdx((v) => (v + 1) % TESTIMONIALS.length),
      7000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="testimonials">
      <div className="ag-container">
        <span className="eyebrow" style={{ justifyContent: "center", width: "100%" }}>
          Quem já viveu
        </span>
        <div className="testimonial-wrap">
          {TESTIMONIALS.map((t, i) => (
            <blockquote key={i} className={`testimonial ${i === idx ? "active" : ""}`}>
              <div className="testimonial-mark">&ldquo;</div>
              <p>{t.q}</p>
              <footer>
                <strong>{t.who}</strong>
                <span>{t.where}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="testimonial-dots">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`tdot ${i === idx ? "on" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Depoimento ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
