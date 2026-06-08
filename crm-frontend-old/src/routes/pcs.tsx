import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/pcs")({
  head: () => ({ meta: [{ title: "PCs — Laptops Direct" }, { name: "description", content: "Desktop PCs, all-in-ones and mini PCs." }] }),
  component: () => <CategoryPage title="PCs" blurb="Desktop, all-in-one and mini PCs for work, study and play." subcategories={["All PCs", "Gaming PCs", "All-in-One", "Mini PC", "Workstation", "Refurbished"]} />,
});
