import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase, deviceId, isSupabaseConfigured } from '../supabaseClient'
import FavoriteIcon from '../mui-icons/Favorite'
import FavoriteBorderIcon from '../mui-icons/FavoriteBorder'

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
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-pressed={liked}
        title={liked ? 'Remover curtida' : 'Curtir'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 46,
          height: 46,
          padding: 0,
          borderRadius: '50%',
          border: liked ? '1px solid #fbc5c5' : '1px solid #f3b6c5',
          background: liked ? 'linear-gradient(145deg, #fff3f3, #ffe4e7)' : 'linear-gradient(145deg, #fffafa, #ffeef2)',
          boxShadow: liked ? '0 8px 18px rgba(255, 72, 101, 0.25)' : '0 6px 14px rgba(229, 57, 53, 0.16)',
          cursor: loading ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          opacity: loading ? 0.65 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        {liked ? <FavoriteIcon sx={{ fontSize: 24, color: '#e53935' }} /> : <FavoriteBorderIcon sx={{ fontSize: 24, color: '#e53935' }} />}
      </button>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#e53935', lineHeight: 1 }}>{likeCount}</span>
    </div>
  )
}
