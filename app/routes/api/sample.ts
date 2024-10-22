import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

export const Route = createAPIFileRoute("/api/sample")({
  GET: ({ request, params }) => {
    return json({ message: "Hello /api/sample" });
  },
});
