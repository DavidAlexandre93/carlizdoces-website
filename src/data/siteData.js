import { imageCollections } from './generatedImages'
import { productsCatalog, updatesCatalog } from './editableContent'

const toTitleFromSlug = (value) =>
  value
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const normalizeKey = (value = '') => String(value).trim().toLowerCase()

const toProductFallback = (image, index) => {
  const baseName = toTitleFromSlug(image.slug || image.label || `Doce ${index + 1}`)

  return {
    id: image.id || `produto-${index + 1}`,
    name: baseName,
    shortDescription: `Doce artesanal sabor ${baseName}.`,
    details: 'Consulte tamanhos, personalizações e disponibilidade para a sua data.',
    weight: 'Sob encomenda',
    price: 0,
    image: image.imageUrl,
    rating: 5,
    reviewCount: 0,
  }
}

const mapProductOverrides = () => {
  const mapByImage = new Map()
  const mapById = new Map()

  productsCatalog.forEach((product) => {
    if (product.image) {
      mapByImage.set(normalizeKey(product.image), product)
    }

    if (product.id) {
      mapById.set(normalizeKey(product.id), product)
    }
  })

  return { mapByImage, mapById }
}

const productImages = [
  ...(imageCollections['pedidos-de-doces'] ?? []),
  ...(imageCollections['cardapio-de-pascoa'] ?? []),
]

const { mapByImage: productOverridesByImage, mapById: productOverridesById } = mapProductOverrides()

const autoProducts = productImages.map((image, index) => {
  const override =
    productOverridesByImage.get(normalizeKey(image.imageUrl)) ||
    productOverridesById.get(normalizeKey(image.id))

  return {
    ...toProductFallback(image, index),
    ...override,
    image: image.imageUrl,
    id: override?.id || image.id || `produto-${index + 1}`,
  }
})

const usedProductKeys = new Set(autoProducts.map((product) => normalizeKey(product.image)))

const extraManualProducts = productsCatalog.filter((product) => !usedProductKeys.has(normalizeKey(product.image)))

const dynamicProductsCatalog = [...autoProducts, ...extraManualProducts]

const updateTypeFromSlug = (slug = '') => {
  if (slug.includes('promo') || slug.includes('desconto') || slug.includes('combo')) return 'promocao'
  if (slug.includes('lancamento') || slug.includes('novo')) return 'lancamento'
  if (slug.includes('agenda') || slug.includes('encomenda')) return 'comunicado'
  return 'geral'
}

const toUpdateFallback = (image, index) => {
  const title = toTitleFromSlug(image.slug || image.label || `Novidade ${index + 1}`)

  return {
    id: image.id || `novidade-${index + 1}`,
    category: updateTypeFromSlug(image.slug),
    dateLabel: 'Atualizado automaticamente',
    title,
    imageUrl: image.imageUrl,
    imageAlt: `${title} da Carliz Doces`,
    mediaDescription: 'Imagem adicionada na pasta de novidades.',
    description: `Confira a novidade ${title} e peça pelo WhatsApp.`,
    status: 'Consulte disponibilidade.',
  }
}

const mapUpdateOverrides = () => {
  const mapByImage = new Map()
  const mapById = new Map()

  updatesCatalog.forEach((item) => {
    if (item.imageUrl) {
      mapByImage.set(normalizeKey(item.imageUrl), item)
    }

    if (item.id) {
      mapById.set(normalizeKey(item.id), item)
    }
  })

  return { mapByImage, mapById }
}

const novidadesImages = imageCollections.novidades ?? []
const { mapByImage: updatesByImage, mapById: updatesById } = mapUpdateOverrides()

const autoUpdates = novidadesImages.map((image, index) => {
  const override = updatesByImage.get(normalizeKey(image.imageUrl)) || updatesById.get(normalizeKey(image.id))

  return {
    ...toUpdateFallback(image, index),
    ...override,
    imageUrl: image.imageUrl,
    id: override?.id || image.id || `novidade-${index + 1}`,
  }
})

const usedUpdateImageKeys = new Set(autoUpdates.map((item) => normalizeKey(item.imageUrl)))
const extraManualUpdates = updatesCatalog.filter((item) => !usedUpdateImageKeys.has(normalizeKey(item.imageUrl)))
const dynamicUpdatesCatalog = [...autoUpdates, ...extraManualUpdates]

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

export const seasonalProducts = dynamicProductsCatalog.map((product, index) => ({
  id: product.id || `produto-${index + 1}`,
  name: product.name,
  flavor: product.shortDescription,
  details: product.details,
  weight: product.weight,
  price: product.price,
  image: product.image,
  rating: product.rating ?? 5,
  reviewCount: product.reviewCount ?? 0,
  quantities: product.quantities ?? [],
}))

export const updates = dynamicUpdatesCatalog.map((item, index) => ({
  id: item.id || `novidade-${index + 1}`,
  type: item.category,
  dateLabel: item.dateLabel,
  title: item.title,
  imageUrl: item.imageUrl,
  imageAlt: item.imageAlt,
  mediaDescription: item.mediaDescription,
  description: item.description,
  status: item.status,
}))

export const announcementChannels = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/_carlizdoces/', variant: 'contained', external: true },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/5511992175496?text=Oi%2C%20quero%20receber%20as%20novidades%20da%20Carliz%20Doces%21', variant: 'outlined', external: true },
  { id: 'contato', label: 'Falar com a equipe', href: '#contato', variant: 'text', external: false },
]

export const manualTestimonials = [
  { id: 'manual-1', author: 'Carla M.', channel: 'Instagram', message: 'Pedi para o aniversário do meu filho e os brigadeiros fizeram o maior sucesso na festa toda.' },
  { id: 'manual-2', author: 'Juliana F.', channel: 'WhatsApp', message: 'Atendimento rápido, doces lindos e muito saborosos. Já virei cliente fiel da Carliz Doces.' },
]

export const instagramPosts = (imageCollections.instagram ?? []).map((image, index) => ({
  id: image.id || `insta-${index + 1}`,
  imageUrl: image.imageUrl,
  alt: `${image.label} da Carliz Doces`,
}))

export const topShowcaseSlides = (imageCollections.carousel ?? []).map((image, index) => {
  const title = toTitleFromSlug(image.slug || image.label)

  return {
    id: image.id || `carousel-${index + 1}`,
    imageUrl: image.imageUrl,
    alt: `${title} da Carliz Doces`,
    title,
    description: `Destaque especial: ${title}.`,
    tag: index === 0 ? 'Mais pedido' : 'Novidade',
  }
})

export const metrics = [
  ['Pedidos por dia', '120+'],
  ['Sabores disponíveis', '30+'],
  ['Eventos atendidos', '40+'],
]

export const paymentMethods = ['Pix', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito']
export const instagramProfileLink = 'https://www.instagram.com/_carlizdoces/'
export const whatsappNumber = '5511992175496'
export const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
