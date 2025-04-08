"use client";

import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DocCard } from "@/components/ui/doc-card";

export default function LibraryPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // send user to login if not authenticated
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to the Library!</h1>
      <DocCard
        title="Mountain Pose"
        preview="Improves posture, strengthens thighs, knees, and ankles, firms abdomen and buttocks"
      />
    </div>
  );
}
