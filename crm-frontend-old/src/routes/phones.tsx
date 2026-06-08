import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/phones")({
  head: () => ({ meta: [{ title: "Phones — Laptops Direct" }] }),
  component: () => <CategoryPage title="Phones" blurb="Smartphones, SIM-free handsets and accessories." subcategories={["All Phones", "iPhone", "Samsung", "Google", "SIM-Free", "Refurbished", "Cases"]} />,
});
