"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Globe, 
  Linkedin, 
  Trophy, 
  MessageSquare, 
  Search, 
  Bell, 
  User, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Palette,
  CreditCard,
  Shield,
  Settings
} from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

// Configured 3 premium dark color themes
const themeStyles = {
  obsidian: {
    bg: "bg-[#0b0b0f]",
    sidebarBg: "bg-zinc-900/50",
    border: "border-zinc-800",
    borderLighter: "border-zinc-800/60",
    textAccent: "text-violet-400",
    bgAccent: "bg-violet-600/10",
    borderAccent: "border-violet-500/20",
    gradient: "from-violet-600 to-indigo-600",
    buttonBg: "bg-violet-600 hover:bg-violet-500",
    buttonShadow: "shadow-violet-600/20",
    inputFocus: "focus:border-violet-500",
    indicatorDot: "bg-violet-600",
    displayName: "Midnight Obsidian"
  },
  abyss: {
    bg: "bg-[#050a15]",
    sidebarBg: "bg-slate-900/50",
    border: "border-slate-800",
    borderLighter: "border-slate-800/60",
    textAccent: "text-teal-400",
    bgAccent: "bg-teal-600/10",
    borderAccent: "border-teal-500/20",
    gradient: "from-teal-600 to-cyan-600",
    buttonBg: "bg-teal-600 hover:bg-teal-500",
    buttonShadow: "shadow-teal-600/20",
    inputFocus: "focus:border-teal-500",
    indicatorDot: "bg-teal-600",
    displayName: "Oceanic Abyss"
  },
  aurora: {
    bg: "bg-[#040a08]",
    sidebarBg: "bg-stone-900/50",
    border: "border-stone-800",
    borderLighter: "border-stone-800/60",
    textAccent: "text-emerald-400",
    bgAccent: "bg-emerald-600/10",
    borderAccent: "border-emerald-500/20",
    gradient: "from-emerald-600 to-teal-600",
    buttonBg: "bg-emerald-600 hover:bg-emerald-500",
    buttonShadow: "shadow-emerald-600/20",
    inputFocus: "focus:border-emerald-500",
    indicatorDot: "bg-emerald-600",
    displayName: "Emerald Aurora"
  }
};

