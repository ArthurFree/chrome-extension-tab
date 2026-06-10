import { LinkIcon } from "lucide-react";
import type { ToolPlugin } from "@/plugins/types";
import UrlParserPanel from "./ToolPanel";

export const urlParserPlugin: ToolPlugin = {
  id: "url-parser",
  name: "URL 解析与二维码",
  description: "解析 URL、拆分参数并生成二维码",
  icon: LinkIcon,
  category: "dev",
  component: UrlParserPanel,
};
