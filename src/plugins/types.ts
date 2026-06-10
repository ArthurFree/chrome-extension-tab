import type { FC, ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export type ToolCategory = "dev" | "converter" | "generator" | string;

export interface ToolPlugin {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }> | LucideIcon;
  category: ToolCategory;
  component: FC;
  version?: string;
  author?: string;
}
