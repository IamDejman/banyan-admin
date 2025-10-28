"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import PaymentConfigurationsClient from "./PaymentConfigurationsClient";

export default function PaymentConfigurationsPage() {
  const router = useRouter();

  useEffect(() => {
    // Remove _rsc query parameter from URL if present
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('_rsc')) {
        url.searchParams.delete('_rsc');
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
  }, [router]);

  return (
    <div className="container mx-auto py-6">
      <PaymentConfigurationsClient />
    </div>
  );
}
