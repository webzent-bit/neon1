import { createFileRoute } from "@tanstack/react-router";
import NeonStreetShooter from "@/components/NeonStreetShooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neón Street Shooter — Arcade de disparos móvil" },
      {
        name: "description",
        content:
          "Juego arcade de disparos en primera persona: oleadas de enemigos, combos, coberturas y armas bonus con estética neón cómic.",
      },
      { property: "og:title", content: "Neón Street Shooter" },
      {
        property: "og:description",
        content: "Dispara por oleadas, encadena combos y cambia de arma en este arcade neón.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <NeonStreetShooter />;
}
