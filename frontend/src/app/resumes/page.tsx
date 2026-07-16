"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  Trash2, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Layers, 
  ChevronRight,
  TrendingUp
} from "lucide-react";

export default function ResumesPage() {
  const [resumes, setResumes] = useState([
    { id: "1", title: "Full Stack Engineer Resume", targetJob: "Senior Node.js Developer", score: 88, updatedAt: "Yesterday" },
    { id: "2", title: "General Technical Resume", targetJob: "General Tech Roles", score: 75, updatedAt: "4 days ago" },
    { id: "3", title: "Staff Architect Tailored (Stripe)", targetJob: "Senior Backend Engineer at Stripe", score: 94, updatedAt: "2 hours ago" },
  ]);

  const [activeResume, setActiveResume] = useState("1");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = () => {
    if (!jobDescription) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        score: 92,
        matchPercent: 94,
        missingKeywords: ["CI/CD Pipelines", "Docker Containers", "Apollo GraphQL", "System Scalability"],
        weakSections: [
          "Work History: Bullet points at Previous Tech Inc lack specific metrics. Consider adding percentages and statistics."
        ],
        improvements: [
          {
            original: "Built APIs for the client dashboard and helped developers.",
            improved: "Engineered scalable REST APIs serving over 50,000 monthly users, reducing latency by 35% and increasing team velocity."
          }
        ]
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <FileText className="h-6 w-6 text-theme-accent" />
            Resume Builder & ATS Optimizer
          </h1>
          <p className="text-sm text-zinc-500">Create, optimize, and customize tailored resumes for every application.</p>
        </div>
        <button className="bg-theme-btn text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-theme-btn">
          <Sparkles className="h-4 w-4" />
          Create New Resume
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Resumes list */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Your Resumes</h2>
          
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div 
                key={resume.id}
                onClick={() => setActiveResume(resume.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeResume === resume.id 
                    ? "bg-theme-accent-bg border-theme-accent-border text-zinc-100" 
                    : "bg-zinc-900/30 border-zinc-850 text-zinc-400 hover:border-zinc-800"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm line-clamp-1">{resume.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    resume.score >= 90 ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"
                  }`}>
                    {resume.score}% ATS
                  </span>
                </div>
                <span className="block text-xs text-zinc-500 mb-3">{resume.targetJob}</span>
                <div className="flex justify-between items-center text-[10px] text-zinc-500">
                  <span>Updated {resume.updatedAt}</span>
                  <div className="flex gap-2">
                    <button className="hover:text-zinc-300 p-0.5"><Download className="h-3.5 w-3.5" /></button>
                    <button className="hover:text-red-400 p-0.5"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side 2 Cols: ATS Scan and Editor panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-6">
            <h2 className="text-base font-bold text-zinc-200">ATS Match & Tailoring Panel</h2>
            <p className="text-xs text-zinc-500">
              Paste the target job description below. Gemini will analyze keywords, evaluate formatting, and generate tailored, high-performance bullet points.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Job Description</label>
              <textarea 
                rows={6}
                placeholder="Paste the raw job posting text or description here..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none border-theme-accent-focus text-zinc-300 transition-colors placeholder:text-zinc-600"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription}
                className="bg-theme-btn disabled:bg-zinc-800 disabled:text-zinc-655 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-theme-btn text-white"
              >
                {isAnalyzing ? "AI Optimizing..." : "Analyze ATS & Tailor Resume"}
                <Sparkles className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between border-b border-zinc-855 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <TrendingUp className="h-5.5 w-5.5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-100">Tailored Match Score: {analysisResult.matchPercent}%</h3>
                    <p className="text-xs text-zinc-500">Resume score jumped from 88% to 92%!</p>
                  </div>
                </div>
                <button className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  Save as Copy
                </button>
              </div>

              {/* Missing keywords */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-orange-400" />
                  Missing Keywords (Auto-Injected)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingKeywords.map((kw: string) => (
                    <span key={kw} className="px-2.5 py-1 rounded-full text-xs bg-orange-500/10 border border-orange-500/20 text-orange-400">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phrasing improvements */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  AI Suggested Experience Enhancements
                </h4>
                <div className="space-y-4">
                  {analysisResult.improvements.map((imp: any, idx: number) => (
                    <div key={idx} className="bg-zinc-950/50 border border-zinc-850 rounded-xl p-4 space-y-3">
                      <div className="text-xs">
                        <span className="font-bold text-red-400 uppercase tracking-wider block mb-1">Original Phrasing:</span>
                        <p className="text-zinc-500 italic">"{imp.original}"</p>
                      </div>
                      <div className="text-xs border-t border-zinc-900 pt-2.5">
                        <span className="font-bold text-green-400 uppercase tracking-wider block mb-1">Improved (ATS & Interview-Optimized):</span>
                        <p className="text-zinc-200">"{imp.improved}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak sections */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Formatting & Phrasing Tips</h4>
                <ul className="text-xs text-zinc-400 list-disc pl-5 space-y-1">
                  {analysisResult.weakSections.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
