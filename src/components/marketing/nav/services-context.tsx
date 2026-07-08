"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ServiceNavItem } from "@/lib/servicos/nav";

const NavServicesContext = createContext<ServiceNavItem[]>([]);

interface NavServicesProviderProps {
  items: ServiceNavItem[];
  children: ReactNode;
}

export function NavServicesProvider({
  items,
  children,
}: NavServicesProviderProps) {
  return (
    <NavServicesContext.Provider value={items}>
      {children}
    </NavServicesContext.Provider>
  );
}

export function useNavServices(): ServiceNavItem[] {
  return useContext(NavServicesContext);
}
