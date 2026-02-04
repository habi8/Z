import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Z - Global Workspace Platform',
    description: 'Build, collaborate, and scale your content globally with Z - the workspace platform with built-in translation and localization.',
    generator: 'v0.app',
    icons: {
        icon: '/z-logo.png',
        apple: '/z-logo.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children;
}