const themeVars = {
  obsidian: {
    "--accent-color": "#a78bfa",
    "--accent-bg": "rgba(139, 92, 246, 0.1)",
    "--accent-border": "rgba(139, 92, 246, 0.2)",
    "--btn-color": "#7c3aed",
    "--btn-hover": "#6d28d9",
    "--btn-shadow": "rgba(139, 92, 246, 0.2)",
  },
  abyss: {
    "--accent-color": "#2dd4bf",
    "--accent-bg": "rgba(13, 148, 136, 0.1)",
    "--accent-border": "rgba(13, 148, 136, 0.2)",
    "--btn-color": "#0d9488",
    "--btn-hover": "#0f766e",
    "--btn-shadow": "rgba(13, 148, 136, 0.2)",
  },
  aurora: {
    "--accent-color": "#34d399",
    "--accent-bg": "rgba(16, 185, 129, 0.1)",
    "--accent-border": "rgba(16, 185, 129, 0.2)",
    "--btn-color": "#10b981",
    "--btn-hover": "#059669",
    "--btn-shadow": "rgba(16, 185, 129, 0.2)",
  }
};

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<keyof typeof themeStyles>("obsidian");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeJwt(token);
      if (payload && payload.role === "ADMIN") {
        setIsAdmin(true);
      }
    }
  }, []);

  const style = themeStyles[theme];

  const baseNavigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Resumes", href: "/resumes", icon: FileText },
    { name: "Portfolio Website", href: "/portfolios", icon: Globe },
    { name: "LinkedIn Optimizer", href: "/linkedin", icon: Linkedin },
    { name: "Job Tracker", href: "/tracker", icon: Trophy },
    { name: "AI Career Coach", href: "/coach", icon: MessageSquare },
    { name: "Pricing & Plans", href: "/pricing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const navigation = isAdmin 
    ? [...baseNavigation, { name: "Admin Console", href: "/cvniche/admin", icon: Shield }]
    : baseNavigation;

  return (
    <div 
      className={`flex h-screen ${style.bg} text-zinc-100 font-sans overflow-hidden transition-colors duration-300`}
      style={themeVars[theme] as React.CSSProperties}
    >
      {/* Sidebar */}
      <aside className={`w-64 border-r ${style.border} ${style.sidebarBg} backdrop-blur-xl flex flex-col justify-between shrink-0 transition-colors duration-300`}>
        <div>
          {/* Logo */}
          <div className={`h-16 px-6 flex items-center gap-2 border-b ${style.border}`}>
            <img 
              src="/logo.png" 
              alt="CVNiche Logo" 
              className={`h-9 w-9 rounded-xl object-cover shadow-lg border ${style.border}`} 
            />
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">CVNiche</span>
              <span className={`text-[10px] block ${style.textAccent} font-semibold tracking-wider uppercase transition-colors`}>AI Career Platform</span>
            </div>
          </div>

          {/* Search bar */}
          <div className={`p-4 border-b ${style.borderLighter}`}>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search resumes, jobs..."
                className={`w-full bg-zinc-950 border ${style.border} rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none ${style.inputFocus} text-zinc-300 transition-all`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? `${style.bgAccent} ${style.borderAccent} ${style.textAccent} shadow-sm`
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? style.textAccent : "text-zinc-400"} transition-colors`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className={`h-3.5 w-3.5 ${style.textAccent} transition-colors`} />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile section in sidebar footer */}
        <div className={`p-4 border-t ${style.border} bg-zinc-950/20`}>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg bg-zinc-800 border ${style.border} flex items-center justify-center`}>
              <User className="h-5 w-5 text-zinc-300" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-semibold truncate text-zinc-200">John Doe</span>
              <span className="block text-xs text-zinc-500 truncate">johndoe@gmail.com</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${style.bgAccent} ${style.textAccent} border ${style.borderAccent} shadow-md transition-all`}>
              PRO
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className={`h-16 border-b ${style.borderLighter} bg-zinc-900/10 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-30`}>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 bg-zinc-800/40 border ${style.borderLighter} px-3 py-1 rounded-full text-xs font-semibold text-zinc-400 shadow-inner`}>
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span>Interview Likelihood:</span>
              <span className="text-green-400 font-bold">89%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className={`h-9 w-9 rounded-lg border ${style.border} bg-zinc-900/50 flex items-center justify-center hover:bg-zinc-800 transition-all`}
                title="Switch Color Theme"
              >
                <Palette className="h-4.5 w-4.5 text-zinc-400" />
              </button>

              {showThemeDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowThemeDropdown(false)}></div>
                  <div className={`absolute right-0 mt-2 w-56 rounded-xl border ${style.border} bg-zinc-900 p-2 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-150`}>
                    <span className="block px-3 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Select Color Theme</span>
                    <div className="space-y-1 mt-1">
                      {(Object.keys(themeStyles) as Array<keyof typeof themeStyles>).map((tKey) => {
                        const isCurrentTheme = theme === tKey;
                        const tStyle = themeStyles[tKey];
                        return (
                          <button
                            key={tKey}
                            onClick={() => {
                              setTheme(tKey);
                              setShowThemeDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                              isCurrentTheme 
                                ? `${tStyle.bgAccent} ${tStyle.textAccent}` 
                                : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${tStyle.gradient}`}></span>
                              <span>{tStyle.displayName}</span>
                            </div>
                            {isCurrentTheme && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <button className={`h-9 w-9 rounded-lg border ${style.border} bg-zinc-900/50 flex items-center justify-center hover:bg-zinc-800 transition-colors relative`}>
              <Bell className="h-4.5 w-4.5 text-zinc-400" />
              <span className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full ${style.indicatorDot} shadow`}></span>
            </button>
            
            {/* Action Button */}
            <Link 
              href="/resumes" 
              className={`${style.buttonBg} text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 shadow-lg ${style.buttonShadow}`}
            >
              <Sparkles className="h-4 w-4" />
              Build Resume
            </Link>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
