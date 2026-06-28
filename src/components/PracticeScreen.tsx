/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { Question, AppState } from "../types";
import { Eye, ChevronRight, ChevronLeft } from "lucide-react";

export function getAcademicLabel(score: number | undefined): string {
  if (score === undefined || score === null) return "غير مقيّم";
  if (score <= 2) return "بحاجة لتركيز أكبر وتأسيس كامل ❌";
  if (score <= 4) return "تحتاج جهد إضافي ومراجعة دقيقة ⚠️";
  if (score <= 6) return "مقبول — تحتاج سد بعض الثغرات 👍";
  if (score <= 8) return "جيد جداً — أداء مرضي ومستوى متميز ✨";
  if (score === 9) return "ممتاز — فهم عميق ومتميز جداً 🏆";
  return "أداء عبقري ودرجة كاملة! 👑";
}

interface PracticeScreenProps {
  questions: Question[];
  state: AppState;
  onUpdateAnswer: (qId: string, value: string) => void;
  onRevealAnswer: (qId: string) => void;
  onRateQuestion: (qId: string, rating: number) => void;
  onSetMastery: (qId: string, status: "high" | "mid" | "low") => void;
  onNavigateToQuestion: (idx: number) => void;
  onSetFilter: (filter: AppState["filter"]) => void;
  onFinishPractice: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  questions,
  state,
  onUpdateAnswer,
  onRevealAnswer,
  onRateQuestion,
  onSetMastery,
  onNavigateToQuestion,
  onSetFilter,
  onFinishPractice,
}) => {
  const currentQuestion = questions[state.currentIndex];
  const activeDotRef = useRef<HTMLDivElement | null>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Filter questions based on chosen state
  const filteredQuestions = questions.filter((q) => {
    const isAnswered = !!state.answers[q.id] && state.answers[q.id].trim().length > 0;
    const hasRating = state.ratings[q.id] !== undefined;
    const masteryStatus = state.mastery[q.id];

    switch (state.filter) {
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

  const filteredIndex = currentQuestion 
    ? filteredQuestions.findIndex((q) => q.id === currentQuestion.id) 
    : -1;

  // Auto-scroll active indicators into view inside horizontal containers
  useEffect(() => {
    if (activeDotRef.current) {
      activeDotRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [state.currentIndex, state.filter]);

  useEffect(() => {
    if (activeBtnRef.current) {
      activeBtnRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [state.currentIndex, state.filter]);

  // General statistics
  const totalCount = questions.length;
  const answeredCount = questions.filter((q) => (state.answers[q.id] || "").trim().length > 0).length;
  const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  const ratedCount = questions.filter((q) => state.ratings[q.id] !== undefined).length;
  const ratedPercent = totalCount > 0 ? Math.round((ratedCount / totalCount) * 100) : 0;

  // Navigations helpers
  const handlePrev = () => {
    if (filteredIndex > 0) {
      const targetQ = filteredQuestions[filteredIndex - 1];
      const origIndex = questions.findIndex((q) => q.id === targetQ.id);
      if (origIndex !== -1) onNavigateToQuestion(origIndex);
    }
  };

  const handleNext = () => {
    if (filteredIndex < filteredQuestions.length - 1) {
      const targetQ = filteredQuestions[filteredIndex + 1];
      const origIndex = questions.findIndex((q) => q.id === targetQ.id);
      if (origIndex !== -1) onNavigateToQuestion(origIndex);
    }
  };

  // Badges status for active question
  let statusBadge = null;
  if (currentQuestion) {
    const isAnswered = !!state.answers[currentQuestion.id] && state.answers[currentQuestion.id].trim().length > 0;
    const isShown = !!state.shownAnswers[currentQuestion.id];
    const hasRating = state.ratings[currentQuestion.id] !== undefined;

    if (hasRating) {
      statusBadge = <span className="status-badge status-rated">تم التقييم ({state.ratings[currentQuestion.id]}/10)</span>;
    } else if (isShown) {
      statusBadge = <span className="status-badge status-viewed">تم عرض الحل</span>;
    } else if (isAnswered) {
      statusBadge = <span className="status-badge status-answered">تمت الإجابة</span>;
    } else {
      statusBadge = <span className="status-badge status-unanswered">لم تتم الإجابة</span>;
    }
  }

  let masteryBadge = null;
  if (currentQuestion) {
    const masteryStatus = state.mastery[currentQuestion.id];
    if (masteryStatus === "high") {
      masteryBadge = <span className="mastery-badge mastery-high">متمكن</span>;
    } else if (masteryStatus === "mid") {
      masteryBadge = <span className="mastery-badge mastery-mid">يحتاج مراجعة</span>;
    } else if (masteryStatus === "low") {
      masteryBadge = <span className="mastery-badge mastery-low">غير متمكن</span>;
    }
  }

  const originalIndex = currentQuestion ? questions.findIndex((item) => item.id === currentQuestion.id) : -1;
  const originalNum = originalIndex + 1;

  return (
    <section className="practice-screen" id="practice-screen">
      {/* Top Simple Navigation Header inside Practice Screen */}
      <div className="practice-header">
        <div className="progress-container">
          <div className="progress-label">
            <span>نسبة الإجابة عن الأسئلة:</span>
            <span id="answered-progress-text">{progressPercent}%</span>
          </div>
          <div className="progress-bar-outer">
            <div className="progress-bar-inner" id="answered-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="progress-container" style={{ marginTop: "1rem" }}>
          <div className="progress-label">
            <span>نسبة تقييم الأسئلة:</span>
            <span id="rated-progress-text">{ratedPercent}%</span>
          </div>
          <div className="progress-bar-outer">
            <div className="progress-bar-inner" id="rated-progress-bar" style={{ width: `${ratedPercent}%`, background: "linear-gradient(90deg, var(--color-primary), #a855f7)" }} />
          </div>
        </div>

        <div className="filter-bar">
          <span className="filter-label">تصفية الأسئلة حسب الحالة:</span>
          <div className="filter-options">
            {(["all", "unanswered", "unrated", "needs_review", "not_mastered", "mastered"] as const).map((filterOpt) => {
              const labelMap: Record<string, string> = {
                all: "الكل",
                unanswered: "غير المحلولة",
                unrated: "لم يتم التقييم",
                needs_review: "تحتاج مراجعة",
                not_mastered: "غير متمكن",
                mastered: "متمكن"
              };
              const isActive = state.filter === filterOpt;
              return (
                <button
                  key={filterOpt}
                  className={`filter-btn ${isActive ? "active" : ""}`}
                  onClick={() => onSetFilter(filterOpt)}
                >
                  {labelMap[filterOpt]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Practice Main Grid */}
      <div className="practice-layout">
        <div className="left-panel">
          <div className="questions-list" id="accordion-container">
            {filteredQuestions.length === 0 ? (
              <div className="empty-filter-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter-x" style={{ margin: "0 auto 1rem auto", opacity: 0.6 }}><path d="M13.013 3H22l-8 9.56V21l-4-2v-4l-1.39-1.66"/><path d="m3 3 10 10"/><path d="m13 3-10 10"/></svg>
                <h3>لا توجد أسئلة تطابق التصفية الحالية</h3>
                <p>يرجى اختيار تصنيف تصفية آخر أو عرض جميع الأسئلة للحل والتقييم.</p>
                <button className="btn btn-primary" onClick={() => onSetFilter("all")}>عرض جميع الأسئلة</button>
              </div>
            ) : (
              currentQuestion && (
                <div id={`card-${currentQuestion.id}`} className="accordion-card active">
                  <div className="card-header" style={{ cursor: "default" }}>
                    <div className="card-header-left">
                      <span className="question-num-badge">{originalNum}</span>
                      <span className="question-preview-text">{currentQuestion.question.substring(0, 50)}...</span>
                    </div>
                    <div className="card-header-right">
                      {masteryBadge}
                      {statusBadge}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="badges-row">
                      <span className="year-badge">{currentQuestion.years}</span>
                    </div>

                    {/* Quran / Poetry Context Display */}
                    {currentQuestion.quranVerse && (
                      <div className="quran-container">
                        <p className="quran-verse">{currentQuestion.quranVerse}</p>
                      </div>
                    )}

                    {currentQuestion.poetry && (
                      <div className="poetry-verse">
                        {currentQuestion.poetry.layout === "two-halves" ? (
                          <div className="poetry-two-halves">
                            <span className="poetry-hemistich">{currentQuestion.poetry.sadr}</span>
                            <span className="poetry-separator">* * *</span>
                            <span className="poetry-hemistich">{currentQuestion.poetry.ajuz}</span>
                          </div>
                        ) : (
                          <div className="poetry-line">
                            {currentQuestion.poetry.lines ? currentQuestion.poetry.lines.join(" ") : currentQuestion.question}
                          </div>
                        )}
                      </div>
                    )}

                    <p className="question-text">{currentQuestion.question}</p>

                    <div className="answer-input-container">
                      <label className="answer-label" htmlFor={`textarea-${currentQuestion.id}`}>إجابتك الشخصية يا بطل:</label>
                      <textarea
                        className="answer-textarea"
                        id={`textarea-${currentQuestion.id}`}
                        placeholder="اكتب هنا إجابتك النحوية الكاملة بكل أمانة قبل كشف الحل الوزاري..."
                        value={state.answers[currentQuestion.id] || ""}
                        disabled={state.shownAnswers[currentQuestion.id]}
                        onChange={(e) => onUpdateAnswer(currentQuestion.id, e.target.value)}
                      />
                    </div>

                    {!state.shownAnswers[currentQuestion.id] && (
                      <div className="submit-action-row">
                        <button 
                          className="btn btn-primary" 
                          onClick={() => onRevealAnswer(currentQuestion.id)}
                          disabled={!(state.answers[currentQuestion.id] || "").trim()}
                        >
                          <Eye className="h-4.5 w-4.5" strokeWidth={2.5} />
                          تمت الإجابة — أظهر الجواب النموذجي
                        </button>
                      </div>
                    )}

                    {state.shownAnswers[currentQuestion.id] && (
                      <>
                        <div className="model-answer-section animate-fade-in">
                          <h4 className="model-answer-title">الجواب النموذجي من المصدر:</h4>
                          <p className="model-answer-text">{currentQuestion.modelAnswer}</p>
                        </div>

                        <div className="evaluation-section animate-fade-in">
                          <h4 className="eval-title">ميزان التقييم الذاتي الأكاديمي (0 - 10 درجات)</h4>
                          <p className="eval-subtitle">قارن إجابتك بالحل النموذجي أعلاه بكل أمانة، ثم اختر الدرجة التي تستحقها:</p>
                          
                          <div className="flex flex-row flex-wrap justify-center items-center gap-1.5 md:gap-2" style={{ marginBottom: "1.5rem" }}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                              const isSelected = state.ratings[currentQuestion.id] === i;
                              return (
                                <button
                                  key={i}
                                  className={`btn-eval ${isSelected ? "selected" : ""}`}
                                  onClick={() => onRateQuestion(currentQuestion.id, i)}
                                  style={{ width: "38px", height: "38px", minWidth: "38px" }}
                                >
                                  {i}
                                </button>
                              );
                            })}
                          </div>

                          {state.ratings[currentQuestion.id] !== undefined && (
                            <div className="academic-slider-wrapper">
                              <div className="academic-badge-container">
                                <span className="academic-score-title">التقدير الأكاديمي:</span>
                                <span className="academic-score-badge">
                                  {state.ratings[currentQuestion.id]}/10 — {getAcademicLabel(state.ratings[currentQuestion.id])}
                                </span>
                              </div>
                              <div className="academic-slider-container">
                                <div className="academic-slider-track">
                                  <div 
                                    className="academic-slider-fill" 
                                    style={{ width: `${(state.ratings[currentQuestion.id]! / 10) * 100}%` }}
                                  />
                                </div>
                                <div className="academic-slider-steps">
                                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                                    <div 
                                      key={step} 
                                      className={`step-node ${state.ratings[currentQuestion.id]! >= step ? "active" : ""} ${state.ratings[currentQuestion.id]! === step ? "current" : ""}`}
                                    >
                                      <span className="step-dot" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="academic-milestones">
                                <span className="milestone text-red">● تأسيس (0-2)</span>
                                <span className="milestone text-amber">● مقبول/جيد (3-6)</span>
                                <span className="milestone text-emerald">● متمكن (7-10)</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mastery-section animate-fade-in">
                          <h4 className="mastery-title">تصنيف مستوى تمكنك من مهارة السؤال:</h4>
                          <div className="mastery-buttons">
                            <button 
                              className={`btn-mastery mastery-high ${state.mastery[currentQuestion.id] === "high" ? "selected" : ""}`} 
                              onClick={() => onSetMastery(currentQuestion.id, "high")}
                            >
                              متمكن من السؤال
                            </button>
                            <button 
                              className={`btn-mastery mastery-mid ${state.mastery[currentQuestion.id] === "mid" ? "selected" : ""}`} 
                              onClick={() => onSetMastery(currentQuestion.id, "mid")}
                            >
                              أحتاج إلى مراجعة الموضوع
                            </button>
                            <button 
                              className={`btn-mastery mastery-low ${state.mastery[currentQuestion.id] === "low" ? "selected" : ""}`} 
                              onClick={() => onSetMastery(currentQuestion.id, "low")}
                            >
                              غير متمكن
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="bottom-nav">
            <button 
              className="btn btn-secondary" 
              id="prev-btn" 
              onClick={handlePrev}
              disabled={filteredQuestions.length === 0 || filteredIndex <= 0}
            >
              السؤال السابق
            </button>
            <button className="btn btn-primary" onClick={onFinishPractice}>إنهاء التدريب وعرض النتيجة</button>
            <button 
              className="btn btn-secondary" 
              id="next-btn" 
              onClick={handleNext}
              disabled={filteredQuestions.length === 0 || filteredIndex === -1 || filteredIndex >= filteredQuestions.length - 1}
            >
              السؤال التالي
            </button>
          </div>
        </div>

        <aside className="right-panel">
          <div className="sidebar-title">التنقل السريع:</div>
          <div className="question-navigator" id="question-navigator">
            {filteredQuestions.map((q, idx) => {
              const originalIdx = questions.findIndex((item) => item.id === q.id);
              const originalNum = originalIdx + 1;
              const isFocused = state.currentIndex === originalIdx;
              const isAnswered = !!state.answers[q.id] && state.answers[q.id].trim().length > 0;

              return (
                <div
                  key={q.id}
                  ref={isFocused ? activeDotRef : null}
                  className={`nav-dot ${isFocused ? "active" : ""} ${isAnswered ? "answered" : ""}`}
                  title={`سؤال ${originalNum}: ${isAnswered ? "تمت الإجابة" : "لم تتم الإجابة"}`}
                  onClick={() => onNavigateToQuestion(originalIdx)}
                >
                  {originalNum}
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Bottom Pagination for Mobile */}
      {filteredQuestions.length > 0 && (
        <div className="bottom-pagination-container" id="bottom-pagination-container">
          <div className="pagination-header">
            <span className="pagination-title">الوصول السريع للأسئلة:</span>
            <div className="pagination-legend">
              <span className="legend-item"><span className="legend-dot unanswered" />غير مجاب</span>
              <span className="legend-item"><span className="legend-dot answered" />مجاب</span>
              <span className="legend-item"><span className="legend-dot active" />الحالي</span>
            </div>
          </div>
          <div className="pagination-list">
            {filteredQuestions.map((q, idx) => {
              const originalIdx = questions.findIndex((item) => item.id === q.id);
              const originalNum = originalIdx + 1;
              const isFocused = state.currentIndex === originalIdx;
              const isAnswered = !!state.answers[q.id] && state.answers[q.id].trim().length > 0;

              let btnClass = "";
              if (isFocused) {
                btnClass = "active";
              } else if (isAnswered) {
                btnClass = "answered";
              } else {
                btnClass = "unanswered";
              }

              return (
                <button
                  key={q.id}
                  ref={isFocused ? activeBtnRef : null}
                  className={`pagination-item-btn ${btnClass}`}
                  onClick={() => onNavigateToQuestion(originalIdx)}
                  title={`سؤال ${originalNum}`}
                >
                  {originalNum}
                  {isAnswered && <span className="check-indicator">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
