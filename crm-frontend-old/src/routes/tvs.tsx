import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/tvs")({
  head: () => ({ meta: [{ title: "TVs — Laptops Direct" }] }),
  component: () => <CategoryPage title="TVs" blurb="4K, OLED, QLED and smart TVs from leading brands." subcategories={["All TVs", "OLED", "QLED", "4K", "Smart TVs", "Soundbars"]} />,
});
