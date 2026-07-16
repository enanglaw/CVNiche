"use client";

import React, { useState } from "react";
import { 
  Brain, 
  Send, 
  User, 
  Sparkles, 
  HelpCircle, 
  MessageSquare,
  FileText,
  Briefcase
} from "lucide-react";

export default function CoachPage() {
  const [messages, setMessages] = useState<any[]>([
    { 
      role: "model", 
      content: "Hello! I am **NicheCoach**, your AI career advisor. Ask me anything about writing resumes, preparing for specific interviews (e.g. Google, Amazon, Stripe), finding matching jobs, or choosing career roadmap paths.",
      timestamp: "10:00 AM" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    { text: "Prepare me for Amazon interview", icon: Briefcase },
    { text: "Rewrite my experience bullet", icon: FileText },
    { text: "Suggest projects to fill my skill gaps", icon: Sparkles },
    { text: "Why am I getting rejected?", icon: HelpCircle },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { role: "user", content: text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let reply = "";
      if (text.toLowerCase().includes("amazon")) {
        reply = "To prepare for an **Amazon Technical Interview**, you must master two pillars:\n\n1. **Leadership Principles (LP)**: Amazon evaluates 50% of the interview on LPs (e.g. *Customer Obsession*, *Ownership*, *Bias for Action*). Prepare 2 STAR stories for each principle.\n2. **System Design / Coding**: Focus on distributed databases, cache eviction policies, and load balancing.\n\n*Would you like me to run a mock interview with you for a Software Engineer role?*";
      } else if (text.toLowerCase().includes("rewrite")) {
        reply = "Here is a high-impact rewrite for your experience:\n\n* **Before**: 'Worked on software projects and fixed bugs.'\n* **After**: '**Engineered a real-time event ingestion service** in NestJS, processing over **2.5M daily events** and reducing database pipeline load by **30%**.'\n\n*Does this match your specific technical stack?*";
      } else {
        reply = "That's a great question. Based on your profile and target positions, I recommend focusing on containerization (Docker, Kubernetes) and microservice communication patterns. Let's draft a plan to improve in this area!";
      }

      setMessages(prev => [...prev, { role: "model", content: reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1200);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-zinc-900/20 border border-zinc-800/60 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Coach Header */}
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-600/10 flex items-center justify-center border border-violet-500/20 shadow-md">
            <Brain className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <span className="block font-bold text-sm text-zinc-200">NicheCoach</span>
            <span className="block text-xs text-green-400 font-medium">Online &bull; AI Career Coach</span>
          </div>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role !== "user" && (
              <div className="h-8 w-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Brain className="h-4 w-4 text-violet-400" />
              </div>
            )}
            
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-2 ${
              msg.role === "user" 
                ? "bg-violet-600 text-white rounded-tr-none" 
                : "bg-zinc-900/60 border border-zinc-850 text-zinc-300 rounded-tl-none"
            }`}>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br />')
                }} 
              />
              <span className="block text-[9px] text-right text-zinc-500 mt-1">{msg.timestamp}</span>
            </div>

            {msg.role === "user" && (
              <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-zinc-300" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="h-8 w-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Brain className="h-4 w-4 text-violet-400 animate-pulse" />
            </div>
            <div className="bg-zinc-900/60 border border-zinc-850 text-zinc-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce delay-100"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts footer if chat is starting */}
      {messages.length === 1 && (
        <div className="px-6 py-4 border-t border-zinc-800/40 bg-zinc-950/20">
          <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">Suggested Prompts</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickPrompts.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.text}
                  onClick={() => handleSend(p.text)}
                  className="flex items-center gap-2.5 px-3 py-2 text-left text-xs bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-750 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all"
                >
                  <Icon className="h-4 w-4 text-violet-400 shrink-0" />
                  <span className="truncate">{p.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center gap-3">
        <input 
          type="text" 
          placeholder="Ask NicheCoach: 'Rewrite my summary', 'Mock interview for Stripe'..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-violet-500 text-zinc-300 transition-colors placeholder:text-zinc-650"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
        />
        <button 
          onClick={() => handleSend(input)}
          className="bg-violet-600 hover:bg-violet-500 text-white h-9 w-9 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-violet-600/10 shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
