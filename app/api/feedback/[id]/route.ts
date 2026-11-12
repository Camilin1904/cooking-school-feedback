import { getFeedbackById } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

// TODO: Import getFeedbackById from @/lib/data

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TODO: Look up feedback by id
  // TODO: Return 404 if not found
  // TODO: Return the feedback entry as JSON
  const feedback = await getFeedbackById(id);
  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  } 
  return NextResponse.json(feedback);
}
