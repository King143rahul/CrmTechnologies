import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { formatZAR } from "../lib/formatPrice";
import { useAddToCart } from "../hooks/useQueries";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    brand: string;
    imageUrl: string;
    originalPrice?: number;
    rating?: number;
    inStock?: boolean;
    specs?: { name: string; value: string }[];
    variantId?: string;
  };
  vatIncluded?: boolean;
}

export function ProductCard({ product, vatIncluded = true }: ProductCardProps) {
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    <Link
      to="/products/$productId"
      params={{ productId: product.id }}
      className="group bg-white p-5 border border-slate-100 shadow-sm hover:border-blue-100 hover:shadow-xl transition-all duration-300 flex flex-col relative h-full rounded-2xl"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {savings > 0 && (
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
            Save {formatZAR(savings, vatIncluded)}
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="aspect-square bg-slate-50 rounded-xl mb-4 p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1">
          {product.brand} • SKU: {product.id.split('-')[0].toUpperCase()}
        </span>
        <h3 className="text-sm text-slate-900 font-bold leading-snug mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
          {product.title}
        </h3>
        
        {/* Specs List */}
        {product.specs && product.specs.length > 0 && (
          <ul className="mb-4 space-y-1">
            {product.specs.slice(0, 4).map((spec, index) => (
              <li key={index} className="text-[11px] text-slate-600 flex items-start gap-1">
                <span className="w-1 h-1 bg-slate-400 mt-1.5 flex-shrink-0" />
                <span className="line-clamp-1"><strong className="font-bold text-slate-800">{spec.name}:</strong> {spec.value}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100">
          {/* Price Block */}
          <div className="flex flex-col mb-3">
            <div className="flex items-baseline gap-2 flex-wrap">
               <span className="text-xl font-black text-slate-900">
                 {formatZAR(product.price, vatIncluded)}
               </span>
               {product.originalPrice && (
                 <span className="text-xs text-slate-500 line-through font-semibold">
                   {formatZAR(product.originalPrice, vatIncluded)}
                 </span>
               )}
            </div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              {vatIncluded ? "Prices include VAT" : "excl. VAT"}
            </span>
          </div>

          {/* Stock & Action */}
          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-1.5 mb-1">
               <div className={`w-2 h-2 ${product.inStock !== false ? 'bg-green-600' : 'bg-red-600'}`} />
               <span className={`text-[11px] font-bold uppercase tracking-wider ${product.inStock !== false ? 'text-green-700' : 'text-red-700'}`}>
                 {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
               </span>
             </div>
             
             <button 
                className="w-full bg-slate-900 text-white py-2.5 font-bold text-[13px] uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-md rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={addToCartMutation.isPending || product.inStock === false}
                onClick={handleAddToCart}
             >
                <ShoppingCart className="w-4 h-4" />
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
             </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

