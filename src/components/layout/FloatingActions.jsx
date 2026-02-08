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
  const neutralBackground = isFooterVisible ? '#e6bfd2' : '#f8f8f3'
  const scrollTopBackground = '#ddb2c7'
  const floatingGap = { xs: 14, md: 16 }
  const actionSize = { xs: 60, md: 66 }
  const actionBottom = { xs: 16, md: 24 }

  const commonPositionSx = {
    position: 'fixed',
    left: { xs: 12, md: 24 },
    transition: 'background-color 220ms ease, transform 220ms ease',
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
            bottom: {
              xs: `calc(${actionBottom.xs}px + (${actionSize.xs}px * 2) + (${floatingGap.xs}px * 2))`,
              md: `calc(${actionBottom.md}px + (${actionSize.md}px * 2) + (${floatingGap.md}px * 2))`,
            },
            width: actionSize,
            height: actionSize,
            backgroundColor: scrollTopBackground,
            '&:hover': {
              backgroundColor: '#d4a9bd',
            },
            color: '#4d2b3a',
            animation: 'scrollTopPulse 1.6s ease-in-out infinite',
            '@keyframes scrollTopPulse': {
              '0%, 100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(221, 178, 199, 0.58)',
              },
              '50%': {
                transform: 'scale(1.08)',
                boxShadow: '0 0 0 10px rgba(221, 178, 199, 0)',
              },
            },
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
            bottom: {
              xs: `calc(${actionBottom.xs}px + ${actionSize.xs}px + ${floatingGap.xs}px)`,
              md: `calc(${actionBottom.md}px + ${actionSize.md}px + ${floatingGap.md}px)`,
            },
            width: actionSize,
            height: actionSize,
            backgroundColor: '#8d0d4d',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#a0175d',
            },
            '& .MuiBadge-badge': {
              fontWeight: 700,
            },
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
          bottom: actionBottom,
          width: actionSize,
          height: actionSize,
          backgroundColor: neutralBackground,
          '&:hover': {
            backgroundColor: isFooterVisible ? '#ddb2c7' : '#ecece6',
          },
          transform: showLikeCelebration ? 'scale(1.12)' : 'scale(1)',
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
