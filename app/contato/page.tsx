import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Araruama";
const state = process.env.NEXT_PUBLIC_STORE_STATE ?? "RJ";

export const metadata: Metadata = {
  title: "Contato",
  description: `Entre em contato com a ${storeName}. Atendimento VIP em domicílio em ${city} e Região dos Lagos, ${state}. Fale conosco pelo WhatsApp.`,
};

export default function ContatoPage() {
  return (
    <div className="section-padding">
      <div className="container-narrow">
        <SectionTitle
          title="Fale Conosco"
          subtitle="Estamos prontas para te atender"
        />

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {/* WhatsApp Card */}
            <div className="glass-card p-6 sm:p-8">
              <h3 className="font-serif text-xl text-brand-dark mb-4">
                WhatsApp (Preferencial)
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-6">
                O jeito mais rápido de falar com a gente. Resposta garantida em até 2 horas durante o horário comercial.
              </p>
              <Button href={getWhatsAppUrl()} variant="whatsapp" size="lg" external className="w-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Falar Agora no WhatsApp
              </Button>
            </div>

            {/* Business info */}
            <div className="glass-card p-6 sm:p-8">
              <h3 className="font-serif text-xl text-brand-dark mb-4">
                Informações
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                  </svg>
                  <div>
                    <p className="font-medium text-brand-dark">Localização</p>
                    <p className="text-brand-muted">{city}, {state} — Região dos Lagos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p className="font-medium text-brand-dark">Horário de Atendimento</p>
                    <p className="text-brand-muted">Segunda a Sábado: 9h às 18h</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.079-.504 1.005-1.12l-1.062-8.852A1.875 1.875 0 0018.555 7.5H5.945a1.875 1.875 0 00-1.858 1.778L3.025 18.13A1.125 1.125 0 004.031 19.25H5.25m14.25 0a1.5 1.5 0 01-3 0"/>
                  </svg>
                  <div>
                    <p className="font-medium text-brand-dark">Atendimento em Domicílio</p>
                    <p className="text-brand-muted">{city}, Saquarema, São Pedro da Aldeia, Cabo Frio e região</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Map */}
          <div className="glass-card overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117692.99826506728!2d-42.41419!3d-22.8727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x97831e68e8da43%3A0x59a3c4d76f6a88b7!2sAraruama%2C%20RJ!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa de ${city}, ${state}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
