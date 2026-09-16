"use client";
import React from "react";
import { FaTimes } from "react-icons/fa";

const FormTest = ({ onClose, isRTL }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
      <div 
        className="relative w-full max-w-6xl h-[95vh] sm:h-[90vh] bg-[#06111e] rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-[#d8b56b]/30 shadow-[0_0_50px_rgba(216,181,107,0.15)] flex flex-col animate-in fade-in zoom-in-95 duration-300"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#030810]">
          <h2 className="text-[#d8b56b] text-base sm:text-xl font-black tracking-widest flex items-center gap-3">
            <span className="text-xl">✦</span>
            بنيان | استبيان التأمل في دوافع تعدد العلاقات
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all hover:rotate-90"
            title={isRTL ? "إغلاق" : "Close"}
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        {/* Iframe Container */}
        <div className="flex-1 w-full bg-[#06111e] relative">
          <iframe 
            src="/BUNYAN_Multiple_Relationships_Final_Interactive.html" 
            className="absolute inset-0 w-full h-full border-0"
            title="Bunyan Scale"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default FormTest;
