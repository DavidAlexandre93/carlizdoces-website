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
    type: 'sorteio',
    dateLabel: 'até 31/03',
    title: 'Sorteio Páscoa Premiada',
    description: 'A cada R$ 50 em pedidos de Páscoa você recebe um número para concorrer a um ovo de colher especial da casa.',
    status: 'Resultado ao vivo no Instagram em 01/04 às 20h.',
  },
  {
    id: 'update-2',
    type: 'promocao',
    dateLabel: 'válido nesta semana',
    title: 'Combo em dobro para festas',
    description: 'Na compra de 2 kits festa de brigadeiros, você ganha 10 mini doces personalizados para complementar sua mesa.',
    status: 'Promoção limitada enquanto durar o estoque de sabores do dia.',
  },
  {
    id: 'update-3',
    type: 'ganhador',
    dateLabel: 'último resultado',
    title: 'Ganhadora confirmada: Juliana F.',
    description: 'Parabéns para a Juliana F., contemplada no último sorteio mensal de caixa premium com trufas artesanais.',
    status: 'Confira o vídeo completo e a validação no destaque “Ganhadores”.',
  },
  {
    id: 'update-4',
    type: 'divulgacao',
    dateLabel: 'aviso geral',
    title: 'Calendário de encomendas atualizado',
    description: 'Agora divulgamos as datas de fechamento por campanha com antecedência para facilitar seu planejamento.',
    status: 'Ative as notificações para acompanhar cada abertura de agenda.',
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
