import { supabase } from '../../../supabaseClient'

const STORE_LIKES_ITEM_ID = 'store'

function createBooleanMap(ids) {
  return Object.fromEntries(ids.map((id) => [id, false]))
}

function createNumberMap(ids) {
  return Object.fromEntries(ids.map((id) => [id, 0]))
}

export async function requestLikesSummary(currentDeviceId, productIds) {
  const itemIds = [STORE_LIKES_ITEM_ID, ...productIds]

  const { data: rows, error: rowsError } = await supabase
    .from('likes_anon')
    .select('item_id')
    .in('item_id', itemIds)

  if (rowsError) {
    throw new Error(rowsError.message || 'likes-summary-request-failed')
  }

  const { data: userRows, error: userRowsError } = await supabase
    .from('likes_anon')
    .select('item_id')
    .eq('device_id', currentDeviceId)
    .in('item_id', itemIds)

  if (userRowsError) {
    throw new Error(userRowsError.message || 'likes-summary-request-failed')
  }

  const likesById = createNumberMap(productIds)
  let storeLikes = 0

  ;(rows || []).forEach((row) => {
    if (row.item_id === STORE_LIKES_ITEM_ID) {
      storeLikes += 1
      return
    }

    if (Object.prototype.hasOwnProperty.call(likesById, row.item_id)) {
      likesById[row.item_id] += 1
    }
  })

  const likedByCurrentUserById = createBooleanMap(productIds)
  let storeLikedByCurrentUser = false

  ;(userRows || []).forEach((row) => {
    if (row.item_id === STORE_LIKES_ITEM_ID) {
      storeLikedByCurrentUser = true
      return
    }

    if (Object.prototype.hasOwnProperty.call(likedByCurrentUserById, row.item_id)) {
      likedByCurrentUserById[row.item_id] = true
    }
  })

  return {
    store: {
      likes: storeLikes,
      likedByCurrentUser: storeLikedByCurrentUser,
    },
    products: {
      likesById,
      likedByCurrentUserById,
    },
  }
}

export async function requestProductLikeToggle(productId, currentDeviceId) {
  const { data: existingRows, error: existingError } = await supabase
    .from('likes_anon')
    .select('id')
    .eq('item_id', productId)
    .eq('device_id', currentDeviceId)
    .limit(1)

  if (existingError) {
    throw new Error(existingError.message || 'product-like-toggle-request-failed')
  }

  const wasLiked = (existingRows?.length || 0) > 0

  if (wasLiked) {
    const { error: deleteError } = await supabase
      .from('likes_anon')
      .delete()
      .eq('item_id', productId)
      .eq('device_id', currentDeviceId)

    if (deleteError) {
      throw new Error(deleteError.message || 'product-like-toggle-request-failed')
    }
  } else {
    const { error: insertError } = await supabase
      .from('likes_anon')
      .insert({
        item_id: productId,
        device_id: currentDeviceId,
      })

    if (insertError) {
      throw new Error(insertError.message || 'product-like-toggle-request-failed')
    }
  }

  const { count, error: countError } = await supabase
    .from('likes_anon')
    .select('*', { count: 'exact', head: true })
    .eq('item_id', productId)

  if (countError) {
    throw new Error(countError.message || 'product-like-toggle-request-failed')
  }

  return {
    likes: Number(count || 0),
    liked: !wasLiked,
  }
}
