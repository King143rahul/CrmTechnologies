import { createFileRoute } from "@tanstack/react-router";
import { Star, Truck, ShieldCheck, CheckCircle } from "lucide-react";
import { formatZAR } from "../lib/formatPrice";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetailRoute,
});

import { useProduct, useAddToCart } from "../hooks/useQueries";
import { toast } from "sonner";

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="aspect-square bg-slate-100 rounded-3xl" />
        <div className="flex flex-col pt-8">
          <div className="w-24 h-4 bg-slate-100 rounded mb-4" />
          <div className="w-3/4 h-12 bg-slate-100 rounded mb-8" />
          <div className="w-32 h-8 bg-slate-100 rounded mb-12" />
          <div className="w-full h-32 bg-slate-100 rounded mb-8" />
          <div className="w-full h-12 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProductDetailRoute() {
  const { productId } = Route.useParams();
  const { data: product, isLoading, isError } = useProduct(productId);
  const addToCartMutation = useAddToCart();

  if (isLoading) return <main className="bg-white min-h-screen"><ProductDetailSkeleton /></main>;
  if (isError || !product) return (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-slate-500 text-lg">Product not found.</div>
    </main>
  );

  const handleAddToCart = () => {
    if (!product.variantId) {
      toast.error("Cannot add product: No active variant found");
      return;
    }

    addToCartMutation.mutate(
      { variantId: product.variantId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success("Added to cart!");
        },
        onError: (error) => {
          toast.error("Failed to add to cart: " + error.message);
        },
      }
    );
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center p-8 relative overflow-hidden group">
              {/* Fallback Image */}
              <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                <span className="text-xl font-medium tracking-widest uppercase">
                  {product.brand}
                </span>
              </div>
            </div>
            {/* Thumbnail grid placeholder */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-slate-50 rounded-xl cursor-pointer hover:ring-2 hover:ring-blue-600 transition-all"></div>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">
              {product.brand}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                {product.reviewCount} Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-col mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-slate-900">
                  {formatZAR(product.price, true)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-slate-400 line-through">
                    {formatZAR(product.originalPrice, true)}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-slate-500 mt-1">
                incl. VAT
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Specs */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                Key Specifications
              </h3>
              <ul className="space-y-3">
                {product.specs.map((spec: any) => (
                  <li key={spec.name} className="flex justify-between text-sm">
                    <span className="text-slate-500">{spec.name}</span>
                    <span className="text-slate-900 font-medium text-right max-w-[60%]">
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-emerald-600 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">In Stock - Ready to Ship</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-red-600 mb-4 block">Out of Stock</span>
              )}
              
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || !product.inStock}
                  className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </button>
                <button className="px-8 py-4 rounded-full font-bold bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors duration-300">
                  Save
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Free Next-Day Delivery</h4>
                  <p className="text-xs text-slate-500">On enterprise orders over R 500</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">3-Year Warranty</h4>
                  <p className="text-xs text-slate-500">Official manufacturer guarantee</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
