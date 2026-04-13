import { createContext, useContext } from 'react';

export const ModuleThemeContext = createContext<string | null>(null);

export function useModuleTheme(): string | null {
  return useContext(ModuleThemeContext);
}
