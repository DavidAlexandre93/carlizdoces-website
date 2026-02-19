import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase, deviceId, isSupabaseConfigured } from "../supabaseClient";

/**
 * LikeButton (likes_anon)
 * Requisitos no banco:
 * - UNIQUE (item_id, device_id)
 * - RLS usando device_id = request_device_id()
 * - Frontend enviando header "x-device-id" = deviceId (configurado no supabaseClient)
 */
export default function LikeButton({ itemId }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // evita setState depois de unmount
  const mountedRef = useRef(true);

  // evita corrida de cliques enquanto request está em andamento
  const inFlightRef = useRef(false);

  // validação mínima
  const safeItemId = useMemo(() => String(itemId ?? "").trim(), [itemId]);
  const canRun = isSupabaseConfigured && safeItemId.length > 0 && String(deviceId ?? "").length > 0;

  const safeSetState = useCallback((fn) => {
    if (mountedRef.current) fn();
  }, []);

  const load = useCallback(async () => {
    if (!canRun) {
      safeSetState(() => {
        setLoading(false);
        setCount(0);
        setLiked(false);
      });
      return;
    }

    safeSetState(() => setLoading(true));

    try {
      // 1) total global (count via head)
      const { count: total, error: countErr } = await supabase
        .from("likes_anon")
        .select("*", { count: "exact", head: true })
        .eq("item_id", safeItemId);

      if (countErr) throw countErr;

      safeSetState(() => setCount(Number.isFinite(total) ? total : 0));

      // 2) like do device atual (não depende de coluna id)
      const { data: mine, error: mineErr } = await supabase
        .from("likes_anon")
        .select("item_id")
        .eq("item_id", safeItemId)
        .eq("device_id", deviceId)
        .maybeSingle();

      if (mineErr) throw mineErr;

      safeSetState(() => setLiked(!!mine));
    } catch (e) {
      console.error("LIKE LOAD ERROR:", e);
      // se der erro, não trava o botão pra sempre
    } finally {
      safeSetState(() => setLoading(false));
    }
  }, [canRun, safeItemId, safeSetState]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  const toggle = useCallback(async () => {
    // se itemId vazio ou supabase não configurado, só faz fallback local (opcional)
    if (!canRun) {
      const next = !liked;
      setLiked(next);
      setCount((c) => Math.max(0, c + (next ? 1 : -1)));
      return;
    }

    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const prevLiked = liked;
    const nextLiked = !prevLiked;

    // UI otimista
    safeSetState(() => {
      setLiked(nextLiked);
      setCount((c) => Math.max(0, c + (nextLiked ? 1 : -1)));
    });

    try {
      if (nextLiked) {
        // UPSERT evita duplicata / corrida e funciona com UNIQUE (item_id, device_id)
        const { error } = await supabase
          .from("likes_anon")
          .upsert(
            { item_id: safeItemId, device_id: deviceId },
            { onConflict: "item_id,device_id" }
          );

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes_anon")
          .delete()
          .eq("item_id", safeItemId)
          .eq("device_id", deviceId);

        if (error) throw error;
      }

      // recarrega para bater com o servidor (evita count incorreto em caso de concorrência)
      await load();
    } catch (e) {
      console.error("LIKE TOGGLE ERROR:", e);

      // reverte UI para o estado anterior
      safeSetState(() => {
        setLiked(prevLiked);
        setCount((c) => Math.max(0, c + (prevLiked ? 1 : -1)));
      });

      alert("Não foi possível atualizar seu coração agora.");
    } finally {
      inFlightRef.current = false;
    }
  }, [canRun, liked, load, safeItemId, safeSetState]);

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={liked}
      title={liked ? "Remover curtida" : "Curtir"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid #ddd",
        background: "white",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: 16,
        userSelect: "none",
        opacity: loading ? 0.65 : 1,
      }}
    >
      <span style={{ fontSize: 22, color: liked ? "red" : "#444" }}>♥</span>
      <span style={{ fontWeight: 700 }}>{count}</span>
    </button>
  );
}
