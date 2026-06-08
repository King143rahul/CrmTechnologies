import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { ShopByCategory } from "../components/ShopByCategory";
import { useProducts, useNavigation } from "../hooks/useQueries";
import { ChevronRight } from "lucide-react";
import { getCategoryIcon } from "../components/SiteHeader";

export const Route = createFileRoute("/")({
  component: Index,
});

// Product Card Skeleton
function ProductSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 flex flex-col relative animate-pulse h-full">
      <div className="aspect-square bg-slate-100 mb-4 w-full" />
      <div className="flex flex-col flex-1 gap-2 mt-2">
        <div className="h-3 bg-slate-200 w-1/3" />
        <div className="h-4 bg-slate-200 w-full" />
        <div className="h-4 bg-slate-200 w-2/3 mb-2" />
        <div className="h-3 bg-slate-200 w-1/4 mb-3" />
        <div className="h-10 bg-slate-200 w-full mt-auto" />
      </div>
    </div>
  );
}

function SidebarMenu() {
  const { data: navigationData, isLoading } = useNavigation();
  const [activeCategory, setActiveCategory] = useState<any>(null);

  if (isLoading) {
    return <div className="w-full h-[450px] bg-slate-50 animate-pulse border border-slate-200 rounded-xl shadow-sm"></div>;
  }

  return (
    <div 
      className="w-full bg-white border border-slate-200 rounded-xl shadow-sm relative"
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="bg-slate-900 text-white font-bold px-5 py-3.5 text-xs uppercase tracking-wider rounded-t-xl flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
        Shop by Department
      </div>
      <ul className="flex flex-col relative z-20">
        {navigationData?.map((cat: any) => {
          const isActive = activeCategory?.title === cat.title;
          return (
            <li 
              key={cat.title} 
              className="border-b border-slate-100 last:border-b-0 last:rounded-b-xl group cursor-pointer transition-colors relative"
              onMouseEnter={() => setActiveCategory(cat)}
            >
              <div 
                className={`flex items-center justify-between px-5 py-3.5 text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-slate-50 text-blue-600 pl-6 border-l-4 border-blue-600" 
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600 pl-5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"}`}>
                    {getCategoryIcon(cat.title)}
                  </span>
                  <span className="tracking-wide">{cat.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  isActive ? "text-blue-600 translate-x-1" : "text-slate-300 group-hover:text-blue-500"
                }`} />
              </div>
            </li>
          );
        })}
      </ul>

      {/* Flyout Panel */}
      {activeCategory && (
        <div 
          className="absolute left-[calc(100%-2px)] top-0 w-[680px] bg-white border border-slate-200 border-l-0 shadow-2xl rounded-r-2xl z-[100] p-7 flex flex-col min-h-full h-fit max-h-[600px] overflow-y-auto animate-fade-in"
          style={{ 
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.98)'
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <span className="text-blue-600 bg-blue-50 p-2 rounded-lg">
              {getCategoryIcon(activeCategory.title)}
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                {activeCategory.title}
              </h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
                {activeCategory.subcategories.length} Departments
              </p>
            </div>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-3 gap-x-6 gap-y-6">
            {activeCategory.subcategories.map((sub: any) => {
              const hasItems = sub.items && sub.items.length > 0;
              return (
                <div key={sub.name} className="flex flex-col gap-2 group/sub">
                  <span className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
                    <span className="w-1 h-1 bg-slate-300 rounded-full group-hover/sub:bg-blue-600 group-hover/sub:scale-125 transition-all"></span>
                    {sub.name}
                  </span>
                  {hasItems && (
                    <div className="flex flex-col gap-1.5 pl-3 border-l border-slate-200 ml-1">
                      {sub.items.map((item: string) => (
                        <Link 
                          key={item} 
                          to="/" 
                          className="text-xs font-semibold text-slate-500 hover:text-blue-600 hover:underline transition-colors"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Index() {
  const { data: products, isLoading, isError } = useProducts();

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1730px] mx-auto px-4 py-6">
        
        {/* Top Section: Sidebar + Main Banner */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          
          {/* Left Sidebar (Hidden on mobile) */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <SidebarMenu />
            
            {/* Promo Box below categories */}
            <div className="mt-6 bg-slate-50 border border-slate-200 p-5 rounded-xl shadow-sm">
               <h4 className="font-bold text-slate-900 mb-2">Need Help Building Your PC?</h4>
               <p className="text-sm text-slate-600 mb-4">Our tech experts are ready to assist with custom builds and component recommendations.</p>
               <button className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-slate-800 transition-colors">
                 Chat with an Expert
               </button>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Main Promotional Banner */}
            <div className="w-full h-[400px] bg-slate-900 rounded-2xl shadow-md flex items-center relative overflow-hidden border border-slate-800">
              {/* Simple geometric pattern for B2B look instead of glowing mesh */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
              
              <div className="relative z-10 px-8 md:px-12 max-w-2xl">
                <div className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 mb-4 uppercase tracking-wider rounded-sm">
                  Weekend Flash Sale
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight uppercase">
                  Epic Gaming & PC Deals.
                </h1>
                <p className="text-slate-300 text-base md:text-lg mb-8 max-w-lg">
                  Level up your setup with next-generation graphics cards, high-performance laptops, and gaming gear. Limited stock available.
                </p>
                <div className="flex gap-4">
                  <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg text-sm hover:bg-blue-700 transition-colors border border-blue-600 shadow-sm">
                    Shop Laptops
                  </button>
                  <button className="bg-transparent text-white font-bold px-8 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors border border-white">
                    View Components
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-promo banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-center transition-shadow hover:shadow-md">
                 <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Graphics Cards</span>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Next-Gen GPUs</h3>
                 <a href="#" className="text-sm font-bold text-slate-700 hover:text-blue-600 underline">Shop Nvidia & AMD →</a>
               </div>
               <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-center transition-shadow hover:shadow-md">
                 <span className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Storage</span>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Lightning Fast NVMe</h3>
                 <a href="#" className="text-sm font-bold text-slate-700 hover:text-blue-600 underline">Shop SSDs →</a>
               </div>
            </div>

          </div>
        </div>

        {/* Category Carousel (Static style) */}
        <div className="border-t border-slate-200 pt-10 mb-10">
          <ShopByCategory />
        </div>

        {/* Product Grid */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase">
              Top Sellers
            </h2>
            <a href="#" className="text-sm font-bold text-blue-600 hover:underline">View All</a>
          </div>
          
          {/* Dense grid: 4 columns on desktop, 2 on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {isLoading && (
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </>
            )}
            {isError && (
              <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                Failed to load products. Please try again later.
              </div>
            )}
            {products &&
              products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>
        
      </div>
    </main>
  );
}
