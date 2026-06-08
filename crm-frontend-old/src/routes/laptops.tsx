import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/laptops")({
  head: () => ({ meta: [{ title: "Laptops — Laptops Direct" }, { name: "description", content: "Shop laptops from all major brands with free delivery." }] }),
  component: () => <CategoryPage title="Laptops" blurb="From everyday ultrabooks to powerful workstations — find the right laptop at the right price." subcategories={["All Laptops", "Gaming", "Business", "Student", "2-in-1", "Refurbished", "Apple MacBook", "Chromebook"]} />,
});
