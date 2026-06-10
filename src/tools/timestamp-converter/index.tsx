import { Clock } from "lucide-react";
import type { ToolPlugin } from "@/plugins/types";
import TimestampPanel from "./ToolPanel";

export const timestampConverterPlugin: ToolPlugin = {
  id: "timestamp-converter",
  name: "时间戳转换器",
  description: "Unix 时间戳与日期时间互转",
  icon: Clock,
  category: "converter",
  component: TimestampPanel,
};
