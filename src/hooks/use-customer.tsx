
"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
// @ts-ignore
import type { Customer } from "@medusajs/medusa";
import { getSessionAction } from "@/lib/actions/customer";

interface CustomerContextType {
  customer: Customer | null;
  isLoading: boolean;
  refetchCustomer: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomer = useCallback(async () => {
    setIsLoading(true);
    const result = await getSessionAction();
    if (result.success && result.data) {
      setCustomer(result.data);
    } else {
      setCustomer(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const refetchCustomer = async () => {
    await fetchCustomer();
  };

  return (
    <CustomerContext.Provider value={{ customer, isLoading, refetchCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
