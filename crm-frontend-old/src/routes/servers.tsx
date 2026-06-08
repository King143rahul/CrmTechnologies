import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/servers")({
  head: () => ({ meta: [{ title: "Servers & Networking — Laptops Direct" }] }),
  component: () => <CategoryPage title="Servers & Networking" blurb="Servers, switches, routers and enterprise networking." subcategories={["Servers", "Switches", "Routers", "Wi-Fi", "NAS", "Cables"]} />,
});
