import { useQuery } from "@tanstack/react-query";
import { type Subscription } from "@/server/db/schema";

export const useCredits = () => {
  return useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const response = await fetch("/api/user/credits");
      return response.json() as Promise<{
        credits: number;
        subscription: Subscription;
      }>;
    },
  });
};
