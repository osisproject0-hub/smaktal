import * as React from 'react'

import { cn } from '@/lib/utils'

export interface AnimatedProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tailwind animation class name, default to animate-fade-in (defined in tailwind.config) */
  animation?: string
  /** optional delay class (e.g. 'delay-100') */
  delay?: string
}

export const Animated = React.forwardRef<HTMLDivElement, AnimatedProps>(
  ({ className, animation = 'animate-fade-in', delay = '', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        `will-change-transform ${animation} ${delay} motion-safe:transition-all motion-safe:duration-300`,
        className
      )}
      {...props}
    />
  )
)

Animated.displayName = 'Animated'

export default Animated
