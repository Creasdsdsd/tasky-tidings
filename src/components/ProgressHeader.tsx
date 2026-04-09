interface Props {
  completed: number;
  total: number;
  categoryStats: { name: string; completed: number; total: number }[];
}

export const ProgressHeader = ({ completed, total, categoryStats }: Props) => {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-6 space-y-4 rounded-lg bg-card p-4">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">전체 진행률</span>
          <span className="font-semibold text-foreground">
            {completed}/{total} 완료 ({pct}%)
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {categoryStats.map((cat) => {
          const catPct = cat.total === 0 ? 0 : Math.round((cat.completed / cat.total) * 100);
          return (
            <div key={cat.name} className="rounded-md bg-secondary/50 px-3 py-2.5">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{cat.name}</span>
                <span className="text-muted-foreground">
                  {cat.completed}/{cat.total} ({catPct}%)
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-500"
                  style={{ width: `${catPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
