"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Service } from "@/types/service";
import { formatServicePrice } from "@/lib/services";

export type Currency = "INR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (service: Service) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  useEffect(() => {
    // Read saved preference from localStorage or cookie
    try {
      const saved = localStorage.getItem("tarot_currency") as Currency | null;
      if (saved === "INR" || saved === "USD") {
        setCurrencyState(saved);
        return;
      }
    } catch {
      // ignore
    }

    // Check cookie
    try {
      const match = document.cookie.match(/(^|;)\s*tarot_currency=([^;]+)/);
      if (match && (match[2] === "INR" || match[2] === "USD")) {
        setCurrencyState(match[2] as Currency);
      }
    } catch {
      // ignore
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem("tarot_currency", newCurrency);
      document.cookie = `tarot_currency=${newCurrency};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  const formatPrice = (service: Service): string => {
    return formatServicePrice(service, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
