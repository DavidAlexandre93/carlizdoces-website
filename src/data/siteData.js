export const navItems = [
  { label: 'Quem somos', sectionId: 'quem-somos' },
  { label: 'Novidades', sectionId: 'novidades' },
  { label: 'Instagram', sectionId: 'instagram' },
  { label: 'Depoimentos', sectionId: 'depoimentos' },
  { label: 'Onde estamos', sectionId: 'onde-estamos' },
  { label: 'Realizar pedido', sectionId: 'realizar-pedido' },
  { label: 'Ovos de páscoa', sectionId: 'ovos-de-pascoa' },
  { label: 'Contato', sectionId: 'contato' },
]

export const seasonalProducts = [
  { id: 'brigadeiro', name: 'Brigadeiro Gourmet', flavor: 'Brigadeiro belga', weight: '350g', price: 59, image: '/images/brigadeiro.svg', rating: 4.9, reviewCount: 298 },
  { id: 'ninho-nutella', name: 'Ninho com Nutella', flavor: 'Leite ninho com creme de Nutella', weight: '400g', price: 68.5, image: '/images/ninho-nutella.svg', rating: 4.8, reviewCount: 244 },
  { id: 'prestigio', name: 'Prestígio Cremoso', flavor: 'Coco cremoso com chocolate', weight: '350g', price: 62, image: '/images/prestigio.svg', rating: 4.7, reviewCount: 208 },
  { id: 'ferrero', name: 'Ferrero Crocante', flavor: 'Chocolate com avelã crocante', weight: '450g', price: 72, image: '/images/ferrero.svg', rating: 5, reviewCount: 322 },
  { id: 'trufado-maracuja', name: 'Trufado de Maracujá', flavor: 'Ganache trufada de maracujá', weight: '380g', price: 64, image: '/images/trufado-maracuja.svg', rating: 4.6, reviewCount: 186 },
  { id: 'ninho-uva', name: 'Ninho com Uva', flavor: 'Leite ninho com uvas frescas', weight: '400g', price: 66, image: '/images/ninho-uva.svg', rating: 4.8, reviewCount: 271 },
]


export const updates = [
  {
    id: 'update-1',
    type: 'microinteracoes',
    dateLabel: 'React',
    title: 'Microinterações e transições: Motion',
    description: 'Para dar vida aos componentes sem comprometer a performance geral do projeto.',
    status: 'Ótimo para hover, feedbacks de clique, entrada de cards e pequenos estados animados.',
  },
  {
    id: 'update-2',
    type: 'scroll',
    dateLabel: 'Landing page',
    title: 'Scroll cinematográfico: GSAP + ScrollTrigger',
    description: 'Quando a proposta é contar uma história no scroll, com tempo, ritmo e transições mais marcantes.',
    status: 'Use com parcimônia e otimize assets para manter a experiência fluida.',
  },
  {
    id: 'update-3',
    type: 'ilustracoes',
    dateLabel: 'Design',
    title: 'Ilustrações animadas: Lottie',
    description: 'Ideal quando o time de design já entrega animações vetoriais prontas para o front-end.',
    status: 'Leve, escalável e fácil de integrar em seções de destaque e onboarding.',
  },
  {
    id: 'update-4',
    type: 'reveal',
    dateLabel: 'Entrada simples',
    title: 'Reveal direto ao ponto: animate.css / AOS',
    description: 'Para quando é só um efeito de entrada e não vale montar uma lógica de animação mais complexa.',
    status: 'Resolve rápido, com implementação enxuta e impacto visual imediato.',
  },
]

export const announcementChannels = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/_carlizdoces/', variant: 'contained', external: true },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/5511992175496?text=Oi%2C%20quero%20receber%20as%20novidades%20da%20Carliz%20Doces%21', variant: 'outlined', external: true },
  { id: 'contato', label: 'Falar com a equipe', href: '#contato', variant: 'text', external: false },
]

export const manualTestimonials = [
  { id: 'manual-1', author: 'Carla M.', channel: 'Instagram', message: 'Pedi para o aniversário do meu filho e os brigadeiros fizeram o maior sucesso na festa toda.' },
  { id: 'manual-2', author: 'Juliana F.', channel: 'WhatsApp', message: 'Atendimento rápido, doces lindos e muito saborosos. Já virei cliente fiel da Carliz Doces.' },
]

export const instagramPosts = [
  { id: 'insta-1', imageUrl: '/images/ninho.svg', alt: 'Doces artesanais da Carliz Doces' },
  { id: 'insta-2', imageUrl: '/images/ferrero.svg', alt: 'Ovo de colher da Carliz Doces' },
  { id: 'insta-3', imageUrl: '/images/brigadeiro.svg', alt: 'Brigadeiros da Carliz Doces' },
]

export const topShowcaseSlides = [
  { id: 'matilda', imageUrl: '/images/matilda.svg', alt: 'Bolo da Matilda especial da Carliz Doces', title: 'Bolo da Matilda', description: 'Destaque da semana para os apaixonados por chocolate.', tag: 'Mais pedido' },
  { id: 'ferrero', imageUrl: '/images/ferrero.svg', alt: 'Campanha de sorteio com ovo Ferrero Rocher', title: 'Sorteio Ferrero Rocher', description: 'Promoção especial para quem encomenda ovos de colher.', tag: 'Promoção' },
  { id: 'brigadeiro', imageUrl: '/images/brigadeiro.svg', alt: 'Brigadeiros artesanais da Carliz Doces', title: 'Brigadeiros artesanais', description: 'Sabores para festas e lembranças com a cara da Carliz.', tag: 'Clássico da casa' },
]

export const metrics = [
  ['Pedidos por dia', '120+'],
  ['Sabores disponíveis', '30'],
  ['Eventos atendidos', '450'],
]

export const paymentMethods = ['Pix', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito']
export const instagramProfileLink = 'https://www.instagram.com/_carlizdoces/'
export const whatsappNumber = '5511992175496'
export const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
