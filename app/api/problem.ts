import { NextApiRequest, NextApiResponse } from "next";
import { Problem } from "@/components/main/problems";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const testProblem: Problem = {
    id: "test123",
    title: "Two Sum",
    difficulty: "Easy",
    platform: "LeetCode",
    tags: ["Arrays", "HashMap"],
    url: "https://leetcode.com/problems/two-sum/",
    submissions: 120000,
    accuracy: 56.4,
    upvotes: 3400,
    createdAt: new Date(),
  };

  res.status(200).json([testProblem]); // Returning an array with a single test problem
}
