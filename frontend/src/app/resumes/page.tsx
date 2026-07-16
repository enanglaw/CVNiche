"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Sparkles, 
  Trash2, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Loader2
} from "lucide-react";

const RESUME_TEMPLATES = [
  {
    id: "classic",
    name: "Classic ATS-Optimized",
    description: "A traditional, highly readable format preferred by corporate, finance, and logistics employers.",
    role: "Financial Analyst",
    content: {
      name: "Alex Sterling",
      email: "alex.sterling@example.com",
      phone: "+1 (555) 019-2834",
      location: "New York, NY",
      website: "linkedin.com/in/alex-sterling",
      summary: "Results-driven Financial Analyst with 4+ years of experience in forecasting, corporate budgeting, and data analysis. Proven record of optimizing department expenditure and driving operational efficiency.",
      experiences: [
        {
          position: "Senior Financial Analyst",
          company: "Apex Investment Partners",
          location: "New York, NY",
          startDate: "2023-03",
          endDate: "",
          description: "Led annual budgeting processes for a $50M portfolio. Developed forecasting models with 98% accuracy and identified $1.2M in annual operational savings."
        },
        {
          position: "Junior Financial Analyst",
          company: "Beacon Capital Corp",
          location: "Boston, MA",
          startDate: "2021-06",
          endDate: "2023-02",
          description: "Conducted market research and industry trends analysis. Automated reporting dashboards using Excel VBA, reducing weekly generation time by 10 hours."
        }
      ],
      education: [
        {
          institution: "New York University",
          degree: "Bachelor of Science",
          fieldOfStudy: "Finance & Economics",
          startDate: "2017-09",
          endDate: "2021-05",
          location: "New York, NY",
          gpa: "3.8"
        }
      ],
      skills: ["Financial Modeling", "Corporate Budgeting", "SQL", "Excel VBA", "Market Research", "Risk Management"]
    }
  },
  {
    id: "modern_dev",
    name: "Modern Tech Developer",
    description: "A clean, modern format with developer-centric layout, highlighting technical skills and projects.",
    role: "Software Engineer",
    content: {
      name: "Jordan Mercer",
      email: "jordan.mercer@devmail.io",
      phone: "+1 (555) 438-9921",
      location: "San Francisco, CA",
      website: "github.com/jmercer",
      summary: "Full Stack Engineer specializing in TypeScript, React, and Node.js. Passionate about building performant web applications, designing RESTful APIs, and implementing automated CI/CD pipelines.",
      experiences: [
        {
          position: "Full Stack Developer",
          company: "CloudScale Systems",
          location: "San Francisco, CA",
          startDate: "2022-08",
          endDate: "",
          description: "Architected microservices handling 10k+ concurrent requests. Optimized database queries reducing load times by 40% and containerized applications with Docker."
        },
        {
          position: "Software Engineer Intern",
          company: "ByteForge Co.",
          location: "Remote",
          startDate: "2021-05",
          endDate: "2022-07",
          description: "Developed UI components using React and Tailwind CSS. Implemented unit and integration tests using Jest and Cypress, raising coverage by 15%."
        }
      ],
      education: [
        {
          institution: "Cross River University of Technology, Calabar",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startDate: "2005-09",
          endDate: "2010-05",
          location: "Calabar, Cross River",
          gpa: "2.52"
        }
      ],
      skills: ["TypeScript", "React", "Next.js", "Node.js", "Docker", "AWS", "CI/CD", "PostgreSQL", "GraphQL"]
    }
  },
  {
    id: "executive",
    name: "Executive & Leadership",
    description: "A sophisticated format highlighting leadership metrics, management milestones, and strategy.",
    role: "Senior Product Manager",
    content: {
      name: "Taylor Vance",
      email: "taylor.vance@leadgroup.com",
      phone: "+1 (555) 782-9011",
      location: "Seattle, WA",
      website: "linkedin.com/in/taylor-vance",
      summary: "Strategic Product Leader with 8+ years of experience directing cross-functional squads to ship high-impact B2B SaaS products. Adept at roadmap optimization, market validation, and mentoring high-performing teams.",
      experiences: [
        {
          position: "Lead Product Manager",
          company: "Nexus Enterprises",
          location: "Seattle, WA",
          startDate: "2023-01",
          endDate: "",
          description: "Defined product strategy for flagship SaaS platform, driving $8M in ARR growth. Collaborated with UX and Engineering to ship 4 major features ahead of schedule."
        },
        {
          position: "Product Manager",
          company: "SaaSify Inc.",
          location: "Bellevue, WA",
          startDate: "2020-03",
          endDate: "2022-12",
          description: "Owned the onboarding flow optimization, increasing user sign-up conversion by 28%. Conducted over 50 customer interviews to redefine the roadmap priorities."
        }
      ],
      education: [
        {
          institution: "University of Washington",
          degree: "Master of Business Administration",
          fieldOfStudy: "Technology Management",
          startDate: "2018-09",
          endDate: "2020-03",
          location: "Seattle, WA",
          gpa: "3.85"
        }
      ],
      skills: ["Product Strategy", "SaaS Management", "Roadmapping", "Agile Methodologies", "Stakeholder Communication", "A/B Testing"]
    }
  },
  {
    id: "creative",
    name: "Creative & Marketing",
    description: "A vibrant format showcasing design aesthetics, digital marketing results, and visual communication.",
    role: "UI/UX Designer",
    content: {
      name: "Morgan Lee",
      email: "morgan.lee@pixels.net",
      phone: "+1 (555) 234-5678",
      location: "Austin, TX",
      website: "morganlee.design",
      summary: "Creative UI/UX Designer dedicated to crafting intuitive, visually stunning digital experiences. Specialized in user research, wireframing, high-fidelity design, and design system creation.",
      experiences: [
        {
          position: "Product Designer",
          company: "CreativeFlow Agency",
          location: "Austin, TX",
          startDate: "2022-10",
          endDate: "",
          description: "Redesigned mobile app for a major retail client, resulting in a 42% increase in mobile checkout completions. Maintained and expanded client design systems."
        },
        {
          position: "Junior UX Designer",
          company: "Studio Bloom",
          location: "Austin, TX",
          startDate: "2021-01",
          endDate: "2022-09",
          description: "Created wireframes, interactive prototypes, and user flows. Assisted in running usability testing sessions with 20+ participants to identify UI bottlenecks."
        }
      ],
      education: [
        {
          institution: "Texas A&M University",
          degree: "Bachelor of Fine Arts",
          fieldOfStudy: "Graphic Design",
          startDate: "2017-09",
          endDate: "2020-12",
          location: "College Station, TX",
          gpa: "3.75"
        }
      ],
      skills: ["UI/UX Design", "Figma", "Design Systems", "Prototyping", "User Research", "Wireframing", "Adobe Creative Suite"]
    }
  }
];

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [activeResume, setActiveResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New state variables for build resume modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<"template" | "clone">("template");
  const [selectedTemplateId, setSelectedTemplateId] = useState("classic");
  const [selectedSourceResumeId, setSelectedSourceResumeId] = useState("");
  const [newResumeTitle, setNewResumeTitle] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/resume", {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to load resumes");
      const data = await res.json();
      setResumes(data);
      if (data.length > 0) {
        setActiveResume(data[0].id);
      }
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    if (resumes.length > 0 && !selectedSourceResumeId) {
      setSelectedSourceResumeId(resumes[0].id);
    }
  }, [resumes]);

  const handleCreateResume = () => {
    setIsCreateModalOpen(true);
    setNewResumeTitle("Classic ATS-Optimized Resume");
    setSelectedTemplateId("classic");
    setTargetJobTitle("Financial Analyst");
    setCreationMode("template");
    if (resumes.length > 0) {
      setSelectedSourceResumeId(resumes[0].id);
    }
  };

  const handleSubmitCreateResume = async () => {
    if (!newResumeTitle.trim()) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      let payload: any = {
        title: newResumeTitle,
        targetJobTitle: targetJobTitle || "Software Engineer"
      };

      if (creationMode === "template") {
        const tmpl = RESUME_TEMPLATES.find(t => t.id === selectedTemplateId);
        payload.templateId = selectedTemplateId;
        payload.content = tmpl ? tmpl.content : { experience: [], education: [], skills: [] };
      } else {
        payload.sourceResumeId = selectedSourceResumeId;
      }

      const res = await fetch("http://localhost:5001/api/resume", {
        method: "POST",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 403) {
        const confirmUpgrade = confirm("You have reached the limit of 1 resume for the FREE plan. Would you like to upgrade to CVNiche Pro for just $3.99/mo to build unlimited resumes?");
        if (confirmUpgrade) {
          window.location.href = "/cvniche/pricing";
        }
        return;
      }

      if (!res.ok) throw new Error("Failed to create resume");
      
      const newResume = await res.json();
      setResumes((prev) => [newResume, ...prev]);
      setActiveResume(newResume.id);
      setIsCreateModalOpen(false);
      alert("Resume created successfully!");
    } catch (err: any) {
      alert(err.message || "Could not create resume");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/resume/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });

      if (!res.ok) throw new Error("Failed to delete resume");

      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (activeResume === id) {
        setActiveResume("");
      }
      alert("Resume deleted successfully!");
    } catch (err: any) {
      alert(err.message || "Could not delete resume");
    }
  };

  const handleDownloadResume = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/resume/${id}/export?format=html`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });

      if (res.status === 403) {
        const confirmUpgrade = confirm("You have reached the limit of 1 download per month for the FREE plan. Would you like to upgrade to CVNiche Pro for just $3.99/mo to download unlimited resumes?");
        if (confirmUpgrade) {
          window.location.href = "/cvniche/pricing";
        }
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to export resume");
      }

      const html = await res.text();
      
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Could not download resume");
    }
  };

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
        <button 
          onClick={handleCreateResume}
          className="bg-theme-btn text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-theme-btn cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          Create New Resume
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Resumes list */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Your Resumes</h2>
          
          {loading ? (
            <div className="flex items-center gap-2 py-4 text-xs text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin text-theme-accent" />
              Loading your resumes...
            </div>
          ) : resumes.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 border border-zinc-850 rounded-xl bg-zinc-900/10 text-xs">
              No resumes found. Click "Create New Resume" to start!
            </div>
          ) : (
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400`}>
                      85% ATS
                    </span>
                  </div>
                  <span className="block text-xs text-zinc-500 mb-3">{resume.targetJobTitle || "General Role"}</span>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleDownloadResume(resume.id, resume.title, e)}
                        className="hover:text-zinc-300 p-0.5 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteResume(resume.id, e)} 
                        className="hover:text-red-400 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-theme-accent" />
                Build New Resume
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Selector Tabs: Select Template vs Clone Existing */}
              <div className="flex gap-4 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setCreationMode("template")}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    creationMode === "template"
                      ? "bg-theme-btn text-white shadow-lg"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                  }`}
                >
                  Select from Template
                </button>
                <button
                  type="button"
                  onClick={() => setCreationMode("clone")}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    creationMode === "clone"
                      ? "bg-theme-btn text-white shadow-lg"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                  }`}
                >
                  Clone Existing Resume
                </button>
              </div>

              {/* Title & Target Job Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Resume Title</label>
                  <input
                    type="text"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    placeholder="e.g. My Software Engineer Resume"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-theme-accent text-zinc-300 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Target Job Title</label>
                  <input
                    type="text"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-theme-accent text-zinc-300 transition-colors"
                  />
                </div>
              </div>

              {/* Template Selection Grid */}
              {creationMode === "template" && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Choose a Template Style</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {RESUME_TEMPLATES.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          setSelectedTemplateId(tmpl.id);
                          setTargetJobTitle(tmpl.role);
                          if (!newResumeTitle || newResumeTitle.includes("Resume") || newResumeTitle.includes("Template")) {
                            setNewResumeTitle(`${tmpl.name} Resume`);
                          }
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-left ${
                          selectedTemplateId === tmpl.id
                            ? "bg-theme-accent-bg border-theme-accent-border"
                            : "bg-zinc-950/40 border-zinc-850 hover:border-zinc-800"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className={`text-sm font-bold ${selectedTemplateId === tmpl.id ? "text-theme-accent" : "text-zinc-200"}`}>
                              {tmpl.name}
                            </span>
                            {selectedTemplateId === tmpl.id && (
                              <CheckCircle className="h-4 w-4 text-theme-accent animate-in zoom-in duration-200" />
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 mb-3">
                            {tmpl.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center border-t border-zinc-900/60 pt-2.5 mt-2">
                          <span className="text-[10px] text-zinc-655 font-medium">Default Role: {tmpl.role}</span>
                          <span className="text-[10px] text-zinc-655 font-medium px-2 py-0.5 rounded bg-zinc-900 uppercase">
                            {tmpl.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clone Existing Selection */}
              {creationMode === "clone" && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Resume to Clone</label>
                  {resumes.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-500 border border-zinc-850 border-dashed rounded-xl bg-zinc-950/20">
                      You don't have any existing resumes to clone. Please select a template instead.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select
                        value={selectedSourceResumeId}
                        onChange={(e) => {
                          setSelectedSourceResumeId(e.target.value);
                          const source = resumes.find(r => r.id === e.target.value);
                          if (source) {
                            setNewResumeTitle(`Copy of ${source.title}`);
                            setTargetJobTitle(source.targetJobTitle || "");
                          }
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-theme-accent text-zinc-300 transition-colors"
                      >
                        {resumes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title} ({r.targetJobTitle || "General Role"})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-zinc-500">
                        Cloning will duplicate all work history, education, skills, and formatting from your selected resume.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-900/30">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitCreateResume}
                disabled={isSubmitting || !newResumeTitle.trim() || (creationMode === "clone" && resumes.length === 0)}
                className="bg-theme-btn disabled:bg-zinc-800 disabled:text-zinc-655 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-theme-btn text-white cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Create Resume
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
