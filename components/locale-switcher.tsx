import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const locales = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
];

export function LocaleSwitcher() {
    const [mounted, setMounted] = useState(false);
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <Button variant="ghost" size="sm" className="gap-2 opacity-0">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">English</span>
        </Button>
    );

    const switchLocale = (newLocale: string) => {
        // Remove current locale from pathname if it exists
const pathnameWithoutLocale = pathname.replace(/^\/(en|es|fr)/, '');

        // Always use explicit locale prefix to avoid routing issues
        const newPath = `/${newLocale}${pathnameWithoutLocale || '/'}`;

        router.push(newPath);
    };

    const currentLocaleName = locales.find(l => l.code === locale)?.name || 'English';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2" suppressHydrationWarning>
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentLocaleName}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {locales.map((loc) => (
                    <DropdownMenuItem
                        key={loc.code}
                        onClick={() => switchLocale(loc.code)}
                        className={locale === loc.code ? 'bg-accent' : ''}
                    >
                        {loc.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
