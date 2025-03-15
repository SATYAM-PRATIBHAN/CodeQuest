"use client";
import { useState, useEffect } from "react";
type Question = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};


export default function TechTrivia() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=5&category=18&type=multiple");
        const data = await res.json();
        setQuestions(Array.isArray(data.results) ? data.results : []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch questions", error);
        setQuestions([]); // Prevent undefined state
      }
    }
    fetchQuestions();
  }, []);
  
  
  const currentQuestion = questions[currentIndex] ?? null;

  useEffect(() => {
    if (questions.length > 0 && currentQuestion) {  // Ensure currentQuestion is not null
      const answers = [
        ...currentQuestion.incorrect_answers.map(decodeHtmlEntities),
        decodeHtmlEntities(currentQuestion.correct_answer),
      ];
      setShuffledAnswers(shuffleArray(answers));
    }
  }, [currentIndex, questions, currentQuestion]);
  

  if (!currentQuestion && currentIndex < questions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400 border-solid"></div>
        <p className="mt-4 text-lg font-semibold text-gray-300">Loading question...</p>
      </div>
    );
  }
  
  

  function decodeHtmlEntities(text: string) {
    return new DOMParser().parseFromString(text, "text/html").body.textContent || "";
  }

  function shuffleArray(array: string[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function handleAnswer(answer: string) {
    setSelectedAnswer(answer);
  
    if (answer === decodeHtmlEntities(questions[currentIndex].correct_answer)) {
      setScore((prev) => prev + 1);
    }
  
    setTimeout(() => {
      setSelectedAnswer(null);
      
      setCurrentIndex((prev) => prev + 1); 
    }, 1000);
  }
  
  

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen  text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400 border-solid"></div>
        <p className="mt-4 text-lg font-semibold text-gray-300">Fetching trivia questions...</p>
      </div>
    );

    if (!loading && questions.length && currentIndex >= questions.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white text-center px-4 py-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Game Over!
          </h2>
          <p className="text-lg sm:text-xl md:text-xl mt-4 sm:mt-6">
            Your Score: <span className="text-blue-400 font-bold">{score}</span> / {questions.length}
          </p>
          <button 
            className="mt-6 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 relative z-10 bg-blue-500 hover:bg-blue-600 text-base sm:text-lg text-white rounded-lg shadow-md transition duration-300"
            onClick={() => location.reload()}
          >
            Play Again
          </button>
        </div>
      );
    }
    
    if (!loading && (!currentQuestion || questions.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white text-center px-4 py-8">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mb-4 sm:mb-6">
            No questions available.
          </h2>
          <button 
            className="mt-6 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 relative z-10 bg-blue-500 hover:bg-blue-600 text-base sm:text-lg text-white rounded-lg shadow-md transition duration-300"
            onClick={() => location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }
    

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 relative">
      {/* Trivia Header */}
      <div className="absolute top-4 sm:top-5 flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl px-4 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2 sm:mb-0">Tech Trivia</h1>
        <p className="text-base sm:text-lg font-medium">
          Question {currentIndex + 1} / {questions.length}
        </p>
      </div>

      {/* Trivia Card */}
      <div className="max-w-2xl w-full bg-gradient-to-br from-gray-800 to-gray-700 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 text-center mt-20 sm:mt-24">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {decodeHtmlEntities(currentQuestion.question)}
        </h2>
        <p className="text-xs sm:text-sm font-medium text-gray-400 mb-4 sm:mb-6">
          Difficulty: <span className="uppercase font-semibold text-blue-400">{currentQuestion.difficulty}</span>
        </p>

        <div className="grid gap-3 sm:gap-4">
          {shuffledAnswers.map((answer, index) => (
            <button
              key={index}
              className={`p-2 sm:p-3 relative z-10 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 shadow-md ${
                selectedAnswer
                  ? answer === decodeHtmlEntities(currentQuestion.correct_answer)
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
              }`}
              onClick={() => handleAnswer(answer)}
              disabled={!!selectedAnswer}
            >
              {answer}
            </button>
          ))}
        </div>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg font-medium">
          Score: <span className="text-blue-400 font-bold">{score}</span>
        </p>
      </div>
    </div>
  );
}
