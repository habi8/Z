'use client'

import { useEffect, useState } from 'react'

export function AnimatedBackground() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-background">
            {/* Base Gradient */}
            {/* Base Gradient - preserve the cream background but add depth */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px]" />

            {/* Animated Blobs - Grey/Zinc tones concentrated on sides with higher opacity (0.7) */}
            <div
                className="absolute top-0 left-[-20%] w-[50%] h-[70%] rounded-full bg-gradient-to-br from-zinc-400/70 to-gray-400/70 dark:from-zinc-800/60 dark:to-gray-800/60 blur-[120px] animate-blob"
            />
            <div
                className="absolute top-[20%] right-[-20%] w-[50%] h-[80%] rounded-full bg-gradient-to-br from-gray-400/70 to-zinc-400/70 dark:from-gray-800/60 dark:to-zinc-800/60 blur-[130px] animate-blob animation-delay-2000"
            />
            <div
                className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-gradient-to-br from-slate-400/70 to-zinc-400/70 dark:from-slate-800/60 dark:to-zinc-800/60 blur-[120px] animate-blob animation-delay-4000"
            />

            {/* Grid Pattern Overlay for Texture */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        </div>
    )
}
