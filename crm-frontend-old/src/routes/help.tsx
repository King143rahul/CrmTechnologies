import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help & Advice — Laptops Direct" }] }),
  component: HelpPage,
});

const topics = [
  { h: "Delivery", b: "Free standard delivery on thousands of items. Next-day available." },
  { h: "Returns", b: "30-day money-back guarantee on most products." },
  { h: "Finance", b: "0% interest available on orders over £99 with PayPal Credit." },
  { h: "Warranty", b: "Manufacturer warranty included with every product." },
  { h: "B2B", b: "Dedicated account managers for business customers." },
  { h: "Trade-in", b: "Sell your old phone or laptop and get up to £1250." },
];

function HelpPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl md:text-5xl font-extrabold">Help & Advice</h1>
      <p className="mt-2 text-slate-600 max-w-2xl">Browse common topics or get in touch with our team.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {topics.map((t) => (
          <article key={t.h} className="border border-slate-200 rounded-2xl p-6 bg-white">
            <h2 className="font-bold text-lg">{t.h}</h2>
            <p className="text-sm text-slate-600 mt-2">{t.b}</p>
            <a href="#" className="text-brand text-sm font-semibold mt-3 inline-block">Learn more →</a>
          </article>
        ))}
      </div>
    </main>
  );
}
