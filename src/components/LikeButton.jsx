import React, { useCallback, useEffect, useState } from "react";
import { supabase, deviceId } from "../supabaseClient";
import FavoriteIcon from "../mui-icons/Favorite";
import FavoriteBorderIcon from "../mui-icons/FavoriteBorder";

export default function LikeButton({ itemId }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows, error: likedErr } = await supabase
        .from("likes_anon")
        .select("id")
        .eq("item_id", itemId)
        .eq("device_id", deviceId)
        .limit(1);

      if (likedErr) throw likedErr;
      setLiked((rows?.length ?? 0) > 0);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(async () => {
    const nextLiked = !liked;

    // UI otimista
    setLiked(nextLiked);

    try {
      if (nextLiked) {
        const { error } = await supabase.from("likes_anon").insert({
          item_id: itemId,
          device_id: deviceId,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes_anon")
          .delete()
          .eq("item_id", itemId)
          .eq("device_id", deviceId);

        if (error) throw error;
      }
    } catch (e) {
      // Reverte se falhar
      setLiked(liked);

      // Log detalhado para debug
      console.error("LIKE ERROR:", e);

      alert("Não foi possível atualizar seu coração agora.");
    }
  }, [itemId, liked]);

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
