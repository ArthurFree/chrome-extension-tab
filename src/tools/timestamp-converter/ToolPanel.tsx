import { useState, useEffect } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function formatDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function isTimestamp(value: string): boolean {
  return /^\d+$/.test(value.trim());
}

function parseTimestamp(value: string): Date | null {
  const num = parseInt(value.trim(), 10);
  if (isNaN(num)) return null;
  // 判断是秒还是毫秒：大于 1e12 视为毫秒
  const ms = num > 1e12 ? num : num * 1000;
  const date = new Date(ms);
  return isNaN(date.getTime()) ? null : date;
}

function parseDateTime(value: string): Date | null {
  const date = new Date(value.trim());
  return isNaN(date.getTime()) ? null : date;
}

export default function TimestampPanel() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    type: "timestamp" | "datetime";
    display: string;
    detail: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (value: string) => {
    setInput(value);
    if (!value.trim()) {
      setResult(null);
      setError("");
      return;
    }

    if (isTimestamp(value)) {
      const date = parseTimestamp(value);
      if (date) {
        const ts = Math.floor(date.getTime() / 1000);
        setResult({
          type: "timestamp",
          display: formatDateTime(date),
          detail: `Unix 时间戳: ${ts} 秒 | ${ts * 1000} 毫秒`,
        });
        setError("");
      } else {
        setResult(null);
        setError("无效的时间戳");
      }
    } else {
      const date = parseDateTime(value);
      if (date) {
        const ts = Math.floor(date.getTime() / 1000);
        setResult({
          type: "datetime",
          display: `${ts}`,
          detail: `日期时间: ${formatDateTime(date)}`,
        });
        setError("");
      } else {
        setResult(null);
        setError("无法解析的日期格式");
      }
    }
  };

  const useNow = () => {
    const ts = Math.floor(Date.now() / 1000);
    handleChange(String(ts));
    setInput(String(ts));
  };

  return (
    <div className="space-y-3">
      <div className="rounded-md bg-muted/35 px-3 py-2 text-sm">
        <div className="text-muted-foreground">当前时间</div>
        <div className="font-mono text-base font-medium">
          {formatDateTime(now)}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Unix: {Math.floor(now.getTime() / 1000)} 秒 | {now.getTime()} 毫秒
        </div>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="输入时间戳或日期..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={useNow}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {result && (
        <div className="space-y-1 rounded-md bg-muted/35 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {result.type === "timestamp" ? "日期时间" : "Unix 时间戳"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                navigator.clipboard.writeText(
                  result.type === "timestamp"
                    ? result.display
                    : result.display
                )
              }
              aria-label="复制"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <div className="font-mono text-lg font-medium">{result.display}</div>
          <div className="text-xs text-muted-foreground">{result.detail}</div>
        </div>
      )}
    </div>
  );
}
