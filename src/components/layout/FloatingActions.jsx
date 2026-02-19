import { Badge, Box, Fab, Icon, IconButton, Tooltip } from '@mui/material'
import FavoriteIcon from '../../mui-icons/Favorite'
import FavoriteBorderIcon from '../../mui-icons/FavoriteBorder'

export function FloatingActions({
  totalItems,
  showScrollTop,
  onScrollTop,
  totalLikes,
  hasLiked,
  onToggleLike,
  disabled,
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

      <Box
        sx={{
          ...commonPositionSx,
          bottom: actionBottom,
          width: actionSize,
          height: actionSize,
          display: 'grid',
          placeItems: 'center',
          backgroundColor: neutralBackground,
          borderRadius: '50%',
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
          <IconButton
            type="button"
            aria-label={hasLiked ? 'Remover curtida' : 'Curtir loja'}
            aria-pressed={hasLiked}
            onClick={onToggleLike}
            disabled={disabled}
            sx={{
              width: { xs: 46, md: 50 },
              height: { xs: 46, md: 50 },
              borderRadius: '50%',
              border: hasLiked ? '1px solid #fbc5c5' : '1px solid #f3b6c5',
              background: hasLiked ? 'linear-gradient(145deg, #fff3f3, #ffe4e7)' : 'linear-gradient(145deg, #fffafa, #ffeef2)',
              boxShadow: hasLiked ? '0 8px 18px rgba(255, 72, 101, 0.25)' : '0 6px 14px rgba(229, 57, 53, 0.16)',
              '&:hover': {
                background: hasLiked ? 'linear-gradient(145deg, #fff3f3, #ffd9de)' : 'linear-gradient(145deg, #fffafa, #ffe3ec)',
              },
            }}
          >
            {hasLiked ? <FavoriteIcon sx={{ color: '#e53935' }} /> : <FavoriteBorderIcon sx={{ color: '#e53935' }} />}
          </IconButton>
        </Badge>
      </Box>
    </>
  )
}
