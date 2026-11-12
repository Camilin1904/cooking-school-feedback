import { getAllFeedback } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

// TODO: Import getAllFeedback from @/lib/data

export async function GET(request: NextRequest) {
  // TODO: Get all feedback, optionally filtered by courseSlug query param
  // TODO: Calculate totalEntries, averageRating, ratingDistribution (1-5)
  // TODO: Group stats by course
  // TODO: Return the summary as JSON
  const allFeedback = await getAllFeedback();
  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("courseSlug");
  const filteredFeedback = courseSlug
    ? allFeedback.filter((f) => f.courseSlug === courseSlug)
    : allFeedback;
    const totalEntries = filteredFeedback.length;
    const averageRating =
      totalEntries > 0
        ? filteredFeedback.reduce((sum, f) => sum + f.rating, 0) / totalEntries
        : 0;
    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    filteredFeedback.forEach((f) => {
      ratingDistribution[f.rating]++;
    });

  
    const groupedStats = filteredFeedback.reduce((acc, f) => {
      if (!acc[f.courseSlug]) {
        acc[f.courseSlug] = {
          totalEntries: 0,
          averageRating: 0,
          ratingDistribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
        };
      }
      acc[f.courseSlug].totalEntries++;
      acc[f.courseSlug].averageRating =
        acc[f.courseSlug].totalEntries > 0
          ? (acc[f.courseSlug].averageRating * (acc[f.courseSlug].totalEntries - 1) + f.rating) / acc[f.courseSlug].totalEntries
          : 0;
      acc[f.courseSlug].ratingDistribution[f.rating]++;
      return acc;
    }, {} as Record<string, { totalEntries: number; averageRating: number; ratingDistribution: Record<number, number> }>);
    return NextResponse.json({ totalEntries, averageRating, ratingDistribution, groupedStats: groupedStats }, { status: 200 });
}
