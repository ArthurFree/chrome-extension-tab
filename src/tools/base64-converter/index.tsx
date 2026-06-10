import { ArrowLeftRight } from "lucide-react";
import type { ToolPlugin } from "@/plugins/types";
import Base64Panel from "./ToolPanel";

export const base64ConverterPlugin: ToolPlugin = {
  id: "base64-converter",
  name: "Base64 编解码",
  description: "文本与 Base64 双向转换",
  icon: ArrowLeftRight,
  category: "converter",
  component: Base64Panel,
};
