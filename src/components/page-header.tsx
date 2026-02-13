import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p className="text-foreground/60 mt-1">{description}</p>}
    </div>
  );
}
