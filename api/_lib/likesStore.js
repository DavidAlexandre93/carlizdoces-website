/* global module */
const globalLikesStore = globalThis.__carlizLikesStore ?? {
  storeLikesCount: 0,
  storeLikedUsers: {},
  productLikesCountById: {},
  productLikedUsersById: {},
};
globalThis.__carlizLikesStore = globalLikesStore;

const sanitizeUserId = (userId) => (typeof userId === 'string' ? userId.trim() : '');

function getProductLikesCount(productId) {
  if (!globalLikesStore.productLikesCountById[productId])
    globalLikesStore.productLikesCountById[productId] = 0;
  return globalLikesStore.productLikesCountById[productId];
}

function hasUserLikedProduct(productId, userId) {
  return globalLikesStore.productLikedUsersById[productId]?.[userId] === true;
}

function toggleProductLikeForUser(productId, userId) {
  const safeUserId = sanitizeUserId(userId);
  if (!safeUserId) return { ok: false, error: 'invalid_user_id' };
  if (!globalLikesStore.productLikedUsersById[productId])
    globalLikesStore.productLikedUsersById[productId] = {};
  const alreadyLiked = hasUserLikedProduct(productId, safeUserId);
  globalLikesStore.productLikedUsersById[productId][safeUserId] = !alreadyLiked;
  globalLikesStore.productLikesCountById[productId] = alreadyLiked
    ? Math.max(0, getProductLikesCount(productId) - 1)
    : getProductLikesCount(productId) + 1;
  return { ok: true, liked: !alreadyLiked, likes: getProductLikesCount(productId) };
}

function toggleStoreLikeForUser(userId) {
  const safeUserId = sanitizeUserId(userId);
  if (!safeUserId) return { ok: false, error: 'invalid_user_id' };
  const alreadyLiked = globalLikesStore.storeLikedUsers[safeUserId] === true;
  globalLikesStore.storeLikedUsers[safeUserId] = !alreadyLiked;
  globalLikesStore.storeLikesCount = alreadyLiked
    ? Math.max(0, globalLikesStore.storeLikesCount - 1)
    : globalLikesStore.storeLikesCount + 1;
  return { ok: true, liked: !alreadyLiked, likes: globalLikesStore.storeLikesCount };
}

function getLikesSummary(userId) {
  const safeUserId = sanitizeUserId(userId);
  const likedProductsByCurrentUser = Object.keys(globalLikesStore.productLikedUsersById).reduce(
    (accumulator, productId) => {
      accumulator[productId] = hasUserLikedProduct(productId, safeUserId);
      return accumulator;
    },
    {}
  );
  return {
    store: {
      likes: globalLikesStore.storeLikesCount,
      likedByCurrentUser: safeUserId
        ? globalLikesStore.storeLikedUsers[safeUserId] === true
        : false,
    },
    products: {
      likesById: globalLikesStore.productLikesCountById,
      likedByCurrentUserById: likedProductsByCurrentUser,
    },
  };
}

module.exports = { getLikesSummary, toggleProductLikeForUser, toggleStoreLikeForUser };
