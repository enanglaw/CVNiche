"use client";

import React, { useState } from "react";
import { 
  Linkedin, 
  Sparkles, 
  Search, 
  CheckCircle, 
  TrendingUp, 
  AlertCircle,
  Copy,
  Check
} from "lucide-react";

export default function LinkedInPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!profileUrl) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        seoScore: 84,
        headline: "Senior Backend Engineer | Node.js | Python | AWS | Building Scalable APIs for FinTech",
        about: "Results-oriented Senior Backend Engineer with 5+ years of experience designing and optimizing cloud-native APIs. Expert in Node.js, Python, and PostgreSQL, driving latency reductions and architecture migrations. Passionate about engineering scale, developer productivity, and reliable distributed systems.",
        experiences: [
          {
            title: "Senior Engineer at Acme Corp",
            original: "Led API projects and helped frontend developers.",
            improved: "Spearheaded microservices migration and REST API redesign, serving 50,000+ monthly active users and reducing endpoint latency by 35%. Mentored 4 junior frontend developers on backend integrations."
          }
        ],
        tips: [
          "Incorporate high-search technical keywords (e.g. System Design, REST APIs, Microservices) in your headline.",
          "Write your summary in the first person (I) to build personal connection and brand tone.",
          "Add professional certifications to the licensing section to boost profile search weighting by 15%."
        ]
      });
    }, 1500);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Linkedin className="h-6 w-6 text-blue-500" />
            LinkedIn Profile Optimizer
          </h1>
          <p className="text-sm text-zinc-500">Audit your profile copy, inject SEO keywords, and attract recruiters organically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: URL paste */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Profile Audit</h2>
          
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">LinkedIn Profile URL</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none border-theme-accent-focus text-zinc-300 transition-colors"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !profileUrl}
              className="w-full bg-theme-btn text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-theme-btn"
            >
              {isAnalyzing ? "Analyzing Profile..." : "Analyze Profile"}
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Results */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score dashboard */}
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-blue-500/10 border-4 border-blue-500/20 flex items-center justify-center font-bold text-xl text-blue-400">
                    {result.seoScore}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-100">LinkedIn SEO Readiness</h3>
                    <p className="text-xs text-zinc-500">Recruiter search frequency increased by +22%</p>
                  </div>
                </div>
                
                <div className="flex gap-1 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>High Visibility Tier</span>
                </div>
              </div>

              {/* Headline */}
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Optimized SEO Headline</span>
                  <button 
                    onClick={() => handleCopy(result.headline, "headline")}
                    className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1"
                  >
                    {copiedField === "headline" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedField === "headline" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-sm font-semibold text-zinc-200">{result.headline}</p>
              </div>

              {/* About summary */}
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">SEO Summary (About Section)</span>
                  <button 
                    onClick={() => handleCopy(result.about, "about")}
                    className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1"
                  >
                    {copiedField === "about" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedField === "about" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-light">{result.about}</p>
              </div>

              {/* Experience */}
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-4">
                <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-850 pb-3">Experience Phrasing Audit</span>
                {result.experiences.map((exp: any, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <span className="text-xs font-semibold text-zinc-200 block">{exp.title}</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900 text-xs text-zinc-500">
                        <span className="font-bold text-red-500/70 block mb-1">Before:</span>
                        "{exp.original}"
                      </div>
                      <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900 text-xs text-zinc-300 relative group">
                        <span className="font-bold text-green-400 block mb-1">Optimized:</span>
                        "{exp.improved}"
                        <button 
                          onClick={() => handleCopy(exp.improved, `exp-${idx}`)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-zinc-300"
                        >
                          {copiedField === `exp-${idx}` ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions tips */}
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 space-y-4">
                <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-850 pb-3 flex items-center gap-1.5">
                  <AlertCircle className="h-4.5 w-4.5 text-blue-400" />
                  Visibility Enhancements Tips
                </span>
                <ul className="text-xs text-zinc-400 space-y-2.5">
                  {result.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <CheckCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-64 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-500 text-center gap-2">
              <Linkedin className="h-8 w-8 text-zinc-700" />
              <div>
                <span className="font-semibold text-sm">No analysis performed</span>
                <p className="text-xs text-zinc-650 max-w-xs mt-1">Paste your URL on the left panel to scan and optimize your LinkedIn presence.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
