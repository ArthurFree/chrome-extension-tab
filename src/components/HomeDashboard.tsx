import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = startOfDay(date);
  start.setDate(start.getDate() + mondayOffset);
  return start;
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function getProgress(now: Date, start: Date, end: Date) {
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

function ProgressItem({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-lg bg-background/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
        </div>
        <div className="font-mono text-lg font-semibold">
          {formatPercent(value)}
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent-foreground transition-[width]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function HomeDashboard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const data = useMemo(() => {
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const weekStart = startOfWeek(now);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const monthCalendarStart = startOfWeek(monthStart);
    const monthCalendarEnd = new Date(startOfWeek(monthEnd));
    if (monthCalendarEnd < monthEnd) {
      monthCalendarEnd.setDate(monthCalendarEnd.getDate() + 7);
    }

    const days: Date[] = [];
    const cursor = new Date(monthCalendarStart);
    while (cursor < monthCalendarEnd || days.length < 35) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
      if (days.length >= 42) break;
    }

    return {
      yearProgress: getProgress(now, yearStart, yearEnd),
      monthProgress: getProgress(now, monthStart, monthEnd),
      weekProgress: getProgress(now, weekStart, weekEnd),
      year: now.getFullYear(),
      monthLabel: now.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
      }),
      weekRange: `${weekStart.toLocaleDateString("zh-CN", {
        month: "numeric",
        day: "numeric",
      })} - ${new Date(weekEnd.getTime() - 1).toLocaleDateString("zh-CN", {
        month: "numeric",
        day: "numeric",
      })}`,
      days,
    };
  }, [now]);

  const today = startOfDay(now).getTime();
  const weekLabels = ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 xl:grid-cols-3">
        <ProgressItem
          label="今年已过去"
          value={data.yearProgress}
          detail={`${data.year} 年`}
        />
        <ProgressItem
          label="本月已过去"
          value={data.monthProgress}
          detail={data.monthLabel}
        />
        <ProgressItem
          label="本周已过去"
          value={data.weekProgress}
          detail={data.weekRange}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-lg bg-background/70 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent-foreground" />
              <h3 className="text-sm font-medium">月历</h3>
            </div>
            <div className="text-sm text-muted-foreground">
              {data.monthLabel}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekLabels.map((label) => (
              <div
                key={label}
                className="py-2 text-xs font-medium text-muted-foreground"
              >
                {label}
              </div>
            ))}
            {data.days.map((day) => {
              const isToday = startOfDay(day).getTime() === today;
              const isCurrentMonth = day.getMonth() === now.getMonth();

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "flex aspect-square min-h-12 items-start justify-end rounded-md p-2 text-sm",
                    isCurrentMonth
                      ? "bg-muted/35 text-foreground"
                      : "bg-muted/15 text-muted-foreground",
                    isToday && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="font-mono">{day.getDate()}</span>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="rounded-lg bg-background/70 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-accent-foreground" />
            <h3 className="text-sm font-medium">现在</h3>
          </div>
          <div className="font-mono text-3xl font-semibold">
            {now.toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {now.toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </div>
          <div className="mt-6 rounded-md bg-muted/35 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarRange className="h-4 w-4" />
              时间概览
            </div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div>年进度 {formatPercent(data.yearProgress)}</div>
              <div>月进度 {formatPercent(data.monthProgress)}</div>
              <div>周进度 {formatPercent(data.weekProgress)}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
