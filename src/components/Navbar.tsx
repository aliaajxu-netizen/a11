/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Home, Sun, Moon } from "lucide-react";

interface NavbarProps {
  currentScreen: string;
  theme: "light" | "dark";
  onNavigate: (screen: "home" | "practice" | "results") => void;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  theme,
  onNavigate,
  onToggleTheme,
}) => {
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
    <nav className="navbar">
      <div className="brand" id="nav-brand" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
        {useFallbackText ? (
          <div 
            className="brand-logo flex items-center justify-center font-bold text-white text-xs"
            style={{ backgroundColor: "#5B2596" }}
          >
            مدرسي
          </div>
        ) : (
          <img 
            className="brand-logo" 
            src={imgSrc} 
            onError={handleImgError} 
            alt="منصة مدرسي" 
          />
        )}
        <span className="brand-name">منصة مدرسي</span>
      </div>
      
      <div className="nav-actions">
        {currentScreen !== "home" && (
          <button 
            className="btn btn-secondary" 
            id="nav-home-btn" 
            onClick={() => onNavigate("home")}
          >
            <Home className="h-[18px] w-[18px]" strokeWidth={2.5} />
            الرئيسية
          </button>
        )}

        <button 
          className="btn btn-secondary btn-circle" 
          id="theme-toggle" 
          onClick={onToggleTheme}
          title="تبديل الوضع الليلي والنهاري"
        >
          <span id="theme-icon">
            {theme === "dark" ? (
              <Sun className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={2} />
            )}
          </span>
        </button>
      </div>
    </nav>
  );
};

