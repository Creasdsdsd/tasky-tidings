interface Props {
  completed: number;
  total: number;
}

export const ProgressHeader = ({ completed, total }: Props) => {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-6 rounded-lg bg-card p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">진행률</span>
        <span className="font-semibold text-foreground">
          {completed}/{total} 완료 ({pct}%)
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
