import { useState, useCallback, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import { Copy, Check, Download, Eraser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  host: string;
  origin: string;
  href: string;
}

interface QueryParam {
  id: string;
  rawKey: string;
  rawValue: string;
  decodedKey: string;
  decodedValue: string;
  decodeError: boolean;
}

function decodePart(value: string) {
  try {
    return {
      value: decodeURIComponent(value.replace(/\+/g, " ")),
      error: false,
    };
  } catch {
    return { value, error: true };
  }
}

function parseQuery(search: string): QueryParam[] {
  const source = search.startsWith("?") ? search.slice(1) : search;
  if (!source) return [];

  return source.split("&").map((part, index) => {
    const separatorIndex = part.indexOf("=");
    const rawKey = separatorIndex >= 0 ? part.slice(0, separatorIndex) : part;
    const rawValue = separatorIndex >= 0 ? part.slice(separatorIndex + 1) : "";
    const decodedKey = decodePart(rawKey);
    const decodedValue = decodePart(rawValue);

    return {
      id: `${index}-${rawKey}`,
      rawKey,
      rawValue,
      decodedKey: decodedKey.value,
      decodedValue: decodedValue.value,
      decodeError: decodedKey.error || decodedValue.error,
    };
  });
}

function parseUrl(url: string): ParsedUrl | null {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      host: parsed.host,
      origin: parsed.origin,
      href: parsed.href,
    };
  } catch {
    return null;
  }
}

const fields: { key: keyof ParsedUrl; label: string }[] = [
  { key: "href", label: "完整 URL" },
  { key: "protocol", label: "协议" },
  { key: "host", label: "主机 + 端口" },
  { key: "hostname", label: "主机名" },
  { key: "port", label: "端口" },
  { key: "pathname", label: "路径" },
  { key: "search", label: "查询参数" },
  { key: "hash", label: "锚点" },
  { key: "origin", label: "源" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 opacity-70 transition-opacity hover:opacity-100"
      onClick={handleCopy}
      aria-label="复制"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}

export default function UrlParserPanel() {
  const [url, setUrl] = useState("");
  const [decodedParams, setDecodedParams] = useState<Set<string>>(new Set());
  const [dataUrl, setDataUrl] = useState("");
  const [qrError, setQrError] = useState("");

  const parsed = useMemo(() => {
    if (!url.trim()) return null;
    return parseUrl(url);
  }, [url]);

  const error = url.trim() && !parsed ? "无效的 URL" : "";
  const queryParams = useMemo(
    () => (parsed ? parseQuery(parsed.search) : []),
    [parsed]
  );

  useEffect(() => {
    setDecodedParams(new Set());
  }, [url]);

  useEffect(() => {
    if (!url.trim()) {
      setDataUrl("");
      setQrError("");
      return;
    }

    QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((nextDataUrl) => {
        setDataUrl(nextDataUrl);
        setQrError("");
      })
      .catch(() => {
        setDataUrl("");
        setQrError("二维码生成失败");
      });
  }, [url]);

  const handleChange = (value: string) => {
    setUrl(value);
  };

  const copyAll = () => {
    if (parsed) {
      navigator.clipboard.writeText(
        JSON.stringify({ ...parsed, queryParams }, null, 2)
      );
    }
  };

  const clear = () => {
    setUrl("");
    setDecodedParams(new Set());
  };

  const toggleDecoded = (id: string) => {
    setDecodedParams((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDownload = useCallback(() => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `url-qrcode-${Date.now()}.png`;
    link.click();
  }, [dataUrl]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="粘贴 URL..."
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1"
        />
        {url && (
          <Button variant="outline" size="icon" onClick={clear} aria-label="清空">
            <Eraser className="h-4 w-4" />
          </Button>
        )}
      </div>
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {qrError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {qrError}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          {parsed && (
            <>
              <section className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium">URL 组成</h3>
                  <Button variant="outline" size="sm" onClick={copyAll}>
                    <Copy className="mr-1 h-3 w-3" />
                    复制 JSON
                  </Button>
                </div>
                <div className="overflow-hidden rounded-md bg-muted/35">
                  <table className="w-full text-sm">
                    <tbody>
                      {fields.map(({ key, label }) => (
                        <tr
                          key={key}
                          className="group hover:bg-background/55 transition-colors"
                        >
                          <td className="w-28 shrink-0 px-3 py-2 font-medium text-muted-foreground">
                            {label}
                          </td>
                          <td className="break-all px-3 py-2 font-mono text-xs">
                            {parsed[key] || (
                              <span className="text-muted-foreground italic">
                                (空)
                              </span>
                            )}
                          </td>
                          <td className="w-10 px-2 py-2">
                            <CopyButton text={parsed[key]} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium">Search 参数</h3>
                  <span className="text-xs text-muted-foreground">
                    {queryParams.length} 个参数
                  </span>
                </div>
                {queryParams.length ? (
                  <div className="overflow-hidden rounded-md bg-muted/35">
                    <table className="w-full table-fixed text-sm">
                      <thead className="text-left text-xs text-muted-foreground">
                        <tr>
                          <th className="w-[24%] px-3 py-2 font-medium">Key</th>
                          <th className="px-3 py-2 font-medium">Value</th>
                          <th className="w-28 px-3 py-2 font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queryParams.map((param) => {
                          const isDecoded = decodedParams.has(param.id);
                          const key = isDecoded ? param.decodedKey : param.rawKey;
                          const value = isDecoded
                            ? param.decodedValue
                            : param.rawValue;

                          return (
                            <tr
                              key={param.id}
                              className="align-top hover:bg-background/55 transition-colors"
                            >
                              <td className="break-all px-3 py-2 font-mono text-xs">
                                {key || (
                                  <span className="text-muted-foreground italic">
                                    (空)
                                  </span>
                                )}
                              </td>
                              <td className="break-all px-3 py-2 font-mono text-xs">
                                {value || (
                                  <span className="text-muted-foreground italic">
                                    (空)
                                  </span>
                                )}
                                {isDecoded && param.decodeError && (
                                  <div className="mt-1 text-xs text-destructive">
                                    部分内容无法 decode
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <Button
                                  variant={isDecoded ? "secondary" : "outline"}
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => toggleDecoded(param.id)}
                                >
                                  {isDecoded ? "Raw" : "Decode"}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-md bg-muted/25 px-4 py-6 text-center text-sm text-muted-foreground">
                    当前 URL 没有 search 参数
                  </div>
                )}
              </section>
            </>
          )}

          {!url && (
            <div className="rounded-md bg-muted/25 px-4 py-10 text-center text-sm text-muted-foreground">
              输入 URL 后展示组成、参数和二维码
            </div>
          )}
        </div>

        <aside className="rounded-md bg-muted/35 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium">二维码</h3>
            {dataUrl && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-1 h-3 w-3" />
                下载
              </Button>
            )}
          </div>
          {dataUrl ? (
            <div className="flex justify-center">
              <img
                src={dataUrl}
                alt="URL QR Code"
                className="rounded-md bg-white p-2"
                width={220}
                height={220}
              />
            </div>
          ) : (
            <div className="flex min-h-56 items-center justify-center rounded-md bg-background/45 px-4 text-center text-sm text-muted-foreground">
              输入 URL 后自动生成
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
