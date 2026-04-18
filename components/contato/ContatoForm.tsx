"use client";

import { useState } from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const PERIODS = ["manhã", "tarde", "noite", "final de semana"];
const INTERESTS = ["anéis", "colares", "brincos", "pulseiras", "conjuntos", "ainda não sei"];

export default function ContatoForm() {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [periodo, setPeriodo] = useState<string>("");
  const [interesse, setInteresse] = useState<string>("");
  const [mensagem, setMensagem] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ nome?: string }>({});

  function validate() {
    const errs: { nome?: string } = {};
    if (!nome.trim()) errs.nome = "Por favor, informe seu nome.";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Foca o primeiro campo inválido
      const firstError = document.getElementById("ct-nome");
      firstError?.focus();
      return;
    }
    setErrors({});
    setSubmitted(true);

    const parts: string[] = ["Olá! Vim pelo site e gostaria de agendar um atendimento."];
    if (nome) parts.push(`\nNome: ${nome}`);
    if (cidade) parts.push(`Cidade: ${cidade}`);
    if (periodo) parts.push(`Melhor período: ${periodo}`);
    if (interesse) parts.push(`Interesse: ${interesse}`);
    if (mensagem) parts.push(`\n${mensagem}`);
    const url = getWhatsAppUrl(parts.join("\n"));

    // Pequeno delay para o usuário ver o estado de loading
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setSubmitted(false);
    }, 600);
  }

  return (
    <form className="contato-form" onSubmit={handleSubmit} noValidate>
      <div className="ct-row">
        <label htmlFor="ct-nome">
          <span>
            Seu nome{" "}
            <span aria-hidden="true" style={{ color: "var(--ocean)" }}>*</span>
          </span>
          <input
            id="ct-nome"
            type="text"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (errors.nome) setErrors({});
            }}
            placeholder="Como podemos te chamar?"
            aria-required="true"
            aria-invalid={!!errors.nome}
            aria-describedby={errors.nome ? "ct-nome-error" : undefined}
            style={{
              borderColor: errors.nome ? "var(--ocean)" : undefined,
            }}
          />
          {errors.nome && (
            <span
              id="ct-nome-error"
              role="alert"
              style={{
                display: "block",
                marginTop: 6,
                fontSize: 13,
                color: "var(--ocean)",
                fontFamily: "var(--sans)",
              }}
            >
              {errors.nome}
            </span>
          )}
        </label>
      </div>

      <div className="ct-row">
        <label htmlFor="ct-cidade">
          <span>Cidade</span>
          <input
            id="ct-cidade"
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Araruama, Saquarema, São Pedro..."
          />
        </label>
      </div>

      <div className="ct-row">
        <span className="ct-label">Melhor período</span>
        <div className="ct-chips" role="group" aria-label="Selecione o melhor período">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              className={`ct-chip ${periodo === p ? "on" : ""}`}
              onClick={() => setPeriodo(periodo === p ? "" : p)}
              aria-pressed={periodo === p}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="ct-row">
        <span className="ct-label">O que você está procurando</span>
        <div className="ct-chips" role="group" aria-label="Selecione o tipo de joia">
          {INTERESTS.map((i) => (
            <button
              key={i}
              type="button"
              className={`ct-chip ${interesse === i ? "on" : ""}`}
              onClick={() => setInteresse(interesse === i ? "" : i)}
              aria-pressed={interesse === i}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="ct-row">
        <label htmlFor="ct-msg">
          <span>Mensagem (opcional)</span>
          <textarea
            id="ct-msg"
            rows={4}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Conte um pouco do que você gostaria..."
          />
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center" }}
        disabled={submitted}
        aria-live="polite"
      >
        {submitted ? "Abrindo WhatsApp..." : "Enviar pelo WhatsApp"}
      </button>
    </form>
  );
}
