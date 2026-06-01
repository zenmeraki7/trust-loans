import { NextResponse } from "next/server";
import { suggestApp } from "@/lib/api/loanAppsStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const suggestion = suggestApp({
    name: body.name,
    companyName: body.companyName,
    developerName: body.developerName,
    claimedNbfcPartner: body.claimedNbfcPartner,
    website: body.website,
    note: body.note,
  });

  return NextResponse.json(
    {
      message: "Suggestion submitted",
      suggestion,
    },
    { status: 201 },
  );
}

