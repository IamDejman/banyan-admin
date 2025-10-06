"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettlementsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Create Offers page since Settlements is no longer a direct navigation item
    router.replace('/dashboard/settlements/create-offers');
  }, [router]);

  return null; // This component will redirect immediately
} 