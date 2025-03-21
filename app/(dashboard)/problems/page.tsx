"use client";

import ProblemListSkeleton from "@/components/ui/problemlistskeleton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  tags: string[];
  solved: boolean;
}

export default function ProblemsPage() {
  const {data : session} = useSession();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("/api/problems");
        if (!res.ok) throw new Error("Failed to fetch problems");

        const data: Problem[] = await res.json();
        setProblems(data.sort((a, b) => a.title.localeCompare(b.title)));
        setFilteredProblems(data.sort((a, b) => a.title.localeCompare(b.title)));


        if (session?.user?.id) {
          const solvedRes = await fetch(`/api/solved?userId=${session.user.id}`);
          if (!solvedRes.ok) throw new Error("Failed to fetch solved problems");

          const solvedData = await solvedRes.json();
          console.log(solvedData);
          setSolvedCount(solvedData.solvedCount);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load problems. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [session?.user?.id]);

  useEffect(() => {
    let filtered = problems;

    if (search) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) => selectedTags.every((tag) => p.tags.includes(tag)));
    }

    if (selectedDifficulty) {
      filtered = filtered.filter((p) => p.difficulty === selectedDifficulty);
    }

    setFilteredProblems(filtered);
  }, [search, selectedTags, selectedDifficulty, problems]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty((prev) => (prev === difficulty ? null : difficulty));
  };

  const handleSolvedToggle = async () => {
    if (!session?.user?.id) {
      alert("User not Logged In");
      router.push("/signin");
      return;
    }
  };
  
  

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#1F6FEB]">
          Problem List
        </h1>

        {/* Filters Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full bg-[#161B22] text-white py-3 px-10 sm:py-4 sm:px-12 rounded-xl border border-[#30363D] focus:border-[#1F6FEB] focus:ring-2 focus:ring-[#1F6FEB]/50 outline-none transition-all duration-300 placeholder-gray-500 text-sm sm:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
            </div>

            {/* Tag Filter */}
            <select
              className="w-full sm:w-auto bg-[#161B22] text-white py-3 px-4 sm:py-4 sm:px-6 rounded-xl border border-[#30363D] focus:border-[#1F6FEB] focus:ring-2 focus:ring-[#1F6FEB]/50 outline-none transition-all duration-300 cursor-pointer appearance-none text-sm sm:text-base"
              onChange={(e) => setSelectedTags(e.target.value ? [e.target.value] : [])}
              value={selectedTags[0] || ""}
            >
              <option value="">Filter by Tag</option>
              {[...new Set(problems.flatMap((p) => p.tags))].map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            <button
              className="w-full sm:w-auto bg-gradient-to-r from-[#1F6FEB] to-[#3B82F6] text-white py-3 px-6 sm:py-4 sm:px-8 rounded-xl font-semibold hover:from-[#3B82F6] hover:to-[#60A5FA] hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
              onClick={() => {
                setSearch("");
                setSelectedTags([]);
                setSelectedDifficulty(null);
              }}
            >
              Reset Filters
            </button>
          </div>

          {/* Difficulty Filter Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {["Easy", "Medium", "Hard"].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleDifficultyClick(difficulty)}
                className={`px-4 py-2 sm:px-5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm border transition-all duration-300 ${
                  selectedDifficulty === difficulty
                    ? "bg-[#1F6FEB] border-[#1F6FEB] text-white shadow-md"
                    : "bg-[#161B22] border-[#30363D] text-gray-300 hover:bg-[#1F6FEB] hover:border-[#1F6FEB] hover:text-white"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>

          {/* Solved Counter */}
          <p className="text-center text-gray-300 text-base sm:text-lg">
          Solved: <span className="font-semibold text-[#1F6FEB]">{solvedCount}</span> / {problems.length}
        </p>
        </div>

        {/* Error & Loading */}
        {loading && (
          <ProblemListSkeleton/>
        )}
        {error && (
          <p className="text-center text-red-500 bg-red-100 border border-red-400 rounded-md py-2 px-4 m-2 max-w-md mx-auto">
            {error}
          </p>
        )}

        {/* Problems List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => handleSolvedToggle()} // Corrected to use problem.id
                  className="flex justify-between items-center p-4 bg-[#161B22] border border-[#30363D] rounded-lg shadow-md hover:shadow-xl hover:border-[#1F6FEB] cursor-pointer transition-all duration-300"
                >
                  <div onClick={() => router.push(`/problems/${problem.id}`)}>
                      <h2 className="text-lg font-semibold text-[#58A6FF]">
                        {problem.title}
                      </h2>
                      <h2 className={`text-lg font-semibold flex items-center gap-2 ${problem.solved ? "text-green-400" : "text-[#58A6FF]"}`}>
                        {problem.solved ? (
                          <>
                            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.2l-3.5-3.5-1.5 1.5L9 19l10-10-1.5-1.5L9 16.2z" />
                            </svg>
                            Solved
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 text-[red]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z" />
                            </svg>
                            Unsolved
                          </>
                        )}
                      </h2>
                    <p className="text-sm text-gray-400">Platform: {problem.platform}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                            selectedTags.includes(tag)
                              ? "bg-[#1F6FEB] text-white"
                              : "bg-[#30363D] text-gray-300 hover:bg-[#1F6FEB] hover:text-white transition"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-semibold ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</p>
                  </div>

                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No problems found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
