import { Badge, Box, Fab, Icon, Tooltip, Zoom } from '@mui/material'
import FavoriteIcon from '../../mui-icons/Favorite'
import FavoriteBorderIcon from '../../mui-icons/FavoriteBorder'

export function FloatingActions({ totalItems, showScrollTop, onScrollTop, totalLikes, hasLiked, onToggleLike, showLikeCelebration, onGoToOrderSection }) {
  return (
    <Box component="aside" aria-label="Ações rápidas" sx={{ position: 'fixed', left: { xs: 12, md: 24 }, bottom: { xs: 16, md: 24 }, display: 'flex', flexDirection: 'column', gap: 1.2, backgroundColor: '#f8f8f3' }}>
      {showScrollTop ? (
        <Fab color="default" size="small" aria-label="Voltar ao topo" onClick={onScrollTop}>
          <Icon>keyboard_arrow_up</Icon>
        </Fab>
      ) : null}

      <Tooltip title="Ir para a seção de pedidos" placement="right" arrow>
        <Fab color="primary" size="small" aria-label="Ir para realizar pedido" href="#realizar-pedido" onClick={onGoToOrderSection}>
          <Badge color="secondary" badgeContent={totalItems} invisible={totalItems === 0}>
            <Icon>shopping_cart</Icon>
          </Badge>
        </Fab>
      </Tooltip>

      <Fab
        color={hasLiked ? 'secondary' : 'default'}
        size="small"
        aria-label="Curtir loja"
        onClick={onToggleLike}
        sx={{
          transform: showLikeCelebration ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 220ms ease',
          overflow: 'visible',
        }}
      >
        <Badge
          color="secondary"
          badgeContent={totalLikes}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiBadge-badge': {
              fontWeight: 700,
              fontSize: '0.66rem',
              minWidth: 20,
              height: 20,
            },
          }}
        >
          {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Badge>

        <Zoom in={showLikeCelebration} timeout={220} unmountOnExit>
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'secondary.main',
              opacity: 0.55,
              pointerEvents: 'none',
            }}
          />
        </Zoom>
      </Fab>
    </Box>
  )
}
