import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/components")({
  head: () => ({ meta: [{ title: "Components & Storage — Laptops Direct" }] }),
  component: () => <CategoryPage title="Components & Storage" blurb="Build or upgrade — CPUs, GPUs, RAM, SSDs and more." subcategories={["CPUs", "GPUs", "Motherboards", "RAM", "SSD", "HDD", "Power Supplies", "Cases"]} />,
});
