import { useCategories } from "../hooks/useQueries";

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-full aspect-[4/3] bg-slate-100 rounded-2xl" />
      <div className="mt-4 w-24 h-5 bg-slate-100 rounded" />
    </div>
  );
}

export function ShopByCategory() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <section className="bg-white py-16 overflow-hidden rounded-3xl mb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12 text-center text-slate-900">
          Shop by Category
        </h2>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {isLoading && (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <CategorySkeleton key={i} />
              ))}
            </>
          )}
          {isError && (
            <div className="col-span-full text-center text-slate-500">
              Failed to load categories.
            </div>
          )}
          {categories &&
            categories.map((category: any) => (
              <div
                key={category.title}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-lg transition-all duration-500">
                  <img
                    src={category.imageUrl}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Category Label */}
                <span className="text-sm md:text-base font-semibold text-slate-900 mt-4 text-center group-hover:text-blue-600 transition-colors duration-300">
                  {category.title}
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
