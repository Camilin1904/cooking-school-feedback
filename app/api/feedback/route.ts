import { addFeedback, getAllFeedback } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

// TODO: Import data utilities from @/lib/data

export async function GET(request: NextRequest) {
  // TODO: Get all feedback
  // TODO: Support optional query params: courseSlug, lessonSlug, minRating
  // TODO: Return filtered results as JSON
  const allFeedback = await getAllFeedback();
  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("courseSlug");
  const lessonSlug = searchParams.get("lessonSlug");
  const minRating = searchParams.get("minRating");

  let filteredFeedback = allFeedback;

  if (courseSlug) {
    filteredFeedback = filteredFeedback.filter((f) => f.courseSlug === courseSlug);
  }

  if (lessonSlug) {
    filteredFeedback = filteredFeedback.filter((f) => f.lessonSlug === lessonSlug);
  }

  if (minRating) {
    const minRatingValue = Number(minRating);
    if (!isNaN(minRatingValue)) {
      filteredFeedback = filteredFeedback.filter((f) => f.rating >= minRatingValue);
    }
  }

  return NextResponse.json(filteredFeedback);
}

export async function POST(request: NextRequest) {
  // TODO: Parse the request body
  // TODO: Validate required fields: courseSlug, lessonSlug, rating, comment, author
  // TODO: Validate rating is a number between 1 and 5
  // TODO: Add the feedback and return it with status 201
  const body = await request.json();
  if (!body.courseSlug || !body.lessonSlug || !body.rating || !body.comment || !body.author) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: "Rating must be a number between 1 and 5" }, { status: 400 });
  }
  const newFeedback = await addFeedback({
    courseSlug: body.courseSlug,
    lessonSlug: body.lessonSlug,
    rating: body.rating,
    comment: body.comment,
    author: body.author,
  });
  return NextResponse.json(newFeedback, { status: 201 });
}
