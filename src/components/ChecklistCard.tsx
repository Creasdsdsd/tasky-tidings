import type { CheckItem } from "@/pages/Index";
import { Check } from "lucide-react";

interface Props {
  item: CheckItem;
  onToggle: (id: string) => void;
  onMemoChange: (id: string, memo: string) => void;
}

export const ChecklistCard = ({ item, onToggle, onMemoChange }: Props) => (
  <div
    className={`rounded-lg border bg-card p-4 transition-all ${
      item.checked ? "border-success/40" : "border-border"
    }`}
  >
    <div className="flex items-start gap-3">
      <button
        onClick={() => onToggle(item.id)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
          item.checked
            ? "border-success bg-success text-success-foreground"
            : "border-muted-foreground/40 bg-transparent"
        }`}
      >
        {item.checked && <Check className="h-3.5 w-3.5" />}
      </button>
      <span
        className={`text-sm font-medium leading-snug ${
          item.checked ? "text-muted-foreground line-through" : "text-card-foreground"
        }`}
      >
        {item.title}
      </span>
    </div>
    <input
      type="text"
      placeholder="메모 입력..."
      value={item.memo}
      onChange={(e) => onMemoChange(item.id, e.target.value)}
      className="mt-3 w-full rounded-md border-0 bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
    />
  </div>
);
