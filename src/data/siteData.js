import { imageCollections } from './generatedImages'
import { productsCatalog, updatesCatalog } from './editableContent'

const toTitleFromSlug = (value) =>
  value
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

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

export const seasonalProducts = productsCatalog.map((product, index) => ({
  id: product.id || `produto-${index + 1}`,
  name: product.name,
  flavor: product.shortDescription,
  details: product.details,
  weight: product.weight,
  price: product.price,
  image: product.image,
  rating: product.rating ?? 5,
  reviewCount: product.reviewCount ?? 0,
}))

export const updates = updatesCatalog.map((item, index) => ({
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
  ['Sabores disponíveis', '30'],
  ['Eventos atendidos', '450'],
]

export const paymentMethods = ['Pix', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito']
export const instagramProfileLink = 'https://www.instagram.com/_carlizdoces/'
export const whatsappNumber = '5511992175496'
export const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
