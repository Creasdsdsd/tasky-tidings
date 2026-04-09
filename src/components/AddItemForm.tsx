import { useState } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  categories: string[];
  onAdded: () => void;
  userId: string;
  onSave?: (title: string, category: string) => void;
}

export const AddItemForm = ({ categories, onAdded, userId, onSave }: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !category) return;
    setSaving(true);
    if (onSave) {
      onSave(title.trim(), category);
    } else {
      await supabase.from("checklist_items").insert({ title: title.trim(), category, user_id: userId });
    }
    setTitle("");
    setSaving(false);
    setOpen(false);
    onAdded();
  };

  if (!open) {
    return (
      <button
        onClick={() => { setCategory(categories[0] ?? ""); setOpen(true); }}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 bg-card py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" /> 항목 추가
      </button>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-primary/40 bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">새 점검 항목</span>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <input
        type="text"
        placeholder="항목명 입력..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-3 w-full rounded-md bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        autoFocus
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-3 w-full rounded-md bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={!title.trim() || saving}
        className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? "저장 중..." : "저장"}
      </button>
    </div>
  );
};
