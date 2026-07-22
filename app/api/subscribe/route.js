import { NextResponse } from "next/server";
import { subscribeNewsletter } from "../../lib/server-api";

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await subscribeNewsletter(
      body?.email || "",
      body?.phone || "",
    );
    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Newsletter subscription failed" },
      { status: 500 },
    );
  }
}
