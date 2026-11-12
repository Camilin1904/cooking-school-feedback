import fs from "fs/promises";
import path from "path";
import type { Feedback } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "feedback.json");

// Read the JSON file at DATA_PATH and return the parsed array.
export async function getAllFeedback(): Promise<Feedback[]> {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(data) as Feedback[];
}

// Find a single entry by its id, or return undefined.
export async function getFeedbackById(
  id: string
): Promise<Feedback | undefined> {
  const feedback = await getAllFeedback();
  return feedback.find((f) => f.id === id);
}

// Generate an id and createdAt, append the entry to the file, return it.
export async function addFeedback(
  entry: Omit<Feedback, "id" | "createdAt">
): Promise<Feedback> {
  const feedback = await getAllFeedback();
  const newEntry: Feedback = {
    ...entry,
    id: `fb-${String(feedback.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  feedback.push(newEntry);
  await fs.writeFile(DATA_PATH, JSON.stringify(feedback, null, 2));
  return newEntry;
}
