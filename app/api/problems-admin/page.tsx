"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProblemsStore } from "@/store/useProblemsStore";
import { useRouter } from "next/navigation";

export default function ProblemsAdmin() {
  const { problems, fetchProblems, addProblem } = useProblemsStore();
  const router = useRouter();

  const [newProblem, setNewProblem] = useState<{
    title: string;
    difficulty: string;
    platform: string;
    tags: string;
    url: string;
    description: string;
    testcases: string; // Added this line
  }>({
    title: "",
    difficulty: "",
    platform: "",
    tags: "",
    url: "",
    description: "",
    testcases: "" // Default to an empty JSON array as a string
  });
  

  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      alert("Unauthorized access");
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchProblems();
      setIsLoading(false);
    };
    fetchData();
  }, [fetchProblems]);

  const handleAddProblem = async () => {
    if (!newProblem.title || !newProblem.difficulty || !newProblem.platform || !newProblem.url || !newProblem.description) {
      alert("Please fill in all fields.");
      return;
    }
  
    let testcasesArray = [];
    try {
      testcasesArray = JSON.parse(newProblem.testcases);
      if (!Array.isArray(testcasesArray)) throw new Error();
    } catch (error) {
      console.log(error)
      alert("Invalid Test Cases format. Please enter a valid JSON array.");
      return;
    }
  
    setIsAdding(true);
    await addProblem({
      ...newProblem,
      tags: newProblem.tags.split(",").map(tag => tag.trim()),
      testcases: testcasesArray,
    });
  
    setNewProblem({ title: "", difficulty: "", platform: "", tags: "", url: "", description: "", testcases: "[]" });
    setIsAdding(false);
  };
  

  return (
    <div className="p-6 min-h-screen bg-[#0D1117] text-white">
      <h1 className="text-2xl font-bold text-[#1F6FEB]">Problems Admin Panel</h1>

      {/* Add Problem Form */}
      <div className="mt-6 p-4 bg-[#161B22] rounded-lg border border-[#30363D]">
        <h2 className="text-xl font-semibold">Add New Problem</h2>
        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={newProblem.title}
            onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
            className="w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition"
          />
          <input
            type="text"
            placeholder="Difficulty (Easy/Medium/Hard)"
            value={newProblem.difficulty}
            onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
            className="w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition"
          />
          <input
            type="text"
            placeholder="Platform (LeetCode, Codeforces, etc.)"
            value={newProblem.platform}
            onChange={(e) => setNewProblem({ ...newProblem, platform: e.target.value })}
            className="w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition"
          />
          <textarea
            placeholder="Description"
            value={newProblem.description}
            onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
            className="w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition"
          ></textarea>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newProblem.tags}
            onChange={(e) => setNewProblem({ ...newProblem, tags: e.target.value })}
            className="w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition"
          />
          <input
            type="text"
            placeholder="Problem URL"
            value={newProblem.url}
            onChange={(e) => setNewProblem({ ...newProblem, url: e.target.value })}
            className="w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition"
          />
          <input
            type="text"
            placeholder='Test Cases (JSON: [{"input": "1,2,3", "expectedOutput": "6"}])'
            value={newProblem.testcases}
            onChange={(e) => setNewProblem({ ...newProblem, testcases: e.target.value })}
            className="w-full px-4 py-2 rounded bg-[#0D1117] border border-gray-600 text-white focus:border-[#1F6FEB] focus:ring-[#1F6FEB] outline-none transition"
          />

          <Button
            onClick={handleAddProblem}
            disabled={isAdding}
            className={`w-full ${isAdding ? "bg-gray-500 cursor-not-allowed" : "bg-[#1F6FEB] hover:bg-opacity-80"}`}
          >
            {isAdding ? "Adding..." : "Add Problem"}
          </Button>
        </div>
      </div>

      {/* Problems List */}
      <div className="mt-6 p-4 bg-[#161B22] rounded-lg border border-[#30363D]">
        <h2 className="text-xl font-semibold">Problems List</h2>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center  text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400 border-solid"></div>
            <p className="mt-4 text-lg font-semibold text-gray-300">Loading Problems....</p>
        </div>
        ) : problems.length === 0 ? (
          <p className="text-gray-400 mt-4">No problems found.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {problems.map((problem, index) => (
              <div key={problem.id || `problem-${index}`} className="bg-[#0D1117] p-4 rounded border border-gray-700">
                <h3 className="text-lg font-semibold">{problem.title}</h3>
                <p className="text-gray-400">Difficulty: {problem.difficulty}</p>
                <p className="text-gray-400">Platform: {problem.platform}</p>
                <p className="text-gray-400">
                  Tags: {Array.isArray(problem.tags) ? problem.tags.join(", ") : "No tags"}
                </p>
                <a href={problem.url} target="_blank" className="text-[#1F6FEB] hover:underline">
                  View Problem
                </a>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}