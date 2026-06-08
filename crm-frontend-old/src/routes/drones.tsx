import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/drones")({
  head: () => ({ meta: [{ title: "Drones — Laptops Direct" }] }),
  component: () => <CategoryPage title="Drones" blurb="Consumer and pro drones with 4K cameras and obstacle avoidance." subcategories={["All Drones", "Beginner", "Camera Drones", "FPV", "Professional", "Accessories"]} />,
});
