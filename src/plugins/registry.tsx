import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ToolPlugin } from "./types";

interface ToolRegistryContextValue {
  tools: ToolPlugin[];
  registerTool: (tool: ToolPlugin) => void;
  unregisterTool: (id: string) => void;
}

const ToolRegistryContext = createContext<ToolRegistryContextValue | null>(
  null
);

export function useToolRegistry() {
  const context = useContext(ToolRegistryContext);
  if (!context) {
    throw new Error(
      "useToolRegistry must be used within ToolRegistryProvider"
    );
  }
  return context;
}

export function ToolRegistryProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<ToolPlugin[]>([]);

  const registerTool = useCallback((tool: ToolPlugin) => {
    setTools((prev) => {
      if (prev.some((t) => t.id === tool.id)) {
        return prev.map((t) => (t.id === tool.id ? tool : t));
      }
      return [...prev, tool];
    });
  }, []);

  const unregisterTool = useCallback((id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToolRegistryContext.Provider value={{ tools, registerTool, unregisterTool }}>
      {children}
    </ToolRegistryContext.Provider>
  );
}
