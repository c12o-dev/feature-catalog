import { searchIndex } from "@/lib/catalog";

// Served as a static file so the index isn't inlined into every page's RSC payload.
export const dynamic = "force-static";

export function GET() {
  return Response.json(searchIndex);
}
