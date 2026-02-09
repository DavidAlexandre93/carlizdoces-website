/* global module */
const globalLikesStore = globalThis.__carlizLikesStore ?? {
  storeLikesCount: 0,
  storeLikedUsers: {},
  productLikesCountById: {},
  productLikedUsersById: {},
}

globalThis.__carlizLikesStore = globalLikesStore

const sanitizeUserId = (userId) => {
  if (typeof userId !== 'string') return ''
  return userId.trim()
}

const getProductLikesCount = (productId) => {
  if (!globalLikesStore.productLikesCountById[productId]) {
    globalLikesStore.productLikesCountById[productId] = 0
  }

  return globalLikesStore.productLikesCountById[productId]
}

const hasUserLikedProduct = (productId, userId) => {
  const likesByUser = globalLikesStore.productLikedUsersById[productId] ?? {}
  return likesByUser[userId] === true
}

const likeProductForUser = (productId, userId) => {
  const safeUserId = sanitizeUserId(userId)
  if (!safeUserId) {
    return { ok: false, error: 'userId inválido' }
  }

  if (!globalLikesStore.productLikedUsersById[productId]) {
    globalLikesStore.productLikedUsersById[productId] = {}
  }

  const alreadyLiked = hasUserLikedProduct(productId, safeUserId)

  if (!alreadyLiked) {
    globalLikesStore.productLikedUsersById[productId][safeUserId] = true
    globalLikesStore.productLikesCountById[productId] = getProductLikesCount(productId) + 1
  }

  return {
    ok: true,
    liked: true,
    alreadyLiked,
    likes: getProductLikesCount(productId),
  }
}

const likeStoreForUser = (userId) => {
  const safeUserId = sanitizeUserId(userId)
  if (!safeUserId) {
    return { ok: false, error: 'userId inválido' }
  }

  const alreadyLiked = globalLikesStore.storeLikedUsers[safeUserId] === true

  if (!alreadyLiked) {
    globalLikesStore.storeLikedUsers[safeUserId] = true
    globalLikesStore.storeLikesCount += 1
  }

  return {
    ok: true,
    liked: true,
    alreadyLiked,
    likes: globalLikesStore.storeLikesCount,
  }
}

const getLikesSummary = (userId) => {
  const safeUserId = sanitizeUserId(userId)
  const likedProductsByCurrentUser = Object.keys(globalLikesStore.productLikedUsersById).reduce((accumulator, productId) => {
    accumulator[productId] = hasUserLikedProduct(productId, safeUserId)
    return accumulator
  }, {})

  return {
    store: {
      likes: globalLikesStore.storeLikesCount,
      likedByCurrentUser: safeUserId ? globalLikesStore.storeLikedUsers[safeUserId] === true : false,
    },
    products: {
      likesById: globalLikesStore.productLikesCountById,
      likedByCurrentUserById: likedProductsByCurrentUser,
    },
  }
}

module.exports = {
  getLikesSummary,
  likeProductForUser,
  likeStoreForUser,
}
