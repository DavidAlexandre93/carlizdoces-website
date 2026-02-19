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
    quantities: ['50 unidades', '100 unidades'],
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
    quantities: ['50 unidades', '100 unidades'],
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
    quantities: ['50 unidades', '100 unidades'],
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
    quantities: ['50 unidades', '100 unidades'],
    weight: '450g',
    price: 72,
    image: '/images/cardapio-de-pascoa/ferrero.png',
    rating: 5,
    reviewCount: 322,
  },
]

export const updatesCatalog = [
  {
    id: 'bar-de-brigadeiro',
    category: 'lancamento',
    dateLabel: 'Lançamento',
    title: 'Bar de brigadeiro',
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
