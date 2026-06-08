import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/gaming")({
  head: () => ({ meta: [{ title: "Gaming — Laptops Direct" }, { name: "description", content: "Gaming PCs, laptops, monitors and accessories." }] }),
  component: () => <CategoryPage title="Gaming" blurb="Build your battlestation — gaming PCs, laptops, peripherals and accessories." subcategories={["Gaming PCs", "Gaming Laptops", "Monitors", "Headsets", "Keyboards", "Mice", "Chairs"]} />,
});
