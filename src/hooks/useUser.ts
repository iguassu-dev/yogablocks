"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getUser = async () => {
      console.log("[useUser] Fetching current user...");
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("[useUser] Error getting user:", error.message);
      }

      if (data?.user) {
        console.log("[useUser] User found:", data.user);
        setUser(data.user);
      } else {
        console.log("[useUser] No user session found.");
      }

      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("[useUser] Auth state changed:", session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
