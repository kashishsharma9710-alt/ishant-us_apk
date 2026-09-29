import React, { useState, useEffect } from "react";
import {
  Download,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  X,
  Share2,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { TulipIcon } from "./TulipIcon";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // App live URL
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://ais-pre-aiizp67mjej3ozke5a4lih-349022476112.asia-southeast1.run.app";

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions if inside iframe
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0b2116] border border-[#214f38] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#183d29]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#143d28] border border-[#276144] flex items-center justify-center">
              <TulipIcon size={18} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#f0fdf4]">
                Download & Install "Only us"
              </h3>
              <p className="text-xs text-[#78a88f]">
                Mobile App & APK Setup Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#88b699] hover:text-white hover:bg-[#153e2a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Install Action */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-[#113524] to-[#184832] border border-[#2d6a4f] shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#95d5b2] uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#52b788]" />
              Android & Phone App
            </span>
            <span className="text-[10px] bg-[#1e543b] text-[#b7e4c7] px-2 py-0.5 rounded-full border border-[#3b7e5e]">
              Direct Install
            </span>
          </div>

          <p className="text-xs text-[#d8f3dc] leading-relaxed mb-3">
            Aap isko apne phone me bilkul native Android App (APK / PWA) ki tarah chala sakte hain, jisme Tulip icon aur full-screen mode aayega.
          </p>

          {deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 px-4 rounded-xl bg-[#52b788] hover:bg-[#40916c] text-[#07130e] font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install App on this Device</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={copyLink}
                className="flex-1 py-2 px-3 rounded-xl bg-[#1d4c35] hover:bg-[#276346] text-[#e0f5ea] text-xs font-medium border border-[#367957] flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#52b788]" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy App URL</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Easy 3-Step Phone Install Guide */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-[#72a888] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#52b788]" />
            Phone Me Install Karne Ka Simple Tarika:
          </h4>

          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-[#081810] border border-[#163c28] flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#1b4332] text-[#95d5b2] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#f0fdf4]">
                Chrome / Safari Browser Me Kholein
              </p>
              <p className="text-[#7da990] mt-0.5">
                Apne phone ke Chrome browser me app ka link paste karke open karein.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-[#081810] border border-[#163c28] flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#1b4332] text-[#95d5b2] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#f0fdf4]">
                3 Dots (⋮) Menu Par Tap Karein
              </p>
              <p className="text-[#7da990] mt-0.5">
                Top-right corner me 3 dots par tap karein aur{" "}
                <strong className="text-[#b7e4c7]">"Install app"</strong> ya{" "}
                <strong className="text-[#b7e4c7]">"Add to Home Screen"</strong> select karein.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-[#081810] border border-[#163c28] flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#1b4332] text-[#95d5b2] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#f0fdf4]">
                App Icon Phone Screen Par Add Ho Jayega
              </p>
              <p className="text-[#7da990] mt-0.5">
                "Only us" ka Tulip icon aapke phone ke home screen par normal app ki tarah save ho jayega aur bina browser bar ke open hoga.
              </p>
            </div>
          </div>

          {/* Method 2: Convert to APK File */}
          <div className="p-4 rounded-2xl bg-[#091f14] border border-[#1d4833] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#95d5b2] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#52b788]" />
                Direct .APK File Banani Ho:
              </span>
              <span className="text-[10px] text-[#719d84]">pwabuilder.com</span>
            </div>
            <p className="text-[11px] text-[#86b199] leading-relaxed">
              Agar aapko download karne ke liye exact <strong>.apk installer file</strong> chahiye:
              <br />
              1. Is app ka link copy karein.
              <br />
              2. Free tool <strong>PWABuilder.com</strong> par link paste karein.
              <br />
              3. "Package for Android" par click karke direct `.apk` download kar lijiye!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={copyLink}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#255e44] text-[#f0fdf4] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#52b788]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Link Copied!" : "Copy App Link"}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-[#0a1b12] text-[#82ad94] hover:text-white text-xs border border-[#163826] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
