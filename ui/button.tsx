import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-luxury-gold-400 text-white hover:bg-luxury-gold-500 hover:shadow-[0_10px_40px_rgba(201,162,39,0.4)] hover:-translate-y-0.5",
        destructive: "bg-red-500/90 text-white hover:bg-red-600",
        outline: "border-2 border-luxury-gold-400 text-luxury-gold-400 hover:bg-luxury-gold-400/10",
        secondary: "bg-luxury-black-800 text-white hover:bg-luxury-black-700",
        ghost: "hover:bg-luxury-gold-400/10 hover:text-luxury-gold-400",
        link: "text-luxury-gold-400 underline-offset-4 hover:underline",
        luxury: "bg-gradient-to-r from-luxury-gold-400 via-luxury-gold-300 to-luxury-gold-400 text-white hover:shadow-[0_15px_50px_rgba(201,162,39,0.5)] hover:-translate-y-1 hover:scale-105",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }