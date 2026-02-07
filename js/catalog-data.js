export const PHONE = '5511992175496';
export const EASTER_ENABLED_DEFAULT = true;
export const regularProducts = [
    { id: 'brigadeiro-12', name: 'Caixa com 12 brigadeiros gourmet', price: 32 },
    { id: 'beijinho-12', name: 'Caixa com 12 beijinhos', price: 30 },
    { id: 'bento', name: 'Bento cake personalizado', price: 55 },
    { id: 'mini-bolo', name: 'Mini bolo caseiro (400g)', price: 28 },
    { id: 'copo-da-felicidade', name: 'Copo da felicidade', price: 18 },
];
export const easterProducts = [
    { id: 'ninho-uva-250', name: 'Ovo de colher Ninho com uva (250g)', price: 75 },
    { id: 'ninho-nutella-250', name: 'Ovo de colher Ninho com Nutella (250g)', price: 89 },
    { id: 'ferrero-250', name: 'Ovo de colher Ferrero Rocher (250g)', price: 95 },
    { id: 'trufado-ninho-150', name: 'Ovo trufado Ninho com Nutella (150g)', price: 37 },
    { id: 'petisqueira-4', name: 'Petisqueira 4 sabores (limitado)', price: 39.99 },
];
export const BRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});
export async function fetchCatalog() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { regularProducts, easterProducts };
}
