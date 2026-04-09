interface Props {
  current: string;
  onChange: (v: any) => void;
}

const tabs = ["전체", "완료", "미완료"] as const;

export const FilterTabs = ({ current, onChange }: Props) => (
  <div className="mb-6 flex gap-2">
    {tabs.map((t) => (
      <button
        key={t}
        onClick={() => onChange(t)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          current === t
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-muted"
        }`}
      >
        {t}
      </button>
    ))}
  </div>
);
