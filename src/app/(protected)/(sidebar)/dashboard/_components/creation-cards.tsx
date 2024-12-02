import { type LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  icon: LucideIcon;
  emoji: string;
  gradient: string;
}

export const Card: React.FC<CardProps> = ({ title, icon: Icon, gradient }) => {
  return (
    <div
      className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border p-2 transition-all lg:h-36 ${gradient} `}
    >
      <Icon className="size-6" />
      <h2 className="text-center">{title}</h2>
    </div>
  );
};
