import { QrCode } from "lucide-react";
import type { ToolPlugin } from "@/plugins/types";
import QrCodePanel from "./ToolPanel";

export const qrCodePlugin: ToolPlugin = {
  id: "qrcode-generator",
  name: "二维码生成器",
  description: "将文本或 URL 转换为二维码",
  icon: QrCode,
  category: "generator",
  component: QrCodePanel,
};
