import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import ProductGrid from "@/components/product/ProductGrid";
import JsonLd from "@/components/seo/JsonLd";
import { getFeaturedProducts } from "@/lib/queries";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Agaricia Jóias";
const city = process.env.NEXT_PUBLIC_STORE_CITY ?? "Araruama";
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export const revalidate = 60;

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: storeName,
    description: `Joias de prata 925 com atendimento VIP em domicílio em ${city} e Região dos Lagos, RJ`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: "RJ",
      addressCountry: "BR",
    },
    telephone: `+55${whatsappNumber}`,
    url: typeof window !== "undefined" ? window.location.origin : "",
    priceRange: "$$",
    openingHours: "Mo-Sa 09:00-18:00",
  };

  return (
    <>
      <JsonLd data={localBusinessSchema} />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 via-brand-dark/50 to-brand-dark/70 z-10" />
        {/* Decorative background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNjNGE4ODIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        {/* Background color */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a2e28] via-[#4a3b33] to-[#2C2420]" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-block px-4 py-2 text-xs sm:text-sm font-medium tracking-[0.25em] uppercase text-brand-accent/90 border border-brand-accent/30 rounded-full mb-8">
              ✨ Atendimento VIP em Domicílio
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight">
              {storeName}
            </h1>
            <p className="mt-2 font-serif text-xl sm:text-2xl md:text-3xl text-brand-accent italic">
              Joias de Prata para Mulheres que se Cuidam
            </p>
            <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              Levamos o mostruário até você — na sua casa, no trabalho ou em eventos sociais. Escolha com calma e conforto.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/catalogo" variant="primary" size="lg">
                Ver Catálogo
              </Button>
              <Button href={getWhatsAppUrl()} variant="whatsapp" size="lg" external>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Falar no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionTitle
            title="Como Funciona"
            subtitle="Um atendimento exclusivo, pensado para o seu conforto"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                  </svg>
                ),
                title: "Escolha no Site",
                desc: "Navegue pelo nosso catálogo e selecione as peças que mais combinam com você.",
              },
              {
                step: "02",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                  </svg>
                ),
                title: "Agendamos uma Visita",
                desc: "Combinamos o melhor dia e horário para levar o mostruário até você.",
              },
              {
                step: "03",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                  </svg>
                ),
                title: "Experimente em Casa",
                desc: "Com calma e conforto, experimente cada peça. Sem pressa, sem compromisso.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-secondary/20 text-brand-primary rounded-2xl mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-brand-accent tracking-widest mb-2">
                  PASSO {item.step}
                </div>
                <h3 className="font-serif text-xl text-brand-dark mb-3">
                  {item.title}
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUTOS EM DESTAQUE ===== */}
      {featuredProducts.length > 0 && (
        <section className="section-padding">
          <div className="container-narrow">
            <SectionTitle
              title="Destaques"
              subtitle="Peças selecionadas especialmente para você"
            />
            <ProductGrid products={featuredProducts} />
            <div className="text-center mt-12">
              <Button href="/catalogo" variant="outline" size="lg">
                Ver Catálogo Completo →
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ===== DEPOIMENTOS ===== */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionTitle
            title="O que Dizem Nossas Clientes"
            subtitle="A satisfação de quem já conhece o atendimento VIP"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: "Mariana Silva",
                city: "Araruama",
                text: "Adorei a experiência! A vendedora trouxe tudo na minha casa e pude experimentar com calma. As peças são maravilhosas e a prata é de qualidade incrível.",
              },
              {
                name: "Carolina Santos",
                city: "Saquarema",
                text: "Nunca pensei que comprar joias pudesse ser tão confortável. O atendimento é impecável e as peças são lindíssimas. Já indiquei para todas as amigas!",
              },
              {
                name: "Fernanda Oliveira",
                city: "São Pedro da Aldeia",
                text: "Comprei um conjunto para usar no meu casamento e fiquei encantada. A qualidade da prata 925 é visível. Recomendo de olhos fechados!",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="glass-card p-6 sm:p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-brand-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-brand-dark/80 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>
                <footer>
                  <p className="font-semibold text-brand-dark text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-brand-muted text-xs">{testimonial.city}</p>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-muted to-brand-accent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Quer experimentar em casa?
          </h2>
          <p className="text-white/80 text-lg sm:text-xl mb-10 leading-relaxed">
            Agende uma visita sem compromisso. Levamos as melhores peças de prata 925 até você em {city} e Região dos Lagos.
          </p>
          <Button
            href={getWhatsAppUrl()}
            variant="whatsapp"
            size="lg"
            external
            className="text-lg px-10 py-5"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Agendar Visita pelo WhatsApp
          </Button>
        </div>
      </section>
    </>
  );
}
