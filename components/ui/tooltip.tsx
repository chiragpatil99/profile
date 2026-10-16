"use client";

import * as Tooltip from "@radix-ui/react-tooltip";

export function Tip({
  content,
  children,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={8}
          className="glass z-[80] max-w-[240px] rounded-lg px-3 py-2 text-xs leading-relaxed text-foreground shadow-xl"
        >
          {content}
          <Tooltip.Arrow className="fill-border" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
