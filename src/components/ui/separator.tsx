import * as React from "react"
import { Separator as RadixSeparator } from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixSeparator> {}

const Separator = React.forwardRef<React.ElementRef<typeof RadixSeparator>, SeparatorProps>(
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