"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

type Theme = {
  name: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
};

const themes: Theme[] = [
  {
    name: "Ghibli Light",
    value: "ghibli",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7z"/>
        <path d="M12 22V12l-8-5"/>
      </svg>
    ),
    gradient: "from-emerald-400 to-sky-500",
    description: "Nature-inspired calm"
  },
  {
    name: "Ghibli Dark",
    value: "ghibli-dark",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7z"/>
        <path d="M12 22V12l-8-5"/>
      </svg>
    ),
    gradient: "from-emerald-600 to-sky-700",
    description: "Dark nature theme"
  },
  {
    name: "YouTube Light",
    value: "youtube",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z"/>
      </svg>
    ),
    gradient: "from-red-500 to-red-600",
    description: "Creator focused"
  },
  {
    name: "YouTube Dark",
    value: "youtube-dark",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z"/>
      </svg>
    ),
    gradient: "from-red-600 to-red-800",
    description: "Dark creator theme"
  },
  {
    name: "Professional Light",
    value: "professional",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    gradient: "from-blue-600 to-indigo-700",
    description: "Clean & minimal"
  },
  {
    name: "Professional Dark",
    value: "professional-dark",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    gradient: "from-blue-800 to-indigo-900",
    description: "Dark professional"
  }
];

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10"></div>;
  }

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowThemes(!showThemes)}
        className="rounded-full w-10 h-10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)] border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300"
        aria-label="Toggle theme"
      >
        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${currentTheme.gradient} flex items-center justify-center`}>
          <div className="text-white text-xs font-bold">
            {currentTheme.icon}
          </div>
        </div>
      </Button>

      {showThemes && (
        <Card className="absolute bottom-12 right-0 w-72 z-50 animate-in slide-in-from-bottom-2 duration-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3 text-foreground">Choose Theme</h3>
            <div className="grid grid-cols-1 gap-2">
              {themes.map((themeOption) => (
                <Button
                  key={themeOption.value}
                  variant={theme === themeOption.value ? "default" : "ghost"}
                  className="justify-start h-auto p-3 w-full"
                  onClick={() => {
                    setTheme(themeOption.value);
                    setShowThemes(false);
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${themeOption.gradient} flex items-center justify-center`}>
                      <div className="text-white text-xs">
                        {themeOption.icon}
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{themeOption.name}</div>
                      <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                    </div>
                    {theme === themeOption.value && (
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                </Button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Each theme includes light and dark variants
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Legacy simple toggle for backward compatibility
export function SimpleThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10"></div>;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-10 h-10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)] border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-500 dark:text-transparent rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0"
      >
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute text-transparent dark:text-sky-300 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        <path d="M19 3v4"></path>
        <path d="M21 5h-4"></path>
      </svg>
    </Button>
  );
}
