import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, X, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { TulipIcon } from "./TulipIcon";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onOpenChat,
}) => {
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [speechStatus, setSpeechStatus] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopMicTest();
    };
  }, []);

  const startMicTest = async () => {
    try {
      setSpeechStatus("Listening to your mic...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsMicTesting(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicVolume(Math.min(100, Math.round(avg * 1.5)));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err: any) {
      console.warn("Microphone access error:", err);
      setSpeechStatus("Microphone permission needed or unavailable.");
      setIsMicTesting(false);
    }
  };

  const stopMicTest = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsMicTesting(false);
    setMicVolume(0);
  };

  const testIshantSpeech = () => {
    if (!("speechSynthesis" in window)) {
      setSpeechStatus("Text-to-speech not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      "Hello Srishti! Main Ishant hoon. Only us me aapka swaagat hai."
    );
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes("hi") || v.lang.includes("IN"));
    if (hindiVoice) utterance.voice = hindiVoice;

    setSpeechStatus("Ishant is speaking...");
    utterance.onend = () => setSpeechStatus("Voice preview finished.");
    utterance.onerror = () => setSpeechStatus("Could not play speech.");

    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0b2116] border border-[#1f4f39] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#183d2a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#143d28] border border-[#2d6a4f] flex items-center justify-center">
              <TulipIcon size={18} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#f0fdf4]">
                Ishant Voice Mode
              </h3>
              <p className="text-xs text-[#72a386]">Interactive preview & Phase 2 architecture</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopMicTest();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#88b699] hover:text-white hover:bg-[#153e2a] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wake Word Badge */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-[#0d2a1d] to-[#123624] border border-[#24583e] flex items-center justify-between">
          <div>
            <span className="text-[11px] tracking-wider uppercase text-[#73b58e] font-semibold">
              Planned Wake Word
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-bold font-serif text-[#d8f3dc]">
                "Ishant"
              </span>
              <span className="text-[10px] bg-[#1a4430] text-[#95d5b2] px-2 py-0.5 rounded-full border border-[#2d6a4f]/50">
                Phase 2
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1b4332] border border-[#40916c]/50 flex items-center justify-center text-[#74c69d]">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Real Audio / Mic Tester */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#081810] border border-[#163c28]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#cbe5d5]">
                Microphone Input Test
              </span>
              <button
                onClick={isMicTesting ? stopMicTest : startMicTest}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  isMicTesting
                    ? "bg-red-900/60 text-red-200 border border-red-700/50"
                    : "bg-[#1b4332] hover:bg-[#245a43] text-[#a7d9bc] border border-[#3b7e5e]/50"
                }`}
              >
                {isMicTesting ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Stop Mic
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" /> Test Mic
                  </>
                )}
              </button>
            </div>

            {/* Mic Visualizer bar */}
            <div className="h-3 w-full bg-[#0d2419] rounded-full overflow-hidden p-0.5 border border-[#1c4530]">
              <div
                className="h-full bg-gradient-to-r from-[#40916c] to-[#74c69d] rounded-full transition-all duration-75"
                style={{ width: `${isMicTesting ? Math.max(micVolume, 6) : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-[#6d967e] mt-2">
              {isMicTesting
                ? "Microphone is connected! Speak to see live input level."
                : "Verify that your device microphone is accessible."}
            </p>
          </div>

          {/* Voice Preview Button */}
          <div className="p-4 rounded-2xl bg-[#081810] border border-[#163c28]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-[#cbe5d5]">
                  Speech Output Preview
                </h4>
                <p className="text-[11px] text-[#6d967e]">
                  Hear Ishant's warm voice greeting
                </p>
              </div>
              <button
                onClick={testIshantSpeech}
                className="px-3 py-1.5 rounded-lg bg-[#19402e] hover:bg-[#255840] text-[#a7d9bc] text-xs font-medium border border-[#3b7e5e]/50 flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" /> Speak
              </button>
            </div>
            {speechStatus && (
              <p className="text-[11px] text-[#86bf9e] mt-2 italic">
                {speechStatus}
              </p>
            )}
          </div>

          {/* Transparent Roadmap */}
          <div className="p-4 rounded-2xl bg-[#091e14] border border-[#163c28]">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#72a888] mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" />
              Phase 2 Development Roadmap
            </h4>
            <ul className="text-xs text-[#95bfa6] space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#40916c]"></span>
                <span>Continuous background wake-word listening ("Ishant")</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#40916c]"></span>
                <span>Low-latency real-time voice conversation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#40916c]"></span>
                <span>Native Android screen-off activation & notification triggers</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => {
              stopMicTest();
              onClose();
              onOpenChat();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] hover:from-[#357a5b] hover:to-[#22533e] text-[#f0fdf4] font-medium text-sm transition-all shadow-md shadow-[#07170f] flex items-center justify-center gap-2"
          >
            <span>Open Ishant AI Chat</span>
          </button>
          <button
            onClick={() => {
              stopMicTest();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-[#7ea991] hover:text-[#cde8d7] text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
