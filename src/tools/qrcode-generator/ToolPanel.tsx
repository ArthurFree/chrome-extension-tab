import { useState, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import { Download, Eraser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function QrCodePanel() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl("");
      setError("");
      return;
    }
    QRCode.toDataURL(text, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => {
        setDataUrl(url);
        setError("");
      })
      .catch(() => {
        setDataUrl("");
        setError("生成失败，请检查输入内容");
      });
  }, [text]);

  const handleDownload = useCallback(() => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  }, [dataUrl]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="输入文本或 URL..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1"
        />
        {text && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setText("")}
            aria-label="清空"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        )}
      </div>
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {dataUrl ? (
        <div className="flex flex-col items-center gap-3 rounded-md bg-muted/35 p-4">
          <img
            src={dataUrl}
            alt="QR Code"
            className="rounded-md bg-white p-2"
            width={200}
            height={200}
          />
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-3 w-3" />
            下载 PNG
          </Button>
        </div>
      ) : (
        <div className="rounded-md bg-muted/25 px-4 py-8 text-center text-sm text-muted-foreground">
          输入内容后自动生成二维码
        </div>
      )}
    </div>
  );
}
