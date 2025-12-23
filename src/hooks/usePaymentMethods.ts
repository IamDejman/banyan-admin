import { useState, useEffect } from 'react';
import { getPaymentConfigurations } from '@/app/services/dashboard';

export interface PaymentMethod {
  id: string | number;
  name: string;
  code: string;
  description: string;
  applicable_claim_types?: string;
  terms_and_conditions: string;
  active: number;
  created_at?: string;
  updated_at?: string;
}

export interface UsePaymentMethodsReturn {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePaymentMethods(): UsePaymentMethodsReturn {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPaymentConfigurations();

      let paymentData: PaymentMethod[] = [];

      // Handle different response structures
      if (Array.isArray(response)) {
        paymentData = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        const apiResponse = response as { data?: PaymentMethod[] };
        paymentData = apiResponse.data || [];
      }

      // Filter only active payment methods
      const activePaymentMethods = paymentData.filter(method => method.active === 1);
      
      setPaymentMethods(activePaymentMethods);
    } catch (err) {
      console.error('❌ Error fetching payment configurations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payment methods');
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
    loading,
    error,
    refetch: fetchPaymentMethods,
  };
}





