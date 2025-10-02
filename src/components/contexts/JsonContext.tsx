'use client'
import { createContext, useContext, useState, ReactNode } from "react";

interface JsonContextProps {
  activeJson: string | undefined;
  setActiveJson: React.Dispatch<React.SetStateAction<string | undefined>>;
  validJson: boolean;
  setValidJson: React.Dispatch<React.SetStateAction<boolean>>;
}

const JsonContext = createContext<JsonContextProps | undefined>(undefined);

export function JsonProvider({ children }: { children: ReactNode }) {
  const [activeJson, setActiveJson] = useState<string | undefined>();
  const [validJson, setValidJson] = useState<boolean>(false);

  return (
    <JsonContext.Provider value={{ activeJson, setActiveJson, validJson, setValidJson }}>
      {children}
    </JsonContext.Provider>
  );
}

export function useJsonContext() {
  const context = useContext(JsonContext);
  if (!context) {
    throw new Error("useJsonContext must be used within a JsonProvider");
  }
  return context;
}

