import { create } from "zustand";

interface Problem {
  description: string;
  id: string;
  title: string;
  difficulty: string;
  platform: string;
  tags: string[];
  url: string;
  testcases: { input: string; expectedOutput: string }[];  // ✅ Add testcases
}


interface ProblemsStore {
  problems: Problem[];
  fetchProblems: () => Promise<void>;
  addProblem: (problem: Omit<Problem, "id">) => Promise<void>;
}

export const useProblemsStore = create<ProblemsStore>((set) => ({
  problems: [],

  fetchProblems: async () => {
    try {
      const response = await fetch("/api/problems");
      const data = await response.json();
      set({ problems: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  },

  addProblem: async (problem) => {
    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        body: JSON.stringify(problem),
        headers: { "Content-Type": "application/json" },
      });
      const newProblem = await response.json();
      set((state) => ({ problems: [...state.problems, newProblem] }));
    } catch (error) {
      console.error("Error adding problem:", error);
    }
  },
}));
