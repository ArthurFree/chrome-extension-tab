import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ToolPlugin } from "@/plugins/types";

interface ToolCardProps {
  tool: ToolPlugin;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;
  const categoryLabel: Record<string, string> = {
    dev: "开发",
    converter: "转换器",
    generator: "生成器",
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-colors hover:border-ring/40">
      <CardHeader className="border-b bg-muted/25 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background shadow-xs">
              <Icon className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base">{tool.name}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2 text-xs leading-5">
                {tool.description}
              </CardDescription>
            </div>
          </div>
          <span className="shrink-0 rounded-md border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {categoryLabel[tool.category] || tool.category}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <tool.component />
      </CardContent>
    </Card>
  );
}
