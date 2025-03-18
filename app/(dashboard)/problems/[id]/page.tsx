"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { useSession } from "next-auth/react";

const themeOptions = [
  { name: "Dark", value: "vs-dark" },
  { name: "Light", value: "light" }
];


interface Problem {
  id: string;
  title: string;
  description: string;
  url: string;
  testCases: { input: string; expectedOutput: string }[];
  starterCodeJS: string;
  starterCodePY: string;
}

const languageOptions = [
  { name: "JavaScript", pistonName: "javascript" },
  { name: "Python", pistonName: "python" },
];

export default function ProblemPage() {
  const { data: session, status } = useSession();
  const { id } = useParams() as { id: string };
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState("Run your code to see the output here...");
  const [language, setLanguage] = useState(languageOptions[0]); 
  const [executing, setExecuting] = useState(false);
  const [submissionExecution, setSubmissionExecution] = useState(false);
  const [value, setValue] = useState("");
  const [theme, setTheme] = useState(themeOptions[0].value);
  const [allTestsPassed, setAllTestsPassed] = useState(false);


  const router = useRouter();

  function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedLanguage = languageOptions.find((lang) => lang.name === e.target.value);
    if (selectedLanguage) {
      setLanguage(selectedLanguage); 
    }
  }

  useEffect(() => {
    if (!session?.user?.id || !id) return;
  
    const checkSubmission = async () => {
      try {
        const res = await fetch('/api/check-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            problemId: id,
          }),
        });
  
        if (res.ok) {
          const data = await res.json();
          if (data.submissionStatus === "SOLVED") {
            setSubmissionExecution(true);
          }
        }
      } catch (error) {
        console.error("Error checking submission:", error);
      }
    };
  
    checkSubmission();
  }, [session, id]);
  
  
  function getMonacoLanguage(lang: string) {
    const languageMap: Record<string, string> = {
      JavaScript: "javascript",
      Python: "python",
    };
    return languageMap[lang] || "plaintext"; 
  }
  
  useEffect(() => {
    if (status === "loading") return; // Avoid running until session is loaded
    if (!session?.user?.id) {
      alert("User not Logged In");
      router.push("/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!problem) return;
  
    const savedCode = localStorage.getItem(`code_${id}_${language.name}`);
    if (savedCode) {
      setValue(savedCode);
    } else {
      if (getMonacoLanguage(language.name) === "javascript") {
        setValue(Function(`return \`${problem.starterCodeJS}\``)());
      }
      if (getMonacoLanguage(language.name) === "python") {
        setValue(Function(`return \`${problem.starterCodePY}\``)());
      }
    }
  }, [language.name, problem]);
  

  useEffect(() => {
    if (!value) return;
    localStorage.setItem(`code_${id}_${language.name}`, value);
  }, [value, id, language.name]);
  
  
  useEffect(() => {
    if (!session?.user?.id || !id) return;
    const fetchProblem = async () => {
      try {
        const res = await fetch(`/api/problems/${id}`);
        if (!res.ok) throw new Error(`Error: ${res.status} - ${res.statusText}`);
        const data = await res.json();
        
        setProblem({ ...data, testCases: data.testCases || [] });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id, session,language.name]); // Added `session` dependency
  
  async function runCode() {
    setExecuting(true);
    setOutput("Running...");
  
    try {
      if (!problem?.testCases?.length) {
        setOutput("No test cases available.");
        setExecuting(false);
        return;
      }
  
      const results = [];
      let passedAll = true; // Flag to track success
  
      for (const testCase of problem.testCases) {
        let executionCode = value;
  
        switch (language.pistonName) {
          case "javascript":
            const jsFunctionNameMatch = value.match(
              /(?:function\s+)?([\w$]+)\s*=\s*(?:function|\(?\w*\)?\s*=>)|function\s+([\w$]+)\s*\(/
            );
            const jsFunctionName = jsFunctionNameMatch
              ? jsFunctionNameMatch[1] || jsFunctionNameMatch[2]
              : null;
            
  
            if (!jsFunctionName) {
              setOutput("Error: No function found in JavaScript code.");
              setExecuting(false);
              return;
            }
            executionCode += `\nconsole.log(${jsFunctionName}(${JSON.stringify(
              testCase.input
            )}));`;
            break;
  
          case "python":
            const pyFunctionNameMatch = value.match(/def (\w+)\(/);
            const pyFunctionName = pyFunctionNameMatch
              ? pyFunctionNameMatch[1]
              : null;
  
            if (!pyFunctionName) {
              setOutput("Error: No function found in Python code.");
              setExecuting(false);
              return;
            }
  
            executionCode += `\nprint(${pyFunctionName}(${JSON.stringify(
              testCase.input
            )}))`;
            break;
        }
  
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: language.pistonName,
            version: "*",
            files: [{ content: executionCode }],
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Execution failed: ${response.statusText}`);
        }
  
        const result = await response.json();
        let actualOutput = result?.run?.output?.trim() ?? "No output received";
  
        try {
          actualOutput = JSON.parse(actualOutput);
        } catch {
          actualOutput = actualOutput.trim();
        }
  
        const expectedOutput = testCase.expectedOutput;
        const testResult =
          JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
  
        results.push(
          `Test ${results.length + 1}: ${
            testResult ? "✅ Passed" : "❌ Failed"
          }\nInput: ${JSON.stringify(testCase.input)}\nExpected: ${JSON.stringify(
            expectedOutput
          )}\nReceived: ${JSON.stringify(actualOutput)}`
        );
  
        if (!testResult) {
          passedAll = false;
        }
      }
  
      setAllTestsPassed(passedAll); // Set status based on test results
      setOutput(results.join("\n"));
    } catch (error) {
      setOutput(`Error: ${error}`);
      console.error("Execution error:", error);
    } finally {
      setExecuting(false);
    }
  }
  
  // Submit Logic
  async function handleSubmit() {
    setSubmissionExecution(true);
    const normalizedUserId = session?.user.id;
    console.log("Normalized User ID:", normalizedUserId);
  
    try {
      // Delete previous submission (if exists)
      await fetch(`/api/delete-submission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: normalizedUserId,
          problemId: id,
        }),
      });
  
      // Submit new solution
      const res = await fetch(`/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: normalizedUserId,
          problemId: id,
          status: "Solved",
        }),
      });
  
      const data = await res.json();
      console.log("Server Response:", data);
  
      if (!res.ok) throw new Error("Failed to submit solution.");
      alert("Solution submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit the solution.");
    } finally {
      setSubmissionExecution(false);
    }
  }
  
  
  if (loading) return (
    <div className="flex justify-center bg-[#0D1117] items-center p-10 h-screen">
      <div className="text-gray-300 text-lg font-medium animate-pulse flex items-center gap-2">
        <svg
          className="w-6 h-6 animate-spin text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        Loading...
      </div>
    </div>
  );
  if (!loading && !problem) return (
    <div className="flex justify-center items-center p-10 h-screen">
      <div className="text-red-400 text-lg font-medium flex items-center gap-3 bg-red-900/20 px-6 py-3 rounded-lg shadow-md">
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Problem not found</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-max p-8 bg-gray-950 text-gray-100">
      {/* Left Section: Problem Details */}
      <div className="md:w-1/2 p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-lg border border-gray-700/30">
        <h1 className="text-3xl font-bold text-blue-400 mb-12 tracking-tight">
          {problem?.title}
        </h1>
        <p className="text-gray-300 font-medium mb-12 text-lg whitespace-pre-line leading-relaxed tracking-wide border-l-4 border-gray-500 pl-5 indent-5">
          {problem?.description
            .trim()
            .replace(/\s{2,}/g, "\n")
            .replace(/\. (\w)/g, ". $1")
            .replace(/\. (\s)/g, ".\n")
            .replace(/^"|"$/g, "")
            .replace(/\n{2,}/g, "\n")
          }
        </p>

        <a
          href={problem?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-20 text-center px-5 bg-blue-700 hover:bg-blue-600 transition-all duration-200 text-white py-3 rounded-xl font-semibold"
        >
          Original Problem
        </a>
      </div>

      {/* Right Section: Code Editor and Output */}
      <div className="md:w-1/2 p-6 bg-gray-900 rounded-2xl shadow-xl flex flex-col gap-6">
        {/* {<!-- Language and Theme Selector -->} */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2 items-center mb-2">
            <label className="text-gray-300 font-medium">Language:</label>
            <select
              value={language.name}
              onChange={handleLanguageChange}
              className="bg-gray-950 text-gray-50 px-6 py-3 cursor-pointer rounded-2xl border border-gray-800/40 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:bg-gray-900 hover:border-gray-700/60"          >
              {languageOptions.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-center mb-2">
            <label className="text-gray-300 font-medium">Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-950 text-gray-50 px-6 py-3 rounded-2xl cursor-pointer border border-gray-800/40 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 hover:bg-gray-900 hover:border-gray-700/60"          >
              {themeOptions.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* {<!-- Code Editor -->} */}
        <div className="relative border border-gray-700 rounded-lg overflow-hidden">
          <Editor
            height="500px"
            theme={theme}
            language={getMonacoLanguage(language.name)}
            onChange={(val) => setValue(val || "")}
            value={value}
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              padding: { top: 16, bottom: 16 },
              formatOnType: true,
              formatOnPaste: true,
              wordWrap: "on",
              autoClosingBrackets: "always",
              tabSize: 2,
              cursorBlinking: "smooth",
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              roundedSelection: true,
            }}
            className="bg-gray-900"
          />
          {/* Loading Overlay */}
          {executing && (
            <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center rounded-lg">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-0"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={runCode}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            disabled={executing}
          >
            {executing ? "Running..." : "Run Code"}
          </button>

          {/* Submit Button (Appears only when all tests pass) */}
          {allTestsPassed && (
            <button
              className={`bg-blue-700 p-4 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-200`}
              onClick={handleSubmit}
            >
              {submissionExecution ? "Submitting..." : "Submit Solution"}
            </button>
          )}
        </div>


        <div className="bg-gray-800 p-5 rounded-xl min-h-[120px]">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Output:</h3>
          <pre className="text-emerald-400 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded-lg">{output}</pre>
        </div>

        {/* {<!-- Test Cases Section -->} */}
        {(problem?.testCases || []).length > 0 && (
          <div className="mt-2 p-5 bg-gray-900 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">Test Cases</h2>
            {typeof problem?.testCases === "string"
              ? JSON.parse(problem.testCases).map((testCase :{input: string}, index : string) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg mb-3 transition-colors hover:bg-gray-750">
                    <p className="text-gray-200">
                      <strong className="text-gray-100">Input:</strong> 
                      <code className="text-emerald-300">{JSON.stringify(testCase.input)}</code>
                    </p>
                  </div>
                ))
              : problem?.testCases.map((testCase, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg mb-3 transition-colors hover:bg-gray-750">
                    <p className="text-gray-200">
                      <strong className="text-gray-100">Input:</strong> 
                      <code className="text-emerald-300">{JSON.stringify(testCase.input)}</code>
                    </p>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}