import { NextResponse } from "next/server";
import { findAppById } from "@/lib/api/loanAppsStore";
import { listReviewsByApp } from "@/lib/api/reviewsStore";

type Params = {
  params: Promise<{ app: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { app: id } = await params;
  const app = findAppById(id);
  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const reviews = listReviewsByApp(id);
  return NextResponse.json({
    appId: id,
    count: reviews.length,
    reviews,
  });
}

