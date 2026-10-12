"use client";

import React, { useEffect, useState } from "react";
import { Service } from "@/types/service";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPriceINR } from "@/lib/services";

interface PriceDisplayProps {
  service: Service;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ service, className }) => {
  const { formatPrice } = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR / hydration, render default INR to avoid hydration mismatch
  if (!mounted) {
    return <span className={className}>{formatPriceINR(service.price_inr)}</span>;
  }

  return <span className={className}>{formatPrice(service)}</span>;
};
