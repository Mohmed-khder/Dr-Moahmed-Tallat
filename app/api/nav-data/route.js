import { NextResponse } from "next/server";
import { fetchArticleTypes, fetchContactTypes } from "../../lib/server-api";

export async function GET() {
  const [contactTypes, articleTypes] = await Promise.all([
    fetchContactTypes(),
    fetchArticleTypes(),
  ]);

  return NextResponse.json({
    contactTypes: Array.isArray(contactTypes) ? contactTypes : [],
    articleTypes: Array.isArray(articleTypes) ? articleTypes : [],
  });
}
