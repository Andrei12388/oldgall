import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <img
            src="/logo.png"
            alt="Oldies Gallery logo"
            className={cn('h-10 w-auto object-contain', className)}
            style={{ color: uniColor ? 'currentColor' : undefined }}
        />
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <img
            src="/logo.png"
            alt="Oldies Gallery icon"
            className={cn('h-8 w-8 object-contain', className)}
            style={{ color: uniColor ? 'currentColor' : undefined }}
        />
    )
}
