import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-foreground/[0.04] px-2.5 py-1 font-mono text-[11px] leading-none text-muted",
        className,
      )}
      {...props}
    />
  );
}
