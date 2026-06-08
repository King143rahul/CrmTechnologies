import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/deals")({
  head: () => ({ meta: [{ title: "Deals & Promotions — Laptops Direct" }] }),
  component: () => <CategoryPage title="Deals & Promotions" blurb="This week's best prices across laptops, gaming, monitors and more." subcategories={["All Deals", "Under £500", "Gaming", "Laptops", "Monitors", "Clearance"]} />,
});
