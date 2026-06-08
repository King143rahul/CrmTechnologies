import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  fetchNavigation,
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
  addToCart,
} from "@/api/medusa";

// --- Queries ---

export function useProducts(params?: any) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useNavigation() {
  return useQuery({
    queryKey: ["navigation"],
    queryFn: fetchNavigation,
  });
}

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });
}

// --- Mutations ---

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      addToCart(variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateCartItemQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

