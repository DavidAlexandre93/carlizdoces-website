/**
 * ===============================================================
 * NOTIFICAÇÕES RÁPIDAS (EDIÇÃO MANUAL)
 * ===============================================================
 *
 * Como publicar uma NOVA notificação para TODO MUNDO ver "Novo":
 * 1) Crie um novo item em `notificationsCatalog` com um `id` único.
 * 2) Atualize `activeNotificationId` com o `id` da nova notificação.
 *
 * Importante:
 * - Sempre que o `activeNotificationId` mudar, o aviso "Novo" volta para todos os usuários.
 * - Não reutilize IDs antigos para não confundir o controle de leitura no navegador.
 */

export const notificationsCatalog = [
  {
    id: 'pascoa-2026',
    title: 'Notificações',
    items: [
      {
        title: 'Pedidos de Páscoa 2026',
        lines: [
          'Faça seu pedido até 25/03/2026 e concorra ao sorteio de um delicioso ovo de colher! 😍',
          '🎥 Sorteio ao vivo no Instagram: 03/04/2026',
          '🍀 Boa sorte!',
        ],
      },
      {
        title: 'Entrega ou retirada',
        lines: ['🚚 Entrega (com taxa) ou retirada no ponto de referência mais próximo.'],
      },
      {
        title: 'Produção artesanal',
        lines: ['🧁 Produção artesanal, sem conservantes.'],
      },
      {
        title: 'Marque a gente',
        lines: ['📸 Marque a gente: @carlizdoces', 'Queremos ver sua experiência!', 'Deus abençoe! 🙌'],
      },
    ],
  },
]

export const activeNotificationId = 'pascoa-2026'

const fallbackNotification = notificationsCatalog[0] ?? {
  id: 'geral',
  title: 'Notificação',
  items: [],
}

export const activeNotification =
  notificationsCatalog.find((item) => item.id === activeNotificationId) ?? fallbackNotification
