/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { AppState } from "./types";
import { TEMPLATE_QUESTIONS } from "./data/questionsTemplate";
import { Navbar } from "./components/Navbar";
import { HomeScreen } from "./components/HomeScreen";
import { PracticeScreen } from "./components/PracticeScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { Footer } from "./components/Footer";
import { ResetModal } from "./components/ResetModal";

const LOCAL_STORAGE_KEY = "madrasati_arabic_evaluation_template_v1";

const DEFAULT_STATE: AppState = {
  currentScreen: "home",
  currentIndex: 0,
  answers: {},
  shownAnswers: {},
  ratings: {},
  mastery: {},
  filter: "all",
  theme: "light",
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      } catch (e) {
        console.error("Error reading cached state:", e);
      }
    }
    return DEFAULT_STATE;
  });

  const [isResetOpen, setIsResetOpen] = useState(false);

  // Sync state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Synchronize CSS Data-Theme selector for responsive dark/light modes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  // Navigation handlers
  const handleNavigate = (screen: AppState["currentScreen"]) => {
    setState((prev) => ({ ...prev, currentScreen: screen }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleTheme = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  };

  // State modifying triggers
  const handleUpdateAnswer = (qId: string, value: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qId]: value },
    }));
  };

  const handleRevealAnswer = (qId: string) => {
    setState((prev) => ({
      ...prev,
      shownAnswers: { ...prev.shownAnswers, [qId]: true },
    }));
  };

  const handleRateQuestion = (qId: string, rating: number) => {
    setState((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [qId]: rating },
    }));
  };

  const handleSetMastery = (qId: string, status: "high" | "mid" | "low") => {
    setState((prev) => ({
      ...prev,
      mastery: { ...prev.mastery, [qId]: status },
    }));
  };

  const handleNavigateToQuestion = (idx: number) => {
    setState((prev) => ({ ...prev, currentIndex: idx }));
  };

  // Safe Filter update: verifies if focused question exists under active filter, falls back to first element
  const handleSetFilter = (newFilter: AppState["filter"]) => {
    setState((prev) => {
      const filtered = TEMPLATE_QUESTIONS.filter((q) => {
        const isAnswered = !!prev.answers[q.id] && prev.answers[q.id].trim().length > 0;
        const hasRating = prev.ratings[q.id] !== undefined;
        const masteryStatus = prev.mastery[q.id];

        switch (newFilter) {
          case "unanswered":
            return !isAnswered;
          case "unrated":
            return !hasRating;
          case "needs_review":
            return masteryStatus === "mid";
          case "not_mastered":
            return masteryStatus === "low";
          case "mastered":
            return masteryStatus === "high";
          default:
            return true;
        }
      });

      const currentQ = TEMPLATE_QUESTIONS[prev.currentIndex];
      let newIdx = prev.currentIndex;

      if (filtered.length > 0 && currentQ) {
        const isStillInFiltered = filtered.some((q) => q.id === currentQ.id);
        if (!isStillInFiltered) {
          const firstFiltered = filtered[0];
          newIdx = TEMPLATE_QUESTIONS.findIndex((q) => q.id === firstFiltered.id);
        }
      }

      return {
        ...prev,
        filter: newFilter,
        currentIndex: newIdx === -1 ? 0 : newIdx,
      };
    });
  };

  // Reset progress handlers
  const handleResetConfirm = () => {
    setState((prev) => ({
      ...DEFAULT_STATE,
      theme: prev.theme, // persist theme choice
      currentScreen: "practice",
    }));
    setIsResetOpen(false);
  };

  const answeredCount = TEMPLATE_QUESTIONS.filter(
    (q) => (state.answers[q.id] || "").trim().length > 0
  ).length;

  return (
    <div className="flex min-h-screen flex-col font-sans transition-colors duration-200" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Top Bar navbar */}
      <Navbar
        currentScreen={state.currentScreen}
        theme={state.theme}
        onNavigate={handleNavigate}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Viewport Container */}
      <main className="container mx-auto max-w-4xl px-4 py-6 flex-1">
        {state.currentScreen === "home" && (
          <HomeScreen
            totalQuestions={TEMPLATE_QUESTIONS.length}
            answeredCount={answeredCount}
            onStartPractice={() => handleNavigate("practice")}
            onPromptReset={() => setIsResetOpen(true)}
          />
        )}

        {state.currentScreen === "practice" && (
          <PracticeScreen
            questions={TEMPLATE_QUESTIONS}
            state={state}
            onUpdateAnswer={handleUpdateAnswer}
            onRevealAnswer={handleRevealAnswer}
            onRateQuestion={handleRateQuestion}
            onSetMastery={handleSetMastery}
            onNavigateToQuestion={handleNavigateToQuestion}
            onSetFilter={handleSetFilter}
            onFinishPractice={() => handleNavigate("results")}
          />
        )}

        {state.currentScreen === "results" && (
          <ResultsScreen
            questions={TEMPLATE_QUESTIONS}
            state={state}
            onReturnToPractice={() => handleNavigate("practice")}
            onPromptReset={() => setIsResetOpen(true)}
            onJumpToQuestion={(idx) => {
              handleNavigateToQuestion(idx);
              handleNavigate("practice");
            }}
          />
        )}
      </main>

      {/* Footer credits and citations */}
      <Footer />

      {/* Reset progress confirmation dialog */}
      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetConfirm}
      />
    </div>
  );
}
