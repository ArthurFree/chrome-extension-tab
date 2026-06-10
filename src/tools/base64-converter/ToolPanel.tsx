import { useState, useCallback, useMemo } from "react";
import { Copy, Eraser, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Mode = "encode" | "decode";

function base64Encode(text: string): string {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch {
    return "";
  }
}

function base64Decode(text: string): string {
  try {
    return decodeURIComponent(escape(atob(text)));
  } catch {
    return "";
  }
}

function base64UrlEncode(text: string): string {
  return base64Encode(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(text: string): string {
  let padded = text.replace(/-/g, "+").replace(/_/g, "/");
  while (padded.length % 4) padded += "=";
  return base64Decode(padded);
}

export default function Base64Panel() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [urlSafe, setUrlSafe] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input) return { result: "", error: "" };
    let output = "";
    if (mode === "encode") {
      output = urlSafe ? base64UrlEncode(input) : base64Encode(input);
    } else {
      output = urlSafe ? base64UrlDecode(input) : base64Decode(input);
    }
    if (!output && input) {
      return {
        result: "",
        error: mode === "decode" ? "无效的 Base64 字符串" : "编码失败",
      };
    }
    return { result: output, error: "" };
  }, [input, mode, urlSafe]);

  const switchMode = useCallback(() => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput("");
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "encode"
                ? "rounded-md bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            编码
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "decode"
                ? "rounded-md bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            解码
          </button>
        </div>
        <label className="flex cursor-pointer select-none items-center gap-1.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={(e) => setUrlSafe(e.target.checked)}
            className="h-4 w-4 rounded border-input accent-primary"
          />
          URL-safe
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder={mode === "encode" ? "输入文本..." : "输入 Base64..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          {input && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setInput("");
              }}
              aria-label="清空"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          )}
        </div>
        {input && (
          <div className="text-xs text-muted-foreground">
            字符数: {input.length}
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-2 rounded-md bg-muted/35 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {mode === "encode" ? "Base64" : "原文"}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => navigator.clipboard.writeText(result)}
                aria-label="复制"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="break-all rounded-md bg-muted/60 p-2 font-mono text-sm">
            {result}
          </div>
          <div className="text-xs text-muted-foreground">
            输出字符数: {result.length}
          </div>
        </div>
      )}

      <Button variant="ghost" size="sm" className="w-full" onClick={switchMode}>
        <ArrowUpDown className="mr-1 h-3 w-3" />
        切换方向
      </Button>
    </div>
  );
}
