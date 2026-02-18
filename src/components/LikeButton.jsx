import { useCallback, useEffect, useState } from 'react'
import { deviceId, supabase } from '../supabaseClient'

export default function LikeButton({ itemId }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)

    try {
      const { count: total, error: countError } = await supabase
        .from('likes_anon')
        .select('*', { count: 'exact', head: true })
        .eq('item_id', itemId)

      if (countError) {
        throw countError
      }

      setCount(total || 0)

      const { data: rows, error: likedError } = await supabase
        .from('likes_anon')
        .select('id')
        .eq('item_id', itemId)
        .eq('device_id', deviceId)
        .limit(1)

      if (likedError) {
        throw likedError
      }

      setLiked((rows?.length || 0) > 0)
    } finally {
      setLoading(false)
    }
  }, [itemId])

  useEffect(() => {
    load()
  }, [load])

  const toggle = useCallback(async () => {
    const nextLiked = !liked

    setLiked(nextLiked)
    setCount((currentCount) => Math.max(0, currentCount + (nextLiked ? 1 : -1)))

    try {
      if (nextLiked) {
        const { error } = await supabase.from('likes_anon').insert({
          item_id: itemId,
          device_id: deviceId,
        })

        if (error) {
          throw error
        }
      } else {
        const { error } = await supabase
          .from('likes_anon')
          .delete()
          .eq('item_id', itemId)
          .eq('device_id', deviceId)

        if (error) {
          throw error
        }
      }
    } catch (error) {
      setLiked(liked)
      setCount((currentCount) => Math.max(0, currentCount + (liked ? 1 : -1)))
      console.error(error)
      alert('Erro ao atualizar o like. Veja o console.')
    }
  }, [itemId, liked])

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={liked}
      title={liked ? 'Remover curtida' : 'Curtir'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        borderRadius: 12,
        border: '1px solid #ddd',
        background: 'white',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: 16,
        userSelect: 'none',
        opacity: loading ? 0.65 : 1,
      }}
    >
      <span style={{ fontSize: 22, color: liked ? 'red' : '#444' }}>♥</span>
      <span style={{ fontWeight: 700 }}>{count}</span>
    </button>
  )
}
