import { cn } from "@/lib/utils"

function Skeleton({
  className,
  shimmer = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { shimmer?: boolean }) {
  return (
    <div
      style={shimmer ? { backgroundSize: '200% 100%' } : undefined}
      className={cn(
        shimmer ? 'rounded-md bg-gradient-to-r from-muted/70 via-muted/50 to-muted/70 animate-shimmer' : 'animate-pulse rounded-md bg-muted/80',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
