"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Layers, 
  FileText, 
  Map, 
  BookOpen, 
  Briefcase, 
  Brain,
  Trophy,
  ArrowUpRight,
  TrendingDown,
  AlertCircle,
  ChevronRight,
  Linkedin
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("scores");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source");
      if (utmSource) {
        sessionStorage.setItem("utm_source", utmSource);
        fetch("http://localhost:5001/api/campaigns/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ utmSource })
        }).catch((err) => console.error("Failed to log UTM click:", err));
      }
    }
  }, []);

  // Mock data representing database states
  const scores = [
    { name: "Resume Quality", score: 90, change: "+3%", color: "text-theme-accent", bg: "bg-theme-accent-bg" },
    { name: "ATS Compatibility", score: 88, change: "+1%", color: "text-theme-accent", bg: "bg-theme-accent-bg" },
    { name: "LinkedIn Optimization", score: 82, change: "+5%", color: "text-theme-accent", bg: "bg-theme-accent-bg" },
    { name: "Portfolio Readiness", score: 91, change: "+2%", color: "text-theme-accent", bg: "bg-theme-accent-bg" },
  ];

  const skillGaps = [
    { skill: "Kubernetes", category: "Infrastructure", demand: "High", gapPct: 85 },
    { skill: "GraphQL", category: "Backend API", demand: "Medium", gapPct: 60 },
    { skill: "System Design", category: "Architecture", demand: "Critical", gapPct: 90 },
    { skill: "CI/CD Pipelines", category: "DevOps", demand: "High", gapPct: 70 },
  ];

  const recentApps = [
    { title: "Senior Backend Engineer", company: "Stripe", status: "Interviewing", date: "2 days ago", matchScore: 94 },
    { title: "Node.js Developer", company: "Netflix", status: "Applied", date: "4 days ago", matchScore: 89 },
    { title: "Software Engineer", company: "Linear", status: "Interviewing", date: "1 week ago", matchScore: 92 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Welcome banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-theme-accent-bg/60 to-indigo-900/60 border border-theme-accent/40 p-8 shadow-xl shadow-theme-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back, John!</h1>
            <p className="text-zinc-300 max-w-xl text-sm leading-relaxed">
              Your career DNA score is in the top <span className="text-theme-accent font-semibold">12%</span> of engineers. Complete your learning roadmap to unlock 3 matched senior roles at Stripe and Linear.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link 
              href="/coach"
              className="bg-zinc-900 border border-zinc-700/60 text-zinc-200 hover:bg-zinc-800 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
            >
              <Brain className="h-4.5 w-4.5 text-theme-accent" />
              Ask Career Coach
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {scores.map((s) => (
          <div key={s.name} className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/60 transition-all duration-300 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-theme-accent-bg to-transparent rounded-bl-full group-hover:opacity-80 transition-all"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{s.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>
                {s.change} vs last wk
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-zinc-100">{s.score}%</span>
              <span className="text-xs text-zinc-500 font-medium">score</span>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-theme-btn rounded-full transition-all duration-1000"
                style={{ width: `${s.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Split details columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Pipeline & Gaps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skill Gaps Card */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100">Critical Skill Gaps</h2>
                  <p className="text-xs text-zinc-500">Skills required for your targeted Senior positions</p>
                </div>
              </div>
              <span className="text-xs text-theme-accent font-semibold hover:underline cursor-pointer flex items-center gap-1">
                View Learning Roadmap
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillGaps.map((gap) => (
                <div key={gap.skill} className="bg-zinc-950/50 border border-zinc-850 p-4 rounded-xl hover:border-zinc-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-zinc-200">{gap.skill}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      gap.demand === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    }`}>
                      {gap.demand} Demand
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                    <span>Target Gap Level</span>
                    <span>{gap.gapPct}% missing</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" 
                      style={{ width: `${gap.gapPct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Job tracker pipeline */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <Trophy className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100">Application Pipeline</h2>
                  <p className="text-xs text-zinc-500">Track and optimize applied jobs</p>
                </div>
              </div>
              <Link href="/tracker" className="text-xs text-theme-accent font-semibold hover:underline flex items-center gap-1">
                Go to Kanban Board
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentApps.map((app) => (
                <div key={app.company} className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:bg-zinc-950 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-300 font-bold text-sm">
                      {app.company[0]}
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-zinc-200">{app.title}</span>
                      <span className="block text-xs text-zinc-500">{app.company} &bull; {app.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs bg-theme-accent-bg border border-theme-accent-border text-theme-accent px-2.5 py-1 rounded-full font-medium">
                      Match: {app.matchScore}%
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      app.status === "Interviewing" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Learning roadmap & actions */}
        <div className="space-y-8">
          {/* Action cards */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-zinc-100 border-b border-zinc-800/50 pb-4">Quick AI Workflows</h2>
            
            <div className="space-y-3">
              <Link 
                href="/resumes" 
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 hover:border-theme-accent-border hover:bg-zinc-950 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-theme-accent" />
                  <div>
                    <span className="block text-sm font-semibold text-zinc-200 group-hover:text-theme-accent transition-colors">Resume Tailoring</span>
                    <span className="block text-xs text-zinc-500">Auto-tailor to job specs</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                href="/linkedin" 
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 hover:border-blue-500/30 hover:bg-zinc-950 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-blue-400" />
                  <div>
                    <span className="block text-sm font-semibold text-zinc-200 group-hover:text-blue-400 transition-colors">LinkedIn Enhancer</span>
                    <span className="block text-xs text-zinc-500">Analyze & improve copy</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                href="/coach" 
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 hover:border-cyan-500/30 hover:bg-zinc-950 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  <div>
                    <span className="block text-sm font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors">Mock Practice</span>
                    <span className="block text-xs text-zinc-500">Interactive interview prep</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Learning Roadmap timeline */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-zinc-100 border-b border-zinc-800/50 pb-4">Learning Roadmap</h2>
            
            <div className="relative pl-6 space-y-6 border-l border-zinc-800">
              <div className="relative">
                <span className="absolute -left-[30px] top-1 h-4 w-4 rounded-full bg-theme-btn border-4 border-zinc-950 shadow shadow-theme-accent"></span>
                <span className="block text-sm font-semibold text-zinc-200">CKAD Certification</span>
                <span className="block text-xs text-zinc-500 mt-1">Focus: Container Orchestration & Core Pod structures.</span>
                <a href="https://training.linuxfoundation.org/" target="_blank" className="text-[10px] text-theme-accent hover:underline mt-1 block">Course Syllabus &rarr;</a>
              </div>

              <div className="relative">
                <span className="absolute -left-[30px] top-1 h-4 w-4 rounded-full bg-zinc-800 border-4 border-zinc-950"></span>
                <span className="block text-sm font-semibold text-zinc-200">GraphQL APIs</span>
                <span className="block text-xs text-zinc-500 mt-1">Focus: Master Apollo Server federation, schema declarations.</span>
              </div>

              <div className="relative">
                <span className="absolute -left-[30px] top-1 h-4 w-4 rounded-full bg-zinc-800 border-4 border-zinc-950"></span>
                <span className="block text-sm font-semibold text-zinc-200">Advanced System Design</span>
                <span className="block text-xs text-zinc-500 mt-1">Focus: Rate limiting, consistent hashing, messaging queues.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
