import React from "react";

/**
 * HisabLogo Component
 * Minimalist app logo rendering `hisab_svg.svg` and the clean name "Hisab".
 *
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} showText - Whether to display the 'Hisab' text
 * @param {string} className - Extra CSS classes
 */
const HisabLogo = ({
  size = "md",
  showText = true,
  className = "",
}) => {
  const sizeMap = {
    sm: {
      imgSize: "w-7 h-7",
      textSize: "text-base font-bold tracking-tight",
    },
    md: {
      imgSize: "w-9 h-9",
      textSize: "text-xl font-extrabold tracking-tight",
    },
    lg: {
      imgSize: "w-11 h-11",
      textSize: "text-2xl font-black tracking-tight",
    },
    xl: {
      imgSize: "w-14 h-14",
      textSize: "text-3xl font-black tracking-tight",
    },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* App Icon using /hisab_svg.svg */}
      <img
        src="/hisab_svg.svg"
        alt="Hisab"
        className={`${current.imgSize} object-contain transition-transform duration-200 group-hover:scale-105`}
      />

      {/* Minimal App Name */}
      {showText && (
        <span className={`${current.textSize} text-slate-900 dark:text-white transition-colors duration-200`}>
          Hisab
        </span>
      )}
    </div>
  );
};

export default HisabLogo;
