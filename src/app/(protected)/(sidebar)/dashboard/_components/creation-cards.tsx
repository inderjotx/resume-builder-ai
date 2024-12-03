import { type LucideIcon } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";
import { useSubscribeToPremiumDialog } from "@/components/providers/SubscribeToPremiumDialog";
import { CardType } from "./create-resume-dialog";

interface CardProps {
  title: string;
  icon: LucideIcon;
  type: CardType;
  emoji: string;
  gradient: string;
  onSelect: (cardType: CardType) => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  icon: Icon,
  gradient,
  type,
  onSelect,
}) => {
  const data = useCredits();
  const { setValue } = useSubscribeToPremiumDialog();

  const onClick = () => {
    if (data.data?.credits === 0) {
      setValue(true);
    } else {
      onSelect(type);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border p-2 transition-all lg:h-36 ${gradient} `}
    >
      <Icon className="size-6" />
      <h2 className="text-center">{title}</h2>
    </div>
  );
};
