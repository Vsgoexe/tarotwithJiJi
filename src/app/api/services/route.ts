import { NextResponse } from "next/server";
import { getActiveServices } from "@/lib/services";

export async function GET() {
  try {
    const services = await getActiveServices();
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
