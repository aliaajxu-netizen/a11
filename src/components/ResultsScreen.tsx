/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Question, AppState } from "../types";
import { Award, Lock, Edit3, RotateCcw, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface ResultsScreenProps {
  questions: Question[];
  state: AppState;
  onReturnToPractice: () => void;
  onPromptReset: () => void;
  onJumpToQuestion: (idx: number) => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  questions,
  state,
  onReturnToPractice,
  onPromptReset,
  onJumpToQuestion,
}) => {
  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => (state.answers[q.id] || "").trim().length > 0).length;
  const shownCount = questions.filter((q) => state.shownAnswers[q.id]).length;
  const ratedCount = questions.filter((q) => state.ratings[q.id] !== undefined).length;

  // Max score is 10 marks per question
  const maxScore = totalQuestions * 10;
  let totalScore = 0;
  questions.forEach((q) => {
    if (state.ratings[q.id] !== undefined) {
      totalScore += state.ratings[q.id];
    }
  });

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // Mastery counters
  let masteryHigh = 0;
  let masteryMid = 0;
  let masteryLow = 0;

  questions.forEach((q) => {
    const m = state.mastery[q.id];
    if (m === "high") masteryHigh++;
    else if (m === "mid") masteryMid++;
    else if (m === "low") masteryLow++;
  });

  // Collect unrated questions that were revealed but no rating selected yet
  const unratedQuestions: { num: number; id: string; origIdx: number }[] = [];
  questions.forEach((q, idx) => {
    if (state.shownAnswers[q.id] && state.ratings[q.id] === undefined) {
      unratedQuestions.push({ num: idx + 1, id: q.id, origIdx: idx });
    }
  });

  const isFullySolved = answeredCount === totalQuestions;
  
  let badgeHTML = null;
  if (!isFullySolved) {
    badgeHTML = (
      <div className="badge-locked">
        <div className="badge-icon">
          <Lock className="h-9 w-9 text-gray-400" />
        </div>
        <h3 className="badge-name">أوسمة التمكن مغلقة</h3>
        <p className="badge-desc">
          أكمل حل جميع أسئلة التدريب ({answeredCount} من أصل {totalQuestions}) لتفتح وسام التمكن والتميز الأكاديمي وتزين به سجل إنجازاتك!
        </p>
      </div>
    );
  } else {
    let badgeClass = "";
    let badgeTitle = "";
    let badgeDesc = "";

    if (percentage >= 90) {
      badgeClass = "badge-gold";
      badgeTitle = "وسام التميز الأكاديمي الذهبي";
      badgeDesc = "ألف مبروك! لقد أتممت حل جميع الأسئلة وحققت مستوى تمكن استثنائي باهر (90% فما فوق). أنت بطل حقيقي وقائد متميز في قواعد اللغة العربية!";
    } else if (percentage >= 70) {
      badgeClass = "badge-silver";
      badgeTitle = "وسام الإبداع اللغوي الفضي";
      badgeDesc = "أداء ممتاز جداً! أتممت حل جميع الأسئلة بمهارة عالية ودقة ممتازة (70% - 89%). واصل هذا التميز اللغوي الرائع لتعتلي الصدارة دائماً!";
    } else {
      badgeClass = "badge-bronze";
      badgeTitle = "وسام المثابرة والاجتهاد البرونزي";
      badgeDesc = "أحسنت صنعاً! لقد أثبتّ التزامك التام وحللت جميع أسئلة الوحدة بجد واجتهاد. استمر في المراجعة والتدرب لتطوير نقاط تمكنك وستصل للذهبي قريباً!";
    }

    badgeHTML = (
      <div className={`badge-container ${badgeClass} animate-fade-in`}>
        <div className="badge-ribbon">وسام الإنجاز والتمكن</div>
        <div className="badge-medal">
          <Award className="h-12 w-12" />
        </div>
        <h3 className="badge-name">{badgeTitle}</h3>
        <p className="badge-desc">{badgeDesc}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <section className="results-screen" id="results-screen">
        <h2 className="results-title">تقرير الأداء والتقييم الذاتي الأكاديمي</h2>
        
        {/* Circle Progress Gauge */}
        <div className="results-gauge-container">
          <div className="results-gauge-outer">
            <div className="results-gauge-inner">
              <span className="results-percentage" id="results-percentage">{percentage}%</span>
              <span className="results-score-label" id="results-score-label">
                {totalScore} من أصل {maxScore} درجة
              </span>
            </div>
          </div>
        </div>

        {/* Achievement Badge Container */}
        <div className="badge-card" id="badge-card">
          {badgeHTML}
        </div>
        
        <div className="results-grid">
          <div className="stats-card">
            <span className="stats-label">عدد الأسئلة الكلي:</span>
            <strong className="stats-value" id="stats-total">{totalQuestions}</strong>
          </div>
          <div className="stats-card">
            <span className="stats-label">الأسئلة التي تمت إجابتها:</span>
            <strong className="stats-value" id="stats-answered">{answeredCount}</strong>
          </div>
          <div className="stats-card">
            <span className="stats-label">الأسئلة المعروضة حلولها:</span>
            <strong className="stats-value" id="stats-shown">{shownCount}</strong>
          </div>
          <div className="stats-card">
            <span className="stats-label">الأسئلة التي تم تقييمها:</span>
            <strong className="stats-value" id="stats-rated">{ratedCount}</strong>
          </div>
        </div>

        {/* Mastery summary block */}
        <div className="results-mastery-summary">
          <h3 className="results-summary-title">ملخص مستوى التمكن الأكاديمي:</h3>
          <div className="mastery-grid-summary">
            <div className="mastery-sum-card sum-high">
              <span className="sum-count" id="sum-high">{masteryHigh}</span>
              <span className="sum-label">متمكن من السؤال</span>
            </div>
            <div className="mastery-sum-card sum-mid">
              <span className="sum-count" id="sum-mid">{masteryMid}</span>
              <span className="sum-label">يحتاج مراجعة</span>
            </div>
            <div className="mastery-sum-card sum-low">
              <span className="sum-count" id="sum-low">{masteryLow}</span>
              <span className="sum-label">غير متمكن</span>
            </div>
          </div>
        </div>

        {/* Unrated Alert Panel */}
        {unratedQuestions.length > 0 && (
          <div className="unrated-alert-panel" id="unrated-alert-panel" style={{ display: "block" }}>
            <div className="alert-header">
              <AlertTriangle className="h-5 w-5 text-amber-500 inline-block mr-1 ml-1 align-middle" />
              <strong>تنبيه هام للطلبة:</strong>
            </div>
            <p className="alert-desc">لقد قمت بعرض الإجابة النموذجية للأسئلة التالية ولكن لم تختر لها تقييماً ذاتياً بعد. للحصول على تقدير دقيق يرجى تقييمها:</p>
            <div className="unrated-questions-list" id="unrated-questions-list">
              {unratedQuestions.map((uq) => (
                <button
                  key={uq.id}
                  className="unrated-item-btn"
                  onClick={() => onJumpToQuestion(uq.origIdx)}
                >
                  سؤال {uq.num}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="results-actions">
          <button className="btn btn-primary" onClick={onReturnToPractice}>
            <Edit3 className="h-5 w-5" />
            العودة لتعديل الإجابات والتقييمات
          </button>
          <button className="btn btn-secondary" onClick={onPromptReset}>
            <RotateCcw className="h-5 w-5" strokeWidth={2.5} />
            تصفير التقدم وبدء محاولة جديدة
          </button>
        </div>
      </section>
    </motion.div>
  );
};
