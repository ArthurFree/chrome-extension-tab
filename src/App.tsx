import { useState, useEffect } from "react";
import { ToolRegistryProvider, useToolRegistry } from "@/plugins/registry";
import { useSystemTheme } from "@/hooks/use-theme";
import Header from "@/components/Header";
import ToolGrid from "@/components/ToolGrid";
import { urlParserPlugin } from "@/tools/url-parser";
import { timestampConverterPlugin } from "@/tools/timestamp-converter";
import { base64ConverterPlugin } from "@/tools/base64-converter";

function AppInner() {
  const { tools, registerTool } = useToolRegistry();
  const [searchQuery, setSearchQuery] = useState("");

  useSystemTheme();

  useEffect(() => {
    registerTool(urlParserPlugin);
    registerTool(timestampConverterPlugin);
    registerTool(base64ConverterPlugin);
  }, [registerTool]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55">
        <div className="px-3 py-3 sm:px-4 lg:px-5">
          <Header onSearch={setSearchQuery} toolCount={tools.length} />
        </div>
      </div>
      <main className="px-3 pb-3 sm:px-4 lg:px-5">
        <ToolGrid tools={tools} searchQuery={searchQuery} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToolRegistryProvider>
      <AppInner />
    </ToolRegistryProvider>
  );
}
