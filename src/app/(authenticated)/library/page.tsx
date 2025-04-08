"use client";
const [searchText, setSearchText] = useState("");

import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchInput } from "@/components/ui/search-input";

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
      <SearchInput value={searchText} onChange={setSearchText} />
      {/* Add your asana listing here */}
    </div>
  );
}
