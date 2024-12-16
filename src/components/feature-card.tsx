interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-4 text-muted-foreground">{description}</p>
    </div>
  );
}
