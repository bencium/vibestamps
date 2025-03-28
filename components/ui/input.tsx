import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-sky-500/40 dark:placeholder:text-sky-400/30 selection:bg-emerald-200/30 dark:selection:bg-emerald-800/30 selection:text-emerald-800 dark:selection:text-emerald-100 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-700/80 flex h-10 w-full min-w-0 rounded-2xl border bg-white/80 backdrop-blur-sm px-4 py-2 text-base shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all duration-200 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-sky-300 dark:focus-visible:border-sky-600 focus-visible:ring-sky-200/50 dark:focus-visible:ring-sky-800/30 focus-visible:ring-[3px] focus-visible:shadow-[0_4px_15px_rgba(14,165,233,0.15)]",
        "aria-invalid:ring-rose-200/30 dark:aria-invalid:ring-rose-800/30 aria-invalid:border-rose-400 dark:aria-invalid:border-rose-700",
        className
      )}
      {...props}
    />
  );
}

export { Input };
