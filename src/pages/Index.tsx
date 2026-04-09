import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ChecklistCard } from "@/components/ChecklistCard";
import { ProgressHeader } from "@/components/ProgressHeader";
import { FilterTabs } from "@/components/FilterTabs";
import { supabase } from "@/integrations/supabase/client";

export interface CheckItem {
  id: string;
  category: string;
  title: string;
  checked: boolean;
  memo: string;
}

type Filter = "전체" | "완료" | "미완료";

const Index = () => {
  const [items, setItems] = useState<CheckItem[]>([]);
  const [filter, setFilter] = useState<Filter>("전체");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("id, title, category, checked, memo")
        .order("sort_order");
      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  const completedCount = items.filter((i) => i.checked).length;

  const toggleCheck = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newChecked = !item.checked;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: newChecked } : i)));
    await supabase.from("checklist_items").update({ checked: newChecked }).eq("id", id);
  };

  const updateMemo = async (id: string, memo: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, memo } : i)));
    await supabase.from("checklist_items").update({ memo }).eq("id", id);
  };

  const filtered = items.filter((i) => {
    if (filter === "완료") return i.checked;
    if (filter === "미완료") return !i.checked;
    return true;
  });

  const categories = [...new Set(filtered.map((i) => i.category))];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          OK금융 업무 점검
        </h1>

        <ProgressHeader
          completed={completedCount}
          total={items.length}
          categoryStats={[...new Set(items.map((i) => i.category))].map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            return { name: cat, completed: catItems.filter((i) => i.checked).length, total: catItems.length };
          })}
        />

        <FilterTabs current={filter} onChange={setFilter} />

        {categories.map((cat) => (
          <div key={cat} className="mb-6">
            <button
              onClick={() => setCollapsed((p) => ({ ...p, [cat]: !p[cat] }))}
              className="mb-3 flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{cat}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${collapsed[cat] ? "-rotate-90" : ""}`}
              />
            </button>
            {!collapsed[cat] && (
              <div className="space-y-3">
                {filtered
                  .filter((i) => i.category === cat)
                  .map((item) => (
                    <ChecklistCard
                      key={item.id}
                      item={item}
                      onToggle={toggleCheck}
                      onMemoChange={updateMemo}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">항목이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Index;
