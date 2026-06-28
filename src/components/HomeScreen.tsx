/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GraduationCap, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

interface HomeScreenProps {
  totalQuestions: number;
  answeredCount: number;
  onStartPractice: () => void;
  onPromptReset: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  totalQuestions,
  answeredCount,
  onStartPractice,
  onPromptReset,
}) => {
  const hasHistory = answeredCount > 0;
  const [imgSrc, setImgSrc] = useState("./brand/madrasati-logo.jpg");
  const [useFallbackText, setUseFallbackText] = useState(false);

  const handleImgError = () => {
    if (imgSrc === "./brand/madrasati-logo.jpg") {
      setImgSrc("./brand/madrasati-logo.png");
    } else {
      setUseFallbackText(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <section className="home-screen" id="home-screen">
        <div className="home-logo-container">
          {useFallbackText ? (
            <div 
              className="home-logo flex items-center justify-center font-bold text-white text-3xl"
              style={{ backgroundColor: "#5B2596", width: "140px", height: "140px", borderRadius: "24px" }}
            >
              مدرسي
            </div>
          ) : (
            <img 
              className="home-logo" 
              src={imgSrc} 
              onError={handleImgError} 
              alt="منصة مدرسي" 
            />
          )}
        </div>
        
        <h1 className="home-title">منصة مدرسي</h1>
        <p className="home-subtitle">الأسئلة الوزارية حول الاستفهام التصديقي والتصوري لقواعد اللغة العربية للصف السادس الإعدادي</p>
        
        {/* Steps Indicator Card */}
        <div className="home-steps-card">
          <h3 className="home-steps-title" style={{ borderBottom: "none", paddingBottom: 0, marginBottom: "0.5rem" }}>طريقة العمل المختصرة في المنصة:</h3>
          <hr className="my-2 opacity-30" style={{ borderColor: "var(--color-border)" }} />
          <ul className="home-steps-list" style={{ marginTop: "1rem" }}>
            <li>
              <span className="home-steps-num">١</span>
              <span>اكتب جوابك الشخصي كاملاً وبكل أمانة في الحقل المخصص.</span>
            </li>
            <li>
              <span className="home-steps-num">٢</span>
              <span>اضغط على زر (أظهر الجواب النموذجي) للمقارنة الدقيقة مع المصدر.</span>
            </li>
            <li>
              <span className="home-steps-num">٣</span>
              <span>قيّم جوابك يا بطل بموضوعية واختر الدرجة المناسبة من (0 إلى 10).</span>
            </li>
            <li>
              <span className="home-steps-num">٤</span>
              <span>حدد مستوى تمكنك من السؤال لمراجعة نقاط ضعفك لاحقاً بكل سهولة.</span>
            </li>
          </ul>
        </div>

        {/* Quick Progress Preview */}
        <div className="home-stats-preview" id="home-stats-preview" style={{ display: "block", marginBottom: "1rem" }}>
          عدد الأسئلة الكلي في هذا التدريب: <strong id="home-total-count">{totalQuestions}</strong> سؤالاً وزارياً.
          {hasHistory && (
            <div className="text-xs opacity-80 mt-1" style={{ color: "var(--color-text-muted)" }}>
              أجبت عن {answeredCount} سؤالاً حتى الآن.
            </div>
          )}
        </div>
        
        <div className="home-actions">
          <button className="btn btn-primary" onClick={onStartPractice}>
            <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            {hasHistory ? "متابعة التدريب الحالي" : "ابدأ التدريب الآن"}
          </button>
          
          {hasHistory && (
            <button className="btn btn-secondary" id="reset-history-btn" onClick={onPromptReset}>
              <RotateCcw className="h-4.5 w-4.5" strokeWidth={2.5} />
              تصفير التقدم
            </button>
          )}
        </div>
      </section>
    </motion.div>
  );
};

