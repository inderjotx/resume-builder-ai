import { ResponsiveModalDrawer } from "@/components/ui/responsive-modal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSubscribeToPremiumDialog } from "./providers/SubscribeToPremiumDialog";

export function SubscribePremiumDialog() {
  const router = useRouter();

  const { open, setValue } = useSubscribeToPremiumDialog();
  const handleSubscribeClick = () => {
    router.push("/pricing");
    setValue(false);
  };

  return (
    <ResponsiveModalDrawer
      title={"✨ Subscribe to Premium"}
      open={open}
      onOpenChange={setValue}
      className="border-indigo-500 bg-gradient-to-br from-purple-600 to-indigo-200 px-5 py-8"
    >
      <div className="flex flex-col gap-4">
        <p>You need to subscribe to Premium to continue.</p>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => setValue(false)}>
            Close
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSubscribeClick}
          >
            Subscribe
          </Button>
        </div>
      </div>
    </ResponsiveModalDrawer>
  );
}
