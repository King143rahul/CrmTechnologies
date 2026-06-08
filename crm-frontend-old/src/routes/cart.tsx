import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: CartRoute,
});


import { useCart, useUpdateCartQuantity, useRemoveCartItem } from "../hooks/useQueries";
import { formatZAR } from "../lib/formatPrice";

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-pulse">
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
        {[1, 2].map((i) => (
          <div key={i} className="py-6 flex gap-6 border-b border-slate-100 last:border-0">
            <div className="w-24 h-24 bg-slate-100 rounded-xl" />
            <div className="flex-1">
              <div className="w-16 h-3 bg-slate-100 mb-2 rounded" />
              <div className="w-3/4 h-5 bg-slate-100 rounded" />
              <div className="w-full flex justify-between mt-6">
                <div className="w-24 h-8 bg-slate-100 rounded-full" />
                <div className="w-16 h-5 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm h-fit">
        <div className="w-32 h-6 bg-slate-100 rounded mb-6" />
        <div className="space-y-4 mb-6">
          <div className="w-full h-4 bg-slate-100 rounded" />
          <div className="w-full h-4 bg-slate-100 rounded" />
          <div className="w-full h-4 bg-slate-100 rounded" />
        </div>
        <div className="w-full h-12 bg-slate-100 rounded-full mt-8" />
      </div>
    </div>
  );
}

function CartRoute() {
  const { data: cartItems, isLoading } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeItem = useRemoveCartItem();

  const subtotal = cartItems?.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) || 0;
  const tax = subtotal - (subtotal / 1.15); // VAT is 15% (extract from inclusive subtotal)
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25.0;
  const total = subtotal + shipping;

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-8">
          Shopping Cart
        </h1>

        {isLoading ? (
          <CartSkeleton />
        ) : cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <ul className="divide-y divide-gray-100">
                  {cartItems.map((item: any) => (
                    <li key={item.id} className="py-6 flex gap-6">
                      <div className="w-24 h-24 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center text-xs text-slate-400">
                        IMG
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div>
                            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1 block">
                              {item.brand}
                            </span>
                            <h3 className="text-base font-medium text-slate-900">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-lg font-bold text-slate-900 ml-4 whitespace-nowrap">
                            {formatZAR(item.price * item.quantity, true)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center bg-slate-50 rounded-full px-2 py-1">
                            <button 
                              onClick={() => updateQuantity.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                              disabled={updateQuantity.isPending}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-slate-900">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity.mutate({ id: item.id, quantity: item.quantity + 1 })}
                              disabled={updateQuantity.isPending}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem.mutate(item.id)}
                            disabled={removeItem.isPending}
                            className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal (excl. VAT)</span>
                    <span className="font-medium text-slate-900">{formatZAR(subtotal, false)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">VAT (15%)</span>
                    <span className="font-medium text-slate-900">{formatZAR(tax, true)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-medium text-slate-900">
                      {shipping === 0 ? "Free" : formatZAR(shipping, true)}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mb-8">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">Total (incl. VAT)</span>
                    <span className="text-2xl font-extrabold text-slate-900">{formatZAR(total, true)}</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-full font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 flex items-center justify-center gap-2 group">
                  Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-xs text-center text-slate-500 mt-4">
                  Secure checkout. 30-day returns on all enterprise hardware.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
            <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
