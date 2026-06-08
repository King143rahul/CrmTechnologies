import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/accessories")({
  head: () => ({ meta: [{ title: "Accessories & Printing — Laptops Direct" }] }),
  component: () => <CategoryPage title="Accessories & Printing" blurb="Keyboards, mice, printers, ink and everything else you need." subcategories={["Keyboards", "Mice", "Printers", "Ink & Toner", "Cables", "Bags", "Webcams"]} />,
});
