/**
 * ===============================================================
 * ARQUIVO DE EDIÇÃO MANUAL RÁPIDA (SEM PRECISAR MEXER EM COMPONENTES)
 * ===============================================================
 *
 * Como usar:
 * 1) Para adicionar IMAGENS dinâmicas: coloque os arquivos em `public/images/pedidos-de-doces`, `public/images/cardapio-de-pascoa` e `public/images/novidades`.
 * 2) O site lê essas pastas automaticamente e cria cards/carrossel sem mexer nos componentes.
 * 3) Use `productsCatalog` e `updatesCatalog` como OVERRIDES (texto, preço, descrição, etc.) para cada imagem.
 * 4) Para remover um item da interface, basta remover a imagem correspondente da pasta.
 *
 * Regras simples:
 * - `id` deve ser único (sem espaços, use hífen).
 * - `price` deve ser número (ex.: 59.9).
 * - As imagens precisam existir na pasta /public.
 */

export const productsCatalog = [
  {
    id: 'brigadeiro-gourmet',
    name: 'Brigadeiro Gourmet',
    shortDescription: 'Brigadeiro belga tradicional com textura cremosa.',
    details: 'Ideal para festas, lembrancinhas e presentes.',
    weight: '350g',
    price: 59,
    image: '/images/pedidos-de-doces/brigadeiro.png',
    rating: 4.9,
    reviewCount: 298,
  },
  {
    id: 'ninho-com-nutella',
    name: 'Ninho com Nutella',
    shortDescription: 'Leite ninho com recheio cremoso de Nutella.',
    details: 'Um dos sabores mais pedidos para datas especiais.',
    weight: '400g',
    price: 68.5,
    image: '/images/pedidos-de-doces/ninho-nutella.png',
    rating: 4.8,
    reviewCount: 244,
  },
  {
    id: 'prestigio-cremoso',
    name: 'Prestígio Cremoso',
    shortDescription: 'Coco cremoso com cobertura de chocolate.',
    details: 'Sabor equilibrado para quem gosta de coco e chocolate juntos.',
    weight: '350g',
    price: 62,
    image: '/images/instagram/prestigio.png',
    rating: 4.7,
    reviewCount: 208,
  },
  {
    id: 'ferrero-crocante',
    name: 'Ferrero Crocante',
    shortDescription: 'Chocolate com avelã e crocância especial.',
    details: 'Excelente opção para presentear e surpreender.',
    weight: '450g',
    price: 72,
    image: '/images/cardapio-de-pascoa/ferrero.png',
    rating: 5,
    reviewCount: 322,
  },
]

export const updatesCatalog = [
  {
    id: 'novidade-1',
    category: 'promocao',
    dateLabel: 'Semana atual',
    title: 'Combo de brigadeiros com desconto',
    imageUrl: '/images/novidades/ninho-uva.png',
    imageAlt: 'Divulgação de combo de brigadeiros artesanais',
    mediaDescription: 'Promoção válida para pedidos antecipados via WhatsApp.',
    description: 'Monte seu combo com 3 sabores e ganhe preço especial no pedido.',
    status: 'Consulte disponibilidade para a sua data.',
  },
  {
    id: 'novidade-2',
    category: 'lancamento',
    dateLabel: 'Lançamento',
    title: 'Novo sabor ninho com uva',
    imageUrl: '/images/novidades/ninho-uva.png',
    imageAlt: 'Doce de ninho com uva da Carliz Doces',
    mediaDescription: 'Sabor novo feito com recheio cremoso e uvas frescas.',
    description: 'Perfeito para quem gosta de doces mais suaves e frutados.',
    status: 'Disponível sob encomenda.',
  },
  {
    id: 'novidade-3',
    category: 'comunicado',
    dateLabel: 'Encomendas',
    title: 'Agenda para eventos e festas',
    imageUrl: '/images/novidades/divulgacao-ovo-pascoa.png',
    imageAlt: 'Divulgação de encomendas para festas',
    mediaDescription: 'Reserve sua data com antecedência para garantir entrega.',
    description: 'Atendemos aniversários, eventos corporativos e datas comemorativas.',
    status: 'Fale com a equipe para orçamento rápido.',
  },
]
