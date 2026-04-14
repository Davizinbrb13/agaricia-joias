import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Araruama";
const state = process.env.NEXT_PUBLIC_STORE_STATE ?? "RJ";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: `Conheça a ${storeName} — joias de prata 925 com atendimento VIP em domicílio em ${city} e Região dos Lagos, ${state}. Nossa história e nosso diferencial.`,
};

export default function SobrePage() {
  return (
    <div className="section-padding">
      <div className="container-narrow">
        <SectionTitle
          title="Nossa História"
          subtitle={`Conheça a ${storeName} e nosso modelo exclusivo de atendimento`}
        />

        <div className="max-w-3xl mx-auto space-y-12">
          {/* Story */}
          <div className="glass-card p-8 sm:p-10">
            <h3 className="font-serif text-2xl text-brand-dark mb-4">
              Quem Somos
            </h3>
            <div className="space-y-4 text-brand-dark/70 leading-relaxed">
              <p>
                A <strong className="text-brand-dark">{storeName}</strong> nasceu do amor
                pela beleza e pela prata. Somos uma joalheria feminina especializada em
                peças de <strong className="text-brand-dark">prata 925</strong>, cuidadosamente
                selecionadas para mulheres que valorizam elegância, qualidade e conforto.
              </p>
              <p>
                Atuamos em <strong className="text-brand-dark">{city}</strong> e em toda a
                <strong className="text-brand-dark"> Região dos Lagos, {state}</strong>,
                com um modelo de atendimento que é nosso grande diferencial: o
                <strong className="text-brand-primary"> atendimento VIP em domicílio</strong>.
              </p>
            </div>
          </div>

          {/* Differentials */}
          <div className="glass-card p-8 sm:p-10">
            <h3 className="font-serif text-2xl text-brand-dark mb-4">
              O Atendimento &ldquo;Malinha&rdquo;
            </h3>
            <div className="space-y-4 text-brand-dark/70 leading-relaxed">
              <p>
                Nosso modelo exclusivo funciona assim: levamos o mostruário completo até
                você — na sua casa, no trabalho, ou em eventos sociais como chás de panela,
                aniversários e reuniões de amigas.
              </p>
              <p>
                Você experimenta cada peça com calma, sem pressa e sem compromisso, no
                conforto do seu ambiente. É uma experiência personalizada e intimista,
                como uma amiga que entende de joias e quer te ajudar a brilhar.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "✨",
                title: "Qualidade",
                desc: "Todas as peças são em prata 925, com garantia de autenticidade.",
              },
              {
                icon: "💝",
                title: "Atendimento",
                desc: "Personalizado, no seu tempo e no seu espaço favorito.",
              },
              {
                icon: "🤝",
                title: "Confiança",
                desc: "Transparência nos preços e satisfação garantida.",
              },
            ].map((value) => (
              <div key={value.title} className="glass-card p-6 text-center">
                <span className="text-3xl block mb-3">{value.icon}</span>
                <h4 className="font-serif text-lg text-brand-dark mb-2">
                  {value.title}
                </h4>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-brand-muted mb-6 text-lg">
              Ficou interessada? Vamos marcar um atendimento!
            </p>
            <Button href={getWhatsAppUrl()} variant="whatsapp" size="lg" external>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Agendar Atendimento
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
