import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://ethglobalskills.vercel.app";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const keyword = searchParams.get("keyword");
  const event = searchParams.get("event");
  const sponsor = searchParams.get("sponsor");
  const prize = searchParams.get("prize");
  const limit = searchParams.get("limit");
  const include = searchParams.get("include");

  const apiParams = new URLSearchParams();
  
  if (keyword) apiParams.set("keyword", keyword);
  if (event) apiParams.set("event", event);
  if (sponsor) apiParams.set("sponsor", sponsor);
  if (prize) apiParams.set("prize", prize);
  if (limit) apiParams.set("limit", limit);
  if (include) apiParams.set("include", include);

  try {
    const response = await fetch(`${BASE_URL}/api/projects?${apiParams.toString()}`, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 402) {
        return NextResponse.json(
          { error: "Rate limit exceeded. The API allows 10 free requests per minute." },
          { status: 402 }
        );
      }
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
