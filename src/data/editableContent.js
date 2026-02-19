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
    id: 'ninho-com-uva-pascoa',
    name: 'Ninho com uva',
    shortDescription: 'Ovo de páscoa de ninho com recheio de uva.',
    details: 'Peso: 250g • Valor: R$ 75,00.',
    weight: '250g',
    price: 75,
    image: '/images/cardapio-de-pascoa/ninho-com-uva.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'ninho-com-nutela-pascoa',
    name: 'Ninho com nutela',
    shortDescription: 'Ovo de páscoa de ninho com recheio cremoso de nutela.',
    details: 'Peso: 250g • Valor: R$ 89,00.',
    weight: '250g',
    price: 89,
    image: '/images/cardapio-de-pascoa/ninho-com-nutela.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'ninho-pascoa',
    name: 'Ninho',
    shortDescription: 'Ovo de páscoa sabor ninho.',
    details: 'Peso: 250g • Valor: R$ 69,00.',
    weight: '250g',
    price: 69,
    image: '/images/cardapio-de-pascoa/ninho.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'brigadeiro-pascoa',
    name: 'Brigadeiro',
    shortDescription: 'Ovo de páscoa recheado com brigadeiro.',
    details: 'Peso: 250g • Valor: R$ 69,00.',
    weight: '250g',
    price: 69,
    image: '/images/cardapio-de-pascoa/brigadeiro.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'ferrero-rocher-pascoa',
    name: 'Ferrero rocher',
    shortDescription: 'Ovo de páscoa inspirado no sabor ferrero rocher.',
    details: 'Peso: 250g • Valor: R$ 95,00.',
    weight: '250g',
    price: 95,
    image: '/images/cardapio-de-pascoa/ferreiro-rocher.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'prestigio-pascoa',
    name: 'Prestigio',
    shortDescription: 'Ovo de páscoa com recheio de coco e chocolate.',
    details: 'Peso: 250g • Valor: R$ 69,00.',
    weight: '250g',
    price: 69,
    image: '/images/cardapio-de-pascoa/prestigio.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'matilda-pascoa',
    name: 'Matilda',
    shortDescription: 'Ovo de páscoa sabor matilda.',
    details: 'Peso: 250g • Valor: R$ 67,00.',
    weight: '250g',
    price: 67,
    image: '/images/cardapio-de-pascoa/matilda.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'mms-pascoa',
    name: 'M&Ms',
    shortDescription: 'Ovo de páscoa com cobertura e confeitos M&Ms.',
    details: 'Peso: 250g • Valor: R$ 69,00.',
    weight: '250g',
    price: 69,
    image: '/images/cardapio-de-pascoa/m&m.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'guloseimas-pascoa',
    name: 'Guloseimas',
    shortDescription: 'Ovo de páscoa com mix de guloseimas.',
    details: 'Peso: 250g • Valor: R$ 79,00.',
    weight: '250g',
    price: 79,
    image: '/images/cardapio-de-pascoa/guloseimas.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'trufado-ninho-com-nutella',
    name: 'Trufado ninho com nutella',
    shortDescription: 'Ovo trufado sabor ninho com nutella.',
    details: 'Peso: 150g • Valor: R$ 37,00.',
    weight: '150g',
    price: 37,
    image: '/images/cardapio-de-pascoa/trufado-ninho-com-nutela-mouse-maracuja-brigadeiro.jpeg',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'trufado-brigadeiro',
    name: 'Trufado brigadeiro',
    shortDescription: 'Ovo trufado recheado com brigadeiro.',
    details: 'Peso: 150g • Valor: R$ 34,00.',
    weight: '150g',
    price: 34,
    image: '/images/cardapio-de-pascoa/trufado-ninho-com-nutela-mouse-maracuja-brigadeiro.jpeg?versao=brigadeiro',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'trufado-mouse-maracuja-fruta',
    name: 'Trufado mouse maracujá (fruta)',
    shortDescription: 'Ovo trufado sabor mouse maracujá (fruta).',
    details: 'Peso: 150g • Valor: R$ 30,00.',
    weight: '150g',
    price: 30,
    image: '/images/cardapio-de-pascoa/trufado-ninho-com-nutela-mouse-maracuja-brigadeiro.jpeg?versao=maracuja',
    rating: 5,
    reviewCount: 0,
  },
  {
    id: 'petisqueira-4-sabores',
    name: 'Petisqueira 4 sabores',
    shortDescription: 'Petisqueira com 4 sabores (limitado).',
    details: 'Edição limitada • Valor: R$ 39,99.',
    weight: 'Limitado',
    price: 39.99,
    image: '/images/cardapio-de-pascoa/petisqueira.jpeg',
    rating: 5,
    reviewCount: 0,
  },
]


export const updatesCatalog = [
  {
    id: 'bar-de-brigadeiro',
    category: 'lancamento',
    dateLabel: 'Lançamento',
    title: 'Novidade chegando Bar de Brigadeiro',
    imageUrl: '/images/novidades/bar-de-brigadeiro.jpeg',
    imageAlt: 'Bar de brigadeiro da Carliz Doces',
    mediaDescription: 'Novo formato para servir brigadeiros em eventos e comemorações.',
    description: 'Conheça o bar de brigadeiro e surpreenda seus convidados com sabores artesanais.',
    status: 'Disponível sob consulta.',
  },
  {
    id: 'brigadeiros',
    category: 'comunicado',
    dateLabel: 'Comunicado',
    title: 'Faça sua encomenda de Brigadeiros!',
    imageUrl: '/images/novidades/brigadeiros.jpeg',
    imageAlt: 'Brigadeiros da Carliz Doces',
    mediaDescription: 'Comunicado oficial sobre encomendas e disponibilidade de brigadeiros.',
    description: 'Entre em contato para confirmar sabores disponíveis e prazos de produção.',
    status: 'Atendimento via WhatsApp.',
  },
  {
    id: 'sorteio-ovo-pascoa',
    category: 'sorteio',
    dateLabel: 'Sorteio',
    title: 'Sorteio de ovo de páscoa',
    imageUrl: '/images/novidades/sorteio-ovo-pascoa.jpeg',
    imageAlt: 'Sorteio de ovo de páscoa da Carliz Doces',
    mediaDescription: 'Participe do sorteio acompanhando os canais oficiais da Carliz Doces.',
    description: 'Confira as regras do sorteio e participe para concorrer a um ovo de páscoa especial.',
    status: 'Veja o regulamento nas redes sociais.',
  },
]
