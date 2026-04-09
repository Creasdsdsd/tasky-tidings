import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ChecklistCard } from "@/components/ChecklistCard";
import { ProgressHeader } from "@/components/ProgressHeader";
import { FilterTabs } from "@/components/FilterTabs";

export interface CheckItem {
  id: string;
  category: string;
  title: string;
  checked: boolean;
  memo: string;
}

const initialItems: CheckItem[] = [
  { id: "1", category: "월간 점검", title: "고객정보 접근권한 확인", checked: false, memo: "" },
  { id: "2", category: "월간 점검", title: "비밀번호 변경 여부", checked: false, memo: "" },
  { id: "3", category: "월간 점검", title: "문서 보관 상태", checked: false, memo: "" },
  { id: "4", category: "분기 점검", title: "시스템 로그 점검", checked: false, memo: "" },
  { id: "5", category: "분기 점검", title: "외부감사 자료 준비", checked: false, memo: "" },
  { id: "6", category: "분기 점검", title: "규정 변경사항 반영", checked: false, memo: "" },
];

type Filter = "전체" | "완료" | "미완료";

const Index = () => {
  const [items, setItems] = useState<CheckItem[]>(initialItems);
  const [filter, setFilter] = useState<Filter>("전체");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const completedCount = items.filter((i) => i.checked).length;

  const toggleCheck = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  const updateMemo = (id: string, memo: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, memo } : i)));
  };

  const filtered = items.filter((i) => {
    if (filter === "완료") return i.checked;
    if (filter === "미완료") return !i.checked;
    return true;
  });

  const categories = [...new Set(filtered.map((i) => i.category))];

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
