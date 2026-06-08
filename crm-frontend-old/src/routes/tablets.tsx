import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/tablets")({
  head: () => ({ meta: [{ title: "Tablets & E-Readers — Laptops Direct" }, { name: "description", content: "Tablets and e-readers from all top brands." }] }),
  component: () => <CategoryPage title="Tablets & E-Readers" blurb="Lightweight tablets and dedicated e-readers for reading, drawing and more." subcategories={["All Tablets", "iPad", "Android", "Windows", "E-Readers", "Kids"]} />,
});
