import * as React from "react"
import { Separator as RadixSeparator } from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

const Separator = React.forwardRef<React.ElementRef<typeof RadixSeparator>, React.ComponentPropsWithoutRef<typeof RadixSeparator>>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <RadixSeparator
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

export { Separator } 