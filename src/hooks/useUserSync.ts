import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { User } from "../types";

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const [userId, setUserId] = useState<string | null>(null);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const existingUser = useQuery(api.users.getUser, user?.id ? { clerkId: user.id } : "skip") as User | null | undefined;

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (existingUser) { setUserId(existingUser._id); return; }
    const syncUser = async () => {
      const id = await getOrCreateUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || user.firstName || "User",
      });
      setUserId(id as string);
    };
    syncUser();
  }, [isLoaded, user, existingUser, getOrCreateUser]);

  return { userId, isLoading: !isLoaded || (user && !userId) };
}
