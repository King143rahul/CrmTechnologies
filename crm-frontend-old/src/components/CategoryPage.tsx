import { ProductCard } from "./ProductCard";
import { useProducts } from "../hooks/useQueries";
import { Loader2 } from "lucide-react";

export function CategoryPage({ title, blurb, subcategories }: { title: string; blurb: string; subcategories: string[] }) {
  // Infer category handle, clean up characters like apostrophes
  const categoryHandle = title.toLowerCase().replace(/['’]/g, "").replace(/\s+/g, "-");
  
  const { data: products, isLoading, isError } = useProducts({ 
    category_handle: categoryHandle 
  });

  return (
    <main>
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-sm opacity-80">Shop / {title}</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-1 uppercase">{title}</h1>
          <p className="mt-2 max-w-2xl opacity-90">{blurb}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {subcategories.map((s) => (
            <a key={s} href="#" className="px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium whitespace-nowrap hover:border-blue-600 hover:text-blue-600 transition-colors">{s}</a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 mt-6 flex gap-6 pb-20">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="border border-slate-200 rounded-2xl p-5 bg-white sticky top-24">
            <h3 className="font-bold mb-3">Filter</h3>
            {[
              { h: "Brand", o: ["HP", "ASUS", "Dell", "Lenovo", "MSI"] },
              { h: "Price", o: ["Under R 3 000", "R 3 000 – R 6 000", "R 6 000 – R 10 000", "R 10 000+"] },
              { h: "Rating", o: ["4★ & up", "3★ & up"] },
            ].map((f) => (
              <div key={f.h} className="mt-4">
                <p className="font-semibold text-sm mb-2">{f.h}</p>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {f.o.map((o) => (
                    <li key={o}><label className="flex items-center gap-2"><input type="checkbox" className="accent-blue-600" /> {o}</label></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center min-h-[300px] text-red-600 font-semibold">
              Failed to load products. Please try again later.
            </div>
          ) : !products || products.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px] text-slate-500 font-semibold">
              No products found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-2">
              {products.map((p: any) => (
                <div key={p.id}><ProductCard product={p} /></div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

