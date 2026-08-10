"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { accessVault } from "../lib/server-api";

const VaultContext = createContext();
const VAULT_UNLOCKED_KEY = "vault_unlocked";
const VAULT_DATA_KEY = "vault_data";
const VAULT_PASSWORD_KEY = "vault_password";

export const VaultProvider = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [vaultData, setVaultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const savedUnlocked =
        sessionStorage.getItem(VAULT_UNLOCKED_KEY) === "true";
      const savedData = sessionStorage.getItem(VAULT_DATA_KEY);

      setIsUnlocked(savedUnlocked);
      setVaultData(savedData ? JSON.parse(savedData) : null);
    } catch {
      setIsUnlocked(false);
      setVaultData(null);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const unlock = async (password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await accessVault(password);
      if (result.success) {
        setIsUnlocked(true);
        setVaultData(result.data);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(VAULT_UNLOCKED_KEY, "true");
          sessionStorage.setItem(VAULT_DATA_KEY, JSON.stringify(result.data));
          sessionStorage.setItem(VAULT_PASSWORD_KEY, password);
        }
        setLoading(false);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        setLoading(false);
        return { success: false, message: result.message };
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
      return { success: false, message: "An unexpected error occurred" };
    }
  };

  const refreshVault = useCallback(async (page = 1) => {
    if (typeof window === "undefined") {
      return { success: false, message: "Unavailable on server" };
    }

    const savedPassword = sessionStorage.getItem(VAULT_PASSWORD_KEY);
    if (!savedPassword) {
      return { success: false, message: "Password is not available" };
    }

    setLoading(true);
    setError(null);
    try {
      const result = await accessVault(savedPassword, page);
      if (result.success) {
        setIsUnlocked(true);
        setVaultData(result.data);
        sessionStorage.setItem(VAULT_UNLOCKED_KEY, "true");
        sessionStorage.setItem(VAULT_DATA_KEY, JSON.stringify(result.data));
      } else {
        setError(result.message);
      }

      return result;
    } catch {
      setError("An unexpected error occurred");
      return { success: false, message: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  }, []);

  const lock = () => {
    setIsUnlocked(false);
    setVaultData(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(VAULT_UNLOCKED_KEY);
      sessionStorage.removeItem(VAULT_DATA_KEY);
      sessionStorage.removeItem(VAULT_PASSWORD_KEY);
    }
  };

  return (
    <VaultContext.Provider
      value={{
        isUnlocked,
        vaultData,
        loading,
        error,
        unlock,
        refreshVault,
        lock,
        isInitializing,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
};
