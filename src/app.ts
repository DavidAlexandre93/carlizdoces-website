import React, { useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { QueryClient, QueryClientProvider, useQuery } from 'https://esm.sh/@tanstack/react-query@5.59.16';
import htm from 'https://esm.sh/htm@3.1.1';
import { BRL, EASTER_ENABLED_DEFAULT, PHONE, fetchCatalog } from './catalog-data.js';
import type { CatalogData, Product } from './catalog-data.js';

const html = htm.bind(React.createElement);
const queryClient = new QueryClient();

type Cart = Record<string, number>;

interface SelectedProduct extends Product {
  qty: number;
}

interface ProductCardProps {
  product: Product;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  badge?: string;
}

interface EasterToggleProps {
  showEaster: boolean;
  onToggle: () => void;
}

interface OrderSummaryProps {
  selectedProducts: SelectedProduct[];
  subtotal: number;
  onSend: () => void;
}

function Header() {
  return html`<section className="rounded-3xl bg-gradient-to-r from-carliz-pink to-fuchsia-400 p-6 text-white shadow-lg md:p-10">
    <p className="mb-2 text-sm font-medium uppercase tracking-wider">Landing page oficial</p>
    <h1 className="mb-2 text-4xl font-black">Carliz doces</h1>
    <p className="max-w-2xl text-white/95">Doces artesanais para momentos especiais. Monte seu pedido e envie direto no WhatsApp em um clique.</p>
  </section>`;
}

function ProductCard({ product, qty, onAdd, onRemove, badge }: ProductCardProps) {
  return html`
    <article className="rounded-2xl border border-carliz-pink/20 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-carliz-dark">${product.name}</h3>
        ${badge ? html`<span className="rounded-full bg-carliz-pink px-2 py-1 text-xs font-medium text-white">${badge}</span>` : null}
      </div>
      <p className="mb-3 text-lg font-bold text-carliz-pink">${BRL.format(product.price)}</p>
      <div className="flex items-center gap-3">
        <button
          onClick=${onRemove}
          className="h-9 w-9 rounded-full border border-carliz-pink text-lg text-carliz-pink transition hover:bg-carliz-soft"
          aria-label=${`Remover uma unidade de ${product.name}`}
        >
          -
        </button>
        <span className="min-w-8 text-center text-base font-semibold">${qty}</span>
        <button
          onClick=${onAdd}
          className="h-9 w-9 rounded-full bg-carliz-pink text-lg text-white transition hover:brightness-110"
          aria-label=${`Adicionar uma unidade de ${product.name}`}
        >
          +
        </button>
      </div>
    </article>
  `;
}

function EasterToggle({ showEaster, onToggle }: EasterToggleProps) {
  return html`
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-carliz-dark">Produtos de Páscoa</h2>
          <p className="text-sm text-slate-600">Ative/desative facilmente ou use <code>?pascoa=off</code> na URL.</p>
        </div>
        <button
          onClick=${onToggle}
          className=${`rounded-full px-5 py-2 text-sm font-semibold text-white ${showEaster ? 'bg-emerald-500' : 'bg-slate-500'}`}
        >
          ${showEaster ? 'Páscoa ON' : 'Páscoa OFF'}
        </button>
      </div>
    </section>
  `;
}

function OrderSummary({ selectedProducts, subtotal, onSend }: OrderSummaryProps) {
  return html`
    <section className="mt-8 rounded-2xl bg-white p-5 shadow-md">
      <h2 className="text-2xl font-bold text-carliz-dark">Resumo do pedido</h2>
      ${selectedProducts.length
        ? html`<ul className="mt-4 space-y-2 text-sm text-slate-700">
              ${selectedProducts.map((item: SelectedProduct) =>
                html`<li key=${item.id}>${item.qty}x ${item.name} — <strong>${BRL.format(item.qty * item.price)}</strong></li>`
              )}
            </ul>
            <p className="mt-4 text-lg font-bold text-carliz-pink">Total: ${BRL.format(subtotal)}</p>`
        : html`<p className="mt-4 text-slate-600">Nenhum item selecionado ainda.</p>`}

      <button
        onClick=${onSend}
        className="mt-6 w-full rounded-xl bg-carliz-pink px-4 py-3 text-base font-bold text-white transition hover:brightness-110"
      >
        Realizar solicitação no WhatsApp
      </button>
    </section>
  `;
}

function App() {
  const urlFlag = new URLSearchParams(window.location.search).get('pascoa');
  const [showEaster, setShowEaster] = useState(urlFlag === 'off' ? false : EASTER_ENABLED_DEFAULT) as [boolean, (value: boolean | ((current: boolean) => boolean)) => void];
  const [cart, setCart] = useState({}) as [Cart, (update: (current: Cart) => Cart) => void];

  const queryResult = useQuery({
    queryKey: ['catalog'],
    queryFn: fetchCatalog,
  }) as { data?: CatalogData; isLoading: boolean };

  const { data, isLoading } = queryResult;

  const allProducts = useMemo(() => {
    if (!data) {
      return [] as Product[];
    }

    return showEaster ? [...data.regularProducts, ...data.easterProducts] : [...data.regularProducts];
  }, [data, showEaster]) as Product[];

  const selectedProducts = useMemo(
    () => allProducts.filter((item: Product) => (cart[item.id] || 0) > 0).map((item: Product) => ({ ...item, qty: cart[item.id] || 0 })),
    [allProducts, cart]
  ) as SelectedProduct[];

  const subtotal = selectedProducts.reduce((total: number, item: SelectedProduct) => total + item.qty * item.price, 0);

  const updateQty = (id: string, increment: number): void => {
    setCart((current: Cart) => {
      const next = Math.max((current[id] || 0) + increment, 0);
      return { ...current, [id]: next };
    });
  };

  const sendWhatsAppOrder = (): void => {
    if (!selectedProducts.length) {
      window.alert('Selecione ao menos um produto antes de realizar o pedido.');
      return;
    }

    const items = selectedProducts
      .map((item: SelectedProduct) => `- ${item.name} | Qtd: ${item.qty} | ${BRL.format(item.price * item.qty)}`)
      .join('%0A');

    const message = `Olá, Carliz doces! Tenho interesse em realizar um pedido:%0A%0A${items}%0A%0ATotal estimado: ${BRL.format(subtotal)}.%0A%0APode me ajudar com disponibilidade, entrega e pagamento?`;

    window.open(`https://wa.me/${PHONE}?text=${message}`, '_blank');
  };

  if (isLoading || !data) {
    return html`<main className="mx-auto max-w-4xl p-8"><p className="text-center text-carliz-dark">Carregando cardápio...</p></main>`;
  }

  return html`
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 md:px-8">
      <${Header} />
      <${EasterToggle} showEaster=${showEaster} onToggle=${() => setShowEaster((value: boolean) => !value)} />

      <section className="mt-6">
        <h2 className="mb-4 text-2xl font-bold text-carliz-dark">Escolha seus produtos</h2>
        <div className="grid gap-4 md:grid-cols-2">
          ${data.regularProducts.map(
            (product: Product) => html`<${ProductCard}
              key=${product.id}
              product=${product}
              qty=${cart[product.id] || 0}
              onAdd=${() => updateQty(product.id, 1)}
              onRemove=${() => updateQty(product.id, -1)}
            />`
          )}
          ${showEaster
            ? data.easterProducts.map(
                (product: Product) => html`<${ProductCard}
                  key=${product.id}
                  product=${product}
                  qty=${cart[product.id] || 0}
                  onAdd=${() => updateQty(product.id, 1)}
                  onRemove=${() => updateQty(product.id, -1)}
                  badge="Páscoa"
                />`
              )
            : null}
        </div>
      </section>

      <${OrderSummary} selectedProducts=${selectedProducts} subtotal=${subtotal} onSend=${sendWhatsAppOrder} />
    </main>
  `;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento #root não encontrado para renderizar o app.');
}

createRoot(rootElement).render(html`<${QueryClientProvider} client=${queryClient}><${App} /></${QueryClientProvider}>`);
