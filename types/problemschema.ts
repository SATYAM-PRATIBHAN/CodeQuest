export type Problem = {
    id: string; // Unique ID for the problem
    title: string; // Problem name
    difficulty: "Easy" | "Medium" | "Hard"; // Difficulty level
    platform: "LeetCode" | "Codeforces" | "HackerRank" | "AtCoder" | "GeeksforGeeks"; // Source
    tags: string[]; // List of relevant tags (e.g., "DP", "Graphs")
    url: string; // Direct link to the problem
    submissions: number; // Number of total submissions
    accuracy: number; // Percentage of correct submissions
    upvotes: number; // Community upvotes
    createdAt: Date; // Timestamp when problem was added
  };
  