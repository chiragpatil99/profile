import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[background,box-shadow,transform,color] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none min-h-11 px-5",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-background hover:shadow-[0_0_32px_-4px_var(--violet)]",
        glass: "glass text-foreground hover:bg-foreground/10",
        ghost: "text-muted hover:text-foreground hover:bg-foreground/5",
      },
      size: {
        md: "",
        sm: "min-h-9 px-3.5 text-[13px]",
        icon: "min-h-11 w-11 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
