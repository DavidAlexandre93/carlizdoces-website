import React, { useCallback, useEffect, useState } from "react";
import { supabase, deviceId } from "../supabaseClient";
import FavoriteIcon from "../mui-icons/Favorite";
import FavoriteBorderIcon from "../mui-icons/FavoriteBorder";

/**
 * LikeButton (likes_anon)
 * Requisitos no banco:
 * - UNIQUE (item_id, device_id)
 * - RLS usando device_id = request_device_id()
 * - Frontend enviando header "x-device-id" = deviceId (configurado no supabaseClient)
 */
export default function LikeButton({ itemId }) {
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
      const { data: rows, error: likedErr } = await supabase
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
    setLiked(nextLiked);

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
      // Reverte se falhar
      setLiked(liked);

      // Log detalhado para debug
      console.error("LIKE ERROR:", e);

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
        justifyContent: "center",
        width: 46,
        height: 46,
        padding: 0,
        borderRadius: "50%",
        border: liked ? "1px solid #fbc5c5" : "1px solid #e3e3e3",
        background: liked
          ? "linear-gradient(145deg, #fff3f3, #ffe4e7)"
          : "linear-gradient(145deg, #ffffff, #f8f8f8)",
        boxShadow: liked
          ? "0 8px 18px rgba(255, 72, 101, 0.25)"
          : "0 6px 14px rgba(0, 0, 0, 0.08)",
        cursor: loading ? "not-allowed" : "pointer",
        userSelect: "none",
        opacity: loading ? 0.65 : 1,
        transition: "all 0.2s ease",
      }}
    >
      {liked ? (
        <FavoriteIcon sx={{ fontSize: 24, color: "#e53935" }} />
      ) : (
        <FavoriteBorderIcon sx={{ fontSize: 24, color: "#6b6b6b" }} />
      )}
    </button>
  );
}
