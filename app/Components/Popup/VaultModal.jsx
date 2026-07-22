"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useVault } from "../../Context/VaultContext";
import { useRouter } from "../../../i18n/routing";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RiSafe2Fill, RiGitRepositoryPrivateFill } from "react-icons/ri";
import { FaShieldAlt, FaLock } from "react-icons/fa";

const VaultModal = ({ isOpen, onClose, isRTL }) => {
  const t = useTranslations("navbar");
  const { unlock } = useVault();
  const router = useRouter();
  const [vaultPassword, setVaultPassword] = useState("");
  const [vaultLoading, setVaultLoading] = useState(false);
  const [vaultError, setVaultError] = useState("");
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVaultLoading(true);
    setVaultError("");
    try {
      const res = await unlock(vaultPassword);
      if (res.success) {
        setIsUnlockedSuccess(true);
        setTimeout(() => {
          onClose();
          router.push("/research-archive");
          setIsUnlockedSuccess(false);
        }, 1200);
      } else {
        setVaultError(t("vault.wrongPassword"));
      }
    } catch (err) {
      setVaultError("An error occurred. Please try again.");
    } finally {
      setVaultLoading(false);
    }
  };

  const ChainLink = () => (
    <div className="w-5 h-3 border-2 border-primary/60 rounded-full bg-[#1A1A1A] shadow-inner" />
  );

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#050505]/95 backdrop-blur-2xl"
        onClick={() => !vaultLoading && !isUnlockedSuccess && onClose()}
      />
      
      <div className="relative bg-[#0F0F0F] border border-primary/20 rounded-[40px] shadow-[0_0_50px_rgba(197,160,89,0.1)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
        
        <div className="p-10">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <FaShieldAlt className="text-primary text-[10px] animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                {t("vault.authorizedOnly")}
              </span>
            </div>
          </div>

          <div className="text-center mb-10">
            <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              {/* Main Safe Icon */}
              <motion.div 
                animate={isUnlockedSuccess ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}}
                className="relative w-24 h-24 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-primary/30 rounded-full flex items-center justify-center shadow-2xl z-10"
              >
                <RiSafe2Fill className="text-primary text-5xl" />
              </motion.div>

              {/* Chains Container */}
              <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                {/* Left to Right Chain */}
                <motion.div 
                  initial={{ rotate: 45 }}
                  animate={isUnlockedSuccess ? { x: -200, opacity: 0, rotate: 20 } : { x: 0, opacity: 1, rotate: 45 }}
                  transition={{ duration: 0.8, ease: "backIn" }}
                  className="absolute flex gap-1"
                >
                  {[1, 2, 3, 4, 5, 6].map(i => <ChainLink key={i} />)}
                </motion.div>

                {/* Right to Left Chain */}
                <motion.div 
                  initial={{ rotate: -45 }}
                  animate={isUnlockedSuccess ? { x: 200, opacity: 0, rotate: -20 } : { x: 0, opacity: 1, rotate: -45 }}
                  transition={{ duration: 0.8, ease: "backIn" }}
                  className="absolute flex gap-1"
                >
                  {[1, 2, 3, 4, 5, 6].map(i => <ChainLink key={i} />)}
                </motion.div>

                {/* Center Lock */}
                <motion.div
                  animate={isUnlockedSuccess ? { scale: 0, opacity: 0, y: 50 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute p-3 bg-primary rounded-full shadow-2xl border-4 border-[#0F0F0F]"
                >
                  <FaLock className="text-[#0F0F0F] text-xl" />
                </motion.div>
              </div>

              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            </div>
            
            <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
              {isUnlockedSuccess ? "ACCESS GRANTED" : t("vault.enterPassword")}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">
              {isUnlockedSuccess ? "Opening secure archives..." : t("vault.passwordSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <input
                type="password"
                disabled={isUnlockedSuccess}
                value={vaultPassword}
                onChange={(e) => setVaultPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-8 py-5 bg-[#171717] border-2 rounded-3xl focus:outline-none transition-all text-center text-2xl tracking-[0.3em] font-bold text-primary placeholder:text-primary/10 ${
                  vaultError
                    ? "border-red-900/50 focus:border-red-500/50"
                    : "border-white/5 focus:border-primary/40"
                } ${isUnlockedSuccess ? "opacity-50" : ""}`}
                autoFocus
              />
              {vaultError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-3 text-center font-bold uppercase tracking-wider"
                >
                  {vaultError}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={vaultLoading || !vaultPassword || isUnlockedSuccess}
              className="group relative w-full overflow-hidden py-5 bg-primary text-[#0A0A0A] font-black rounded-3xl shadow-[0_10px_30px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_40px_rgba(197,160,89,0.3)] disabled:opacity-30 disabled:grayscale transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
            >
              {vaultLoading ? (
                <div className="w-5 h-5 border-3 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
              ) : isUnlockedSuccess ? (
                <div className="w-5 h-5 border-3 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">{t("vault.submit")}</span>
                  <RiGitRepositoryPrivateFill size={20} className="relative z-10 transition-transform group-hover:rotate-12" />
                </>
              )}
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-full"></div>
            </button>
          </form>

          <p className="mt-10 text-[9px] text-center text-slate-600 font-bold uppercase tracking-[0.3em]">
            System Tracking Active • Secure Session
          </p>
        </div>
      </div>
    </div>
  );
};

export default VaultModal;
