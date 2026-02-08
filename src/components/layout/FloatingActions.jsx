import { Badge, Box, Fab, Icon, IconButton, Tooltip, Zoom } from '@mui/material'
import FavoriteIcon from '../../mui-icons/Favorite'
import FavoriteBorderIcon from '../../mui-icons/FavoriteBorder'

export function FloatingActions({
  totalItems,
  showScrollTop,
  onScrollTop,
  totalLikes,
  hasLiked,
  onToggleLike,
  showLikeCelebration,
  onGoToOrderSection,
  isFooterVisible,
}) {
  const commonPositionSx = {
    position: 'fixed',
    left: { xs: 12, md: 24 },
    transition: 'background-color 260ms ease',
    backgroundColor: isFooterVisible ? '#e6bfd2' : '#f8f8f3',
    zIndex: 1100,
  }

  return (
    <>
      {showScrollTop ? (
        <IconButton
          color="inherit"
          size="small"
          aria-label="Voltar ao topo"
          onClick={onScrollTop}
          sx={{
            ...commonPositionSx,
            bottom: { xs: 116, md: 128 },
            color: 'text.primary',
          }}
        >
          <Icon>keyboard_arrow_up</Icon>
        </IconButton>
      ) : null}

      <Tooltip title="Ir para a seção de pedidos" placement="right" arrow>
        <Fab
          color="primary"
          size="small"
          aria-label="Ir para realizar pedido"
          href="#realizar-pedido"
          onClick={onGoToOrderSection}
          sx={{
            ...commonPositionSx,
            bottom: { xs: 66, md: 76 },
          }}
        >
          <Badge color="secondary" badgeContent={totalItems} invisible={totalItems === 0}>
            <Icon>shopping_cart</Icon>
          </Badge>
        </Fab>
      </Tooltip>

      <IconButton
        color={hasLiked ? 'secondary' : 'inherit'}
        size="small"
        aria-label="Curtir loja"
        onClick={onToggleLike}
        sx={{
          ...commonPositionSx,
          bottom: { xs: 16, md: 24 },
          transform: showLikeCelebration ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 220ms ease',
          overflow: 'visible',
          color: hasLiked ? undefined : 'text.primary',
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
      </IconButton>
    </>
  )
}
