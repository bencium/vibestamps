import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-slate-200/80 dark:border-slate-700/80 placeholder:text-sky-500/40 dark:placeholder:text-sky-400/30 selection:bg-emerald-200/30 dark:selection:bg-emerald-800/30 selection:text-emerald-800 dark:selection:text-emerald-100 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm flex field-sizing-content min-h-24 w-full rounded-2xl border px-4 py-3 text-base shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all duration-200 outline-none focus-visible:border-sky-300 dark:focus-visible:border-sky-600 focus-visible:ring-sky-200/50 dark:focus-visible:ring-sky-800/30 focus-visible:ring-[3px] focus-visible:shadow-[0_4px_15px_rgba(14,165,233,0.15)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none aria-invalid:ring-rose-200/30 dark:aria-invalid:ring-rose-800/30 aria-invalid:border-rose-400 dark:aria-invalid:border-rose-700",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
