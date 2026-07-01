import useSWR from "swr";
import { lookupOrderAction } from "@/src/actions/lookupAction";

export function useCustomerOrders(phone: string) {
  const isValid = phone.length === 10;
  
  const fetcher = () => lookupOrderAction(phone);

  const { data, error, isLoading, mutate } = useSWR(
    isValid ? `customer_orders_${phone}` : null,
    fetcher
  );

  return {
    orders: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
