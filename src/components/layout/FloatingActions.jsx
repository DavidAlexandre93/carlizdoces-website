import { Badge, Box, Fab, Icon, Tooltip } from '@mui/material'
import FavoriteIcon from '../../mui-icons/Favorite'

export function FloatingActions({ totalItems, showScrollTop, onScrollTop, onGoToOrderSection }) {
  return (
    <Box component="aside" aria-label="Ações rápidas" sx={{ position: 'fixed', left: { xs: 12, md: 24 }, bottom: { xs: 16, md: 24 }, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
      {showScrollTop ? (
        <Tooltip title="Voltar ao topo" placement="right" arrow>
          <Fab color="default" size="small" aria-label="Voltar ao topo" onClick={onScrollTop}>
            <Icon>keyboard_arrow_up</Icon>
          </Fab>
        </Tooltip>
      ) : null}

      <Tooltip title="Ir para a seção de pedidos" placement="right" arrow>
        <Fab color="primary" size="small" aria-label="Ir para realizar pedido" href="#realizar-pedido" onClick={onGoToOrderSection}>
          <Badge color="secondary" badgeContent={totalItems} invisible={totalItems === 0}>
            <Icon>shopping_cart</Icon>
          </Badge>
        </Fab>
      </Tooltip>

      <Tooltip title="Curtir a loja" placement="right" arrow>
        <Fab color="secondary" size="small" aria-label="Curtir loja">
          <FavoriteIcon />
        </Fab>
      </Tooltip>
    </Box>
  )
}
