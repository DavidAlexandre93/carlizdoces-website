import { isSupabaseConfigured, supabase } from '../../../supabaseClient';

const STORE_LIKES_ITEM_ID = 'store';

function createEmptyLikesSummary(productIds) {
  return {
    store: {
      likes: 0,
      likedByCurrentUser: false,
    },
    products: {
      likesById: createNumberMap(productIds),
      likedByCurrentUserById: createBooleanMap(productIds),
    },
  };
}

function createBooleanMap(ids) {
  return Object.fromEntries(ids.map((id) => [id, false]));
}

function createNumberMap(ids) {
  return Object.fromEntries(ids.map((id) => [id, 0]));
}

export async function requestLikesSummary(currentDeviceId, productIds) {
  if (!isSupabaseConfigured) {
    return createEmptyLikesSummary(productIds);
  }

  const itemIds = [STORE_LIKES_ITEM_ID, ...productIds];

  const { data: rows, error: rowsError } = await supabase
    .from('likes_anon')
    .select('item_id')
    .in('item_id', itemIds);

  if (rowsError) {
    throw new Error(rowsError.message || 'likes-summary-request-failed');
  }

  const { data: userRows, error: userRowsError } = await supabase
    .from('likes_anon')
    .select('item_id')
    .eq('device_id', currentDeviceId)
    .in('item_id', itemIds);

  if (userRowsError) {
    throw new Error(userRowsError.message || 'likes-summary-request-failed');
  }

  const likesById = createNumberMap(productIds);
  let storeLikes = 0;

  (rows || []).forEach((row) => {
    if (row.item_id === STORE_LIKES_ITEM_ID) {
      storeLikes += 1;
      return;
    }

    if (Object.prototype.hasOwnProperty.call(likesById, row.item_id)) {
      likesById[row.item_id] += 1;
    }
  });

  const likedByCurrentUserById = createBooleanMap(productIds);
  let storeLikedByCurrentUser = false;

  (userRows || []).forEach((row) => {
    if (row.item_id === STORE_LIKES_ITEM_ID) {
      storeLikedByCurrentUser = true;
      return;
    }

    if (Object.prototype.hasOwnProperty.call(likedByCurrentUserById, row.item_id)) {
      likedByCurrentUserById[row.item_id] = true;
    }
  });

  return {
    store: {
      likes: storeLikes,
      likedByCurrentUser: storeLikedByCurrentUser,
    },
    products: {
      likesById,
      likedByCurrentUserById,
    },
  };
}

export async function requestProductLikeToggle(productId, currentDeviceId) {
  const { data, error } = await supabase.rpc('toggle_like_anon', {
    p_item_id: productId,
    p_device_id: currentDeviceId,
  });

  if (error) throw new Error(error.message || 'product-like-toggle-request-failed');
  const result = Array.isArray(data) ? data[0] : data;

  return {
    likes: Number(result?.likes || 0),
    liked: result?.liked === true,
  };
}
