import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  RotateCcw,
  Volume2,
  Copy,
  Check,
  AlertCircle,
  Flower2,
  User,
  Zap,
} from "lucide-react";
import { Message, AppSettings, Memory, TabType } from "../types";
import { sendChatMessage } from "../services/aiService";
import { TulipIcon } from "../components/TulipIcon";

interface ChatScreenProps {
  messages: Message[];
  onUpdateMessages: (messages: Message[]) => void;
  onClearMessages: () => void;
  settings: AppSettings;
  onUpdateSettings?: (settings: AppSettings) => void;
  memories: Memory[];
  onNavigate: (tab: TabType) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  onUpdateMessages,
  onClearMessages,
  settings,
  onUpdateSettings,
  memories,
  onNavigate,
}) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setInputText("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    onUpdateMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await sendChatMessage({
        messages: newMessages,
        settings,
        memories,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.text,
        modelUsed: result.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      onUpdateMessages([...newMessages, assistantMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorMessage("Could not connect with Ishant momentarily. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleModelSpeed = () => {
    if (!onUpdateSettings) return;
    const nextModel =
      settings.aiModel === "gemini-3.1-flash-lite"
        ? "gemini-3.8-flash"
        : "gemini-3.1-flash-lite";
    onUpdateSettings({ ...settings, aiModel: nextModel });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang.includes("hi") || v.lang.includes("IN"));
    if (hindiVoice) utterance.voice = hindiVoice;

    window.speechSynthesis.speak(utterance);
  };

  const isFastModel = (settings.aiModel || "gemini-3.1-flash-lite") === "gemini-3.1-flash-lite";

  const suggestedStarters = [
    "Kaisi ho Ishant?",
    "Aaj thoda thak gayi hoon",
    "Mujhe mere favourites yaad dilao",
    "Kuch acchi comedy series batao",
    "Ek calming thought share karo",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[820px] pb-2">
      {/* Chat Sub-header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#091e14]/70 border-b border-[#163a28] rounded-2xl mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#143d28] border border-[#276144] flex items-center justify-center">
            <TulipIcon size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-serif font-semibold text-[#f0fdf4]">
                Ishant AI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-pulse"></span>
            </div>
            <span className="text-[10px] text-[#78a88f]">
              Speaks English, Hindi & Hinglish naturally
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Fast Model Badge & Switcher */}
          <button
            onClick={toggleModelSpeed}
            className={`text-[10px] px-2 py-1 rounded-lg border flex items-center gap-1 transition-all ${
              isFastModel
                ? "bg-[#144229] border-[#40916c] text-[#95d5b2] font-semibold"
                : "bg-[#0f281b] border-[#204a33] text-[#7ea891]"
            }`}
            title="Click to toggle Fast Free Gemini (Flash Lite)"
          >
            <Zap className={`w-3 h-3 ${isFastModel ? "text-[#52b788] fill-[#52b788]" : "text-[#7ea891]"}`} />
            <span>{isFastModel ? "Fast Free Gemini" : "Standard Flash"}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Clear this conversation history with Ishant?")) {
                onClearMessages();
              }
            }}
            className="text-xs text-[#6e9680] hover:text-[#95d5b2] flex items-center gap-1 p-1.5 rounded-lg hover:bg-[#123623] transition-colors"
            title="Clear Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pr-2">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-[#143d28] border border-[#276144] flex items-center justify-center shrink-0 mb-1">
                  <TulipIcon size={16} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 shadow-sm text-sm transition-all ${
                  isUser
                    ? "bg-[#20573e] text-[#f2faf5] rounded-br-xs border border-[#2d7353]"
                    : "bg-[#0c2317] text-[#e0efe6] rounded-bl-xs border border-[#194530]"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>

                <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-black/10 text-[10px] text-[#86b197]">
                  <div className="flex items-center gap-1.5">
                    <span>{message.timestamp}</span>
                    {!isUser && (
                      <span className="text-[9px] text-[#52b788] opacity-75">
                        · Fast reply
                      </span>
                    )}
                  </div>

                  {!isUser && (
                    <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => speakText(message.content)}
                        className="p-0.5 rounded hover:text-white"
                        title="Listen to Ishant"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-0.5 rounded hover:text-white"
                        title="Copy message"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-[#52b788]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-[#1b4332] border border-[#2d6a4f] flex items-center justify-center shrink-0 mb-1 text-[#a7d9bc]">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-end gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-xl bg-[#143d28] border border-[#276144] flex items-center justify-center shrink-0 mb-1">
              <TulipIcon size={16} />
            </div>
            <div className="bg-[#0c2317] border border-[#194530] rounded-2xl rounded-bl-xs p-3.5 text-xs text-[#90c0a3] flex items-center gap-2">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-[#52b788] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-[#52b788] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-[#52b788] rounded-full animate-bounce"></div>
              </div>
              <span className="italic">Ishant is typing fast...</span>
            </div>
          </div>
        )}

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      {messages.length <= 3 && !isLoading && (
        <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#639277] shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#52b788]" /> Ideas:
          </span>
          {suggestedStarters.map((starter, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(starter)}
              className="text-xs bg-[#0e271b] hover:bg-[#163f2c] text-[#a4d4b8] px-3 py-1.5 rounded-xl border border-[#1e4a34] whitespace-nowrap transition-colors shrink-0"
            >
              {starter}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="mt-2 shrink-0 pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2 bg-[#091e14] border border-[#1d4933] rounded-2xl p-2 focus-within:border-[#40916c] transition-colors shadow-lg shadow-[#040e08]"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type in English, Hindi, or Hinglish..."
            className="flex-1 bg-transparent text-sm text-[#f0fdf4] placeholder-[#5c856e] px-2 py-1 resize-none focus:outline-none max-h-24"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all ${
              inputText.trim() && !isLoading
                ? "bg-[#2d6a4f] hover:bg-[#388261] text-[#f0fdf4] shadow-md shadow-[#0a1e14]"
                : "bg-[#122e20] text-[#4d725d] cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-[#5e8b72] px-2 pt-1">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#52b788]" /> Powered by Fast Free Gemini
          </span>
          <span>Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};
