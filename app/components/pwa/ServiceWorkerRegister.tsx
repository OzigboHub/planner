"use client";

import { useEffect, useState } from "react";

export function ServiceWorkerRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("PWA Service Worker registered successfully:", registration.scope);
          })
          .catch((error) => {
            console.warn("PWA Service Worker registration failed:", error);
          });
      });
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show subtle banner or floating prompt if not installed yet
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    window.addEventListener("appinstalled", () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-3.5 bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs no-print animate-fade-in">
      <div className="min-w-0">
        <p className="font-semibold text-white">Install Memorial App</p>
        <p className="text-[11px] text-slate-400 truncate">Add Pa Festus Memorial to your home screen</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
        >
          Install
        </button>
        <button
          onClick={() => setShowInstallBanner(false)}
          className="p-1.5 text-slate-400 hover:text-white text-xs"
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
