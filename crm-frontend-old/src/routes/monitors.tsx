import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/monitors")({
  head: () => ({ meta: [{ title: "Monitors — Laptops Direct" }, { name: "description", content: "Gaming, office and ultrawide monitors." }] }),
  component: () => <CategoryPage title="Monitors" blurb="Gaming, ultrawide, 4K and curved displays from the brands you trust." subcategories={["All Monitors", "Gaming", "4K", "Ultrawide", "Curved", "Office"]} />,
});
