import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  SEO_INDEX_CACHE_TAG,
  SEO_INDEX_REVALIDATE_PATHS,
} from "@/lib/api/seo-index";
import { authorizeSeoIndexRevalidation } from "@/lib/seo/authorize-seo-index-revalidation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  const decision = authorizeSeoIndexRevalidation(
    request.headers.get("x-revalidate-secret"),
    process.env.SEO_REVALIDATE_SECRET,
  );

  if (decision === "unconfigured") {
    return NextResponse.json(
      { error: "Revalidação do índice de busca não configurada." },
      { status: 503 },
    );
  }

  if (decision !== "ok") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  revalidateTag(SEO_INDEX_CACHE_TAG, "max");
  for (const path of SEO_INDEX_REVALIDATE_PATHS) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true });
}
