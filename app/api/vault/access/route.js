import { NextResponse } from "next/server";
import { accessVault } from "../../../lib/server-api";

export async function POST(request) {
  try {
    const body = await request.json();
    const page = request.nextUrl.searchParams.get("page") || 1;
    const result = await accessVault(body?.password || "", page);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Vault access failed" },
      { status: 500 },
    );
  }
}
