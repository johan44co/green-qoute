import { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 border border-foreground/20 rounded-lg">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-foreground/60">{description}</p>
      </div>
      {children}
    </div>
  );
}
