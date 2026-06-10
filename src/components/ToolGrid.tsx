import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import HomeDashboard from "@/components/HomeDashboard";
import type { ToolPlugin } from "@/plugins/types";

interface ToolGridProps {
  tools: ToolPlugin[];
  searchQuery: string;
}

export default function ToolGrid({ tools, searchQuery }: ToolGridProps) {
  const [activeToolId, setActiveToolId] = useState<string>("home");

  const filtered = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return tools;
  }, [tools, searchQuery]);

  const categoryLabel: Record<string, string> = {
    dev: "开发",
    converter: "转换器",
    generator: "生成器",
  };

  const groupedTools = useMemo(() => {
    const groups = new Map<string, ToolPlugin[]>();
    filtered.forEach((tool) => {
      const group = groups.get(tool.category) ?? [];
      group.push(tool);
      groups.set(tool.category, group);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      if (!activeToolId) {
        setActiveToolId("home");
      }
      return;
    }

    if (!filtered.length) {
      setActiveToolId("");
      return;
    }

    if (!filtered.some((tool) => tool.id === activeToolId)) {
      setActiveToolId(filtered[0].id);
    }
  }, [activeToolId, filtered, searchQuery]);

  const activeTool = filtered.find((tool) => tool.id === activeToolId);
  const ActiveIcon = activeTool?.icon;
  const isHomeActive = activeToolId === "home" && !searchQuery.trim();

  return (
    <section className="overflow-hidden rounded-lg bg-card">
      {filtered.length === 0 && searchQuery.trim() ? (
        <div className="px-6 py-16 text-center text-sm text-muted-foreground">
          没有找到匹配的工具
        </div>
      ) : (
        <div className="grid min-h-[calc(100vh-98px)] grid-cols-1 gap-3 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-lg bg-muted/35">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-sm font-medium">工具列表</div>
              <div className="text-xs text-muted-foreground">
                {filtered.length} / {tools.length}
              </div>
            </div>
            <nav className="max-h-64 space-y-4 overflow-auto px-2 pb-3 lg:max-h-[calc(100vh-150px)]">
              {!searchQuery.trim() && (
                <div className="space-y-1.5">
                  <div className="px-2 text-xs font-medium text-muted-foreground">
                    概览
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveToolId("home")}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
                      isHomeActive
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                        isHomeActive ? "bg-accent" : "bg-background/70"
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">首页</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        时间进度与月历
                      </span>
                    </span>
                  </button>
                </div>
              )}
              {groupedTools.map(([category, items]) => (
                <div key={category} className="space-y-1.5">
                  <div className="px-2 text-xs font-medium text-muted-foreground">
                    {categoryLabel[category] || category}
                  </div>
                  <div className="space-y-1">
                    {items.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = tool.id === activeToolId;

                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => setActiveToolId(tool.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
                            isActive
                              ? "bg-background text-foreground"
                              : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                              isActive ? "border-transparent bg-accent" : "border-transparent bg-background/70"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium">
                              {tool.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {tool.description}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          <div className="flex min-w-0 flex-col rounded-lg bg-muted/20">
            {isHomeActive ? (
              <>
                <div className="flex items-start justify-between gap-4 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold tracking-tight">
                        首页
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        时间进度与本月日历
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 px-5 pb-5">
                  <HomeDashboard />
                </div>
              </>
            ) : activeTool && ActiveIcon ? (
              <>
                <div className="flex items-start justify-between gap-4 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <ActiveIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold tracking-tight">
                        {activeTool.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activeTool.description}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {categoryLabel[activeTool.category] || activeTool.category}
                  </span>
                </div>
                <div className="flex-1 px-5 pb-5">
                  <activeTool.component />
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
