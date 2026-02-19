import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase, deviceId, isSupabaseConfigured } from '../supabaseClient'
import FavoriteIcon from '../mui-icons/Favorite'

export default function LikeButton({ itemId }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const mountedRef = useRef(true)
  const inFlightRef = useRef(false)

  const safeItemId = useMemo(() => String(itemId ?? '').trim(), [itemId])
  const canRun = isSupabaseConfigured && safeItemId.length > 0 && String(deviceId ?? '').length > 0

  const safeSetState = useCallback((fn) => {
    if (mountedRef.current) fn()
  }, [])

  const load = useCallback(async () => {
    if (!canRun) {
      safeSetState(() => {
        setLoading(false)
        setLiked(false)
        setLikeCount(0)
      })
      return
    }

    safeSetState(() => setLoading(true))

    try {
      const [{ data, error }, { count, error: countError }] = await Promise.all([
        supabase
          .from('likes_anon')
          .select('item_id')
          .eq('item_id', safeItemId)
          .eq('device_id', deviceId)
          .maybeSingle(),
        supabase
          .from('likes_anon')
          .select('*', { count: 'exact', head: true })
          .eq('item_id', safeItemId),
      ])

      if (error) throw error
      if (countError) throw countError

      safeSetState(() => {
        setLiked(Boolean(data))
        setLikeCount(count ?? 0)
      })
    } catch (err) {
      console.error('LIKE LOAD ERROR:', err)
    } finally {
      safeSetState(() => setLoading(false))
    }
  }, [canRun, safeItemId, safeSetState])

  useEffect(() => {
    mountedRef.current = true
    load()

    return () => {
      mountedRef.current = false
    }
  }, [load])

  const toggle = useCallback(async () => {
    if (!canRun) {
      setLiked((prev) => !prev)
      return
    }

    if (inFlightRef.current) return
    inFlightRef.current = true

    const previousLiked = liked
    const nextLiked = !previousLiked
    const previousCount = likeCount
    const nextCount = Math.max(0, previousCount + (nextLiked ? 1 : -1))

    setLiked(nextLiked)
    setLikeCount(nextCount)

    try {
      if (nextLiked) {
        const { error } = await supabase
          .from('likes_anon')
          .upsert({ item_id: safeItemId, device_id: deviceId }, { onConflict: 'item_id,device_id' })

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('likes_anon')
          .delete()
          .eq('item_id', safeItemId)
          .eq('device_id', deviceId)

        if (error) throw error
      }

      await load()
    } catch (err) {
      setLiked(previousLiked)
      setLikeCount(previousCount)
      console.error('LIKE ERROR:', err)
      alert('Não foi possível atualizar seu coração agora.')
    } finally {
      inFlightRef.current = false
    }
  }, [canRun, liked, likeCount, load, safeItemId])

  return (
    <div className="like-button-wrapper">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-pressed={liked}
        title={liked ? 'Remover curtida' : 'Curtir'}
        className={`like-button-heart ${liked ? 'is-liked' : 'is-not-liked'}`}
      >
        <FavoriteIcon sx={{ fontSize: 28 }} />
      </button>
    </div>
  )
}
