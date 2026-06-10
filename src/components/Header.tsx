import { useState, useEffect } from "react";
import { Search, Box, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSearch: (query: string) => void;
  toolCount: number;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export default function Header({ onSearch, toolCount }: HeaderProps) {
  const [now, setNow] = useState(new Date());
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <header>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Box className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">工具箱</h1>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {toolCount} 个工具
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              新标签页里的轻量开发与转换工具
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-lg px-3 py-2">
            <div className="text-right font-mono text-xl font-semibold leading-none tracking-tight">
              {formatTime(now)}
            </div>
            <div className="mt-1 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(now)}
            </div>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索工具..."
              className="pl-9"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
