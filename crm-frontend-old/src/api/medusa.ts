import Medusa from "@medusajs/js-sdk";

const MEDUSA_BACKEND_URL = "http://localhost:9000";

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: true,
  publishableKey: "pk_858f6bf32d7328ecf468a7f88ef53f6de1b34fb0a01f48c9fe0f31e3e35d5918",
});

// A cookie helper to read and write the cart ID across SSR and Client environments
export function getCartId(headers?: Headers) {
  if (typeof window === "undefined") {
    const cookieHeader = headers?.get("cookie") || "";
    const match = cookieHeader.match(/medusa_cart_id=([^;]+)/);
    return match ? match[1] : null;
  } else {
    const match = document.cookie.match(/medusa_cart_id=([^;]+)/);
    return match ? match[1] : null;
  }
}

export function setCartId(id: string) {
  if (typeof window !== "undefined") {
    document.cookie = `medusa_cart_id=${id}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export async function getOrCreateCartId(): Promise<string> {
  let cartId = getCartId();
  if (!cartId) {
    try {
      const { regions } = await sdk.store.region.list();
      const regionId = regions?.[0]?.id || undefined;
      const { cart } = await sdk.store.cart.create({
        region_id: regionId
      });
      cartId = cart.id;
      setCartId(cartId!);
    } catch (e) {
      console.error("Failed to create cart with region list, retrying with defaults:", e);
      const { cart } = await sdk.store.cart.create({});
      cartId = cart.id;
      setCartId(cartId!);
    }
  }
  return cartId!;
}

function mapMedusaProduct(p: any) {
  // Find cheapest variant or first variant
  const cheapestVariant = p.variants?.reduce((cheapest: any, current: any) => {
    if (!cheapest) return current;
    const cheapestPrice = cheapest.calculated_price?.calculated_amount || Infinity;
    const currentPrice = current.calculated_price?.calculated_amount || Infinity;
    return currentPrice < cheapestPrice ? current : cheapest;
  }, null) || p.variants?.[0];

  const priceInfo = cheapestVariant?.calculated_price;
  const price = priceInfo ? priceInfo.calculated_amount / 100 : 0;
  const originalPrice = priceInfo && priceInfo.original_amount !== priceInfo.calculated_amount 
    ? priceInfo.original_amount / 100 
    : undefined;

  // Determine brand from metadata or subtitle or default
  const brand = p.metadata?.brand || p.subtitle || "CRM Tech";

  // Ratings: generate deterministically from product ID so it looks rich
  const idHash = p.id.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const rating = 4.5 + (idHash % 6) * 0.1; // 4.5 to 5.0
  const reviewCount = 10 + (idHash % 190);

  // Specs: retrieve specs from metadata, or use generic ones for tech products if not provided
  let specs = p.metadata?.specs;
  if (!specs || !Array.isArray(specs)) {
    specs = [
      { name: "Brand", value: brand },
      { name: "SKU", value: cheapestVariant?.sku || p.id.substring(0, 8).toUpperCase() }
    ];
  }

  // Stock status
  const inStock = p.variants?.some((v: any) => v.inventory_quantity > 0) ?? true;

  return {
    id: p.id,
    title: p.title,
    price,
    originalPrice,
    brand,
    imageUrl: p.thumbnail || "/placeholder.svg",
    rating: parseFloat(rating.toFixed(1)),
    reviewCount,
    description: p.description || "",
    specs,
    inStock,
    variantId: cheapestVariant?.id,
  };
}

export async function fetchProducts(params?: any) {
  try {
    const query: any = {
      fields: "*variants.calculated_price,+variants.inventory_quantity",
    };
    
    if (params?.category_handle) {
      const { product_categories } = await sdk.store.category.list({
        handle: params.category_handle
      });
      if (product_categories?.length > 0) {
        query.category_id = product_categories[0].id;
      } else {
        const { product_categories: catsByName } = await sdk.store.category.list({
          q: params.category_handle
        });
        if (catsByName?.length > 0) {
          query.category_id = catsByName[0].id;
        }
      }
    }
    
    const { products } = await sdk.store.product.list(query);
    return products.map(mapMedusaProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function fetchProductById(id: string) {
  try {
    const { product } = await sdk.store.product.retrieve(id, {
      fields: "*variants.calculated_price,+variants.inventory_quantity"
    });
    return mapMedusaProduct(product);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

export async function fetchCategories() {
  try {
    const { product_categories } = await sdk.store.category.list();
    return product_categories.map((cat: any) => ({
      title: cat.name,
      imageUrl: cat.metadata?.imageUrl || "/placeholder.svg",
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function fetchNavigation() {
  try {
    const { product_categories } = await sdk.store.category.list({
      fields: "*category_children",
    });
    
    const parentCategories = product_categories.filter((cat: any) => !cat.parent_category_id);
    
    if (parentCategories.length === 0 && product_categories.length > 0) {
      return product_categories.map(mapNavigationCategory);
    }
    
    return parentCategories.map(mapNavigationCategory);
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return [];
  }
}

function mapNavigationCategory(cat: any): any {
  return {
    title: cat.name,
    subcategories: cat.category_children?.map((sub: any) => ({
      name: sub.name,
      items: sub.category_children?.map((child: any) => child.name) || [],
    })) || [],
  };
}

export async function fetchCart() {
  try {
    const cartId = getCartId();
    if (!cartId) return [];
    
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: "*items.product,*items.variant"
    });
    
    return cart.items?.map((item: any) => ({
      id: item.id, // line item ID
      variantId: item.variant_id,
      title: item.title,
      brand: item.product?.metadata?.brand || item.product?.subtitle || "CRM Tech",
      price: item.unit_price / 100,
      quantity: item.quantity,
      imageUrl: item.thumbnail || "/placeholder.svg",
    })) || [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

export async function addToCart(variantId: string, quantity: number) {
  try {
    const cartId = await getOrCreateCartId();
    await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });
    return fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function updateCartItemQuantity(lineItemId: string, newQuantity: number) {
  try {
    const cartId = getCartId();
    if (!cartId) throw new Error("No cart found");
    
    await sdk.store.cart.updateLineItem(cartId, lineItemId, {
      quantity: newQuantity,
    });
    return fetchCart();
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    throw error;
  }
}

export async function removeCartItem(lineItemId: string) {
  try {
    const cartId = getCartId();
    if (!cartId) throw new Error("No cart found");
    
    await sdk.store.cart.deleteLineItem(cartId, lineItemId);
    return fetchCart();
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
}
