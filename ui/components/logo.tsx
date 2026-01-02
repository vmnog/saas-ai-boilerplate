import { cn } from '@/lib/cn'
import { Sparkles } from 'lucide-react'

interface LogoProps {
  variant?: 'full' | 'icon'
  className?: string
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'icon') {
    return <Sparkles className={cn('h-5 w-5', className)} />
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Sparkles className="h-6 w-6" />
      <span className="font-bold text-xl">acme</span>
    </div>
  )
}
