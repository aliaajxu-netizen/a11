/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Poetry {
  layout: "two-halves" | "two-lines";
  sadr?: string;
  ajuz?: string;
  lines?: string[];
}

export interface Question {
  id: string;
  question: string;
  modelAnswer: string;
  years: string;
  quranVerse?: string;
  poetry?: Poetry;
}

export interface AppState {
  currentScreen: "home" | "practice" | "results";
  currentIndex: number;
  answers: Record<string, string>;
  shownAnswers: Record<string, boolean>;
  ratings: Record<string, number>;
  mastery: Record<string, "high" | "mid" | "low">;
  filter: "all" | "unanswered" | "unrated" | "needs_review" | "not_mastered" | "mastered";
  theme: "light" | "dark";
}
