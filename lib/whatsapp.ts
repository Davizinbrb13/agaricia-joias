const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/** Mensagem genérica (home, catálogo, sobre) */
export function getGenericMessage(): string {
  return "Olá! Vi o site de vocês e gostaria de conhecer mais sobre o atendimento VIP em domicílio. 😊";
}

/** Mensagem específica de um produto */
export function getProductMessage(productName: string): string {
  return `Olá! Vi o ${productName} no site e gostaria de saber mais. Vocês atendem em domicílio? 😊`;
}

/** Gera o link do WhatsApp com mensagem pré-preenchida */
export function getWhatsAppUrl(message?: string): string {
  const text = message ?? getGenericMessage();
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Link do WhatsApp para um produto específico */
export function getProductWhatsAppUrl(productName: string): string {
  return getWhatsAppUrl(getProductMessage(productName));
}
