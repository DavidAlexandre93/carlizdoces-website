import { useCallback, useEffect, useMemo, useState } from 'react'
import { deviceId, isSupabaseConfigured, supabase } from '../supabaseClient'

function clampStars(value) {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) return 0
  return Math.min(5, Math.max(0, numberValue))
}

export default function StarRating({ itemId, label = 'Avalie este item' }) {
  const [myStars, setMyStars] = useState(0)
  const [avgStars, setAvgStars] = useState(0)
  const [count, setCount] = useState(0)
  const [hoverStars, setHoverStars] = useState(0)
  const [loading, setLoading] = useState(false)

  const displayStars = hoverStars || myStars

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    setLoading(true)

    const { data: summary, error: summaryError } = await supabase
      .from('ratings_summary')
      .select('avg_stars, ratings_count')
      .eq('item_id', itemId)
      .maybeSingle()

    if (summaryError) {
      console.error(summaryError)
    }

    setAvgStars(Number(summary?.avg_stars ?? 0))
    setCount(Number(summary?.ratings_count ?? 0))

    const { data: mine, error: mineError } = await supabase
      .from('ratings_anon')
      .select('stars')
      .eq('item_id', itemId)
      .eq('device_id', deviceId)
      .maybeSingle()

    if (mineError) {
      console.error(mineError)
    }

    setMyStars(clampStars(mine?.stars ?? 0))
    setLoading(false)
  }, [itemId])

  useEffect(() => {
    load()
  }, [load])

  const setRating = useCallback(async (starsClicked) => {
    const next = clampStars(starsClicked)
    const isRemoving = myStars === next

    if (!isSupabaseConfigured) {
      setMyStars(isRemoving ? 0 : next)
      return
    }

    if (isRemoving) {
      const { error } = await supabase
        .from('ratings_anon')
        .delete()
        .eq('item_id', itemId)
        .eq('device_id', deviceId)

      if (error) {
        console.error(error)
      }
    } else {
      const { error } = await supabase
        .from('ratings_anon')
        .upsert({
          item_id: itemId,
          device_id: deviceId,
          stars: next,
        }, {
          onConflict: 'item_id,device_id',
        })

      if (error) {
        console.error(error)
      }
    }

    await load()
  }, [itemId, load, myStars])

  const stars = useMemo(() => [1, 2, 3, 4, 5], [])

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>

      <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        {stars.map((value) => {
          const filled = value <= displayStars

          return (
            <button
              key={value}
              type="button"
              disabled={loading}
              onMouseEnter={() => setHoverStars(value)}
              onMouseLeave={() => setHoverStars(0)}
              onClick={() => setRating(value)}
              aria-label={`Dar ${value} estrela${value > 1 ? 's' : ''}`}
              title={`Dar ${value} estrela${value > 1 ? 's' : ''}`}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 22,
                lineHeight: 1,
                padding: 0,
                opacity: loading ? 0.6 : 1,
              }}
            >
              <span style={{ color: filled ? '#f5a623' : '#bbb' }}>★</span>
            </button>
          )
        })}

        <span style={{ marginLeft: 10, fontSize: 14, color: '#444' }}>
          Média global: <b>{Number(avgStars).toFixed(2)}</b> ({count} avaliações)
        </span>
      </div>

      {myStars > 0 ? (
        <div style={{ fontSize: 12, color: '#555' }}>
          Sua avaliação: <b>{myStars}</b> estrela{myStars > 1 ? 's' : ''} (clique na mesma estrela para remover)
        </div>
      ) : (
        <div style={{ fontSize: 12, color: '#777' }}>
          Você ainda não avaliou.
        </div>
      )}
    </div>
  )
}
