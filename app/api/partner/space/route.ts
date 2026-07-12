import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { getOrCreateSpace, recalculateSpace } from "@/lib/partner/space";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const space = await getOrCreateSpace(user.id);
  return NextResponse.json({ space });
}

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const space = await recalculateSpace(user.id);
  return NextResponse.json({ space });
}
