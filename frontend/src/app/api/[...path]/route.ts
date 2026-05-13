import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://backend:5000";

async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
  const { search } = new URL(req.url);
  const target = `${BACKEND}/api/${path.join("/")}${search}`;

  const isBodyMethod = req.method !== "GET" && req.method !== "HEAD";

  const upstream = await fetch(target, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body: isBodyMethod ? await req.text() : undefined,
    cache: "no-store",
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
