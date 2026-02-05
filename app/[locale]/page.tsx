'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe2, Languages, Zap, Shield, Users, Workflow } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();

  const features = [
    {
      icon: Languages,
      title: t('features.lingo_ready.title'),
      description: t('features.lingo_ready.description'),
    },
    {
      icon: Globe2,
      title: t('features.multi_language.title'),
      description: t('features.multi_language.description'),
    },
    {
      icon: Zap,
      title: t('features.real_time.title'),
      description: t('features.real_time.description'),
    },
    {
      icon: Workflow,
      title: t('features.rich_editor.title'),
      description: t('features.rich_editor.description'),
    },
    {
      icon: Users,
      title: t('features.team_workspaces.title'),
      description: t('features.team_workspaces.description'),
    },
    {
      icon: Shield,
      title: t('features.secure.title'),
      description: t('features.secure.description'),
    },
  ];

  const steps = [
    {
      step: t('how_it_works.step1.number'),
      title: t('how_it_works.step1.title'),
      description: t('how_it_works.step1.description'),
    },
    {
      step: t('how_it_works.step2.number'),
      title: t('how_it_works.step2.title'),
      description: t('how_it_works.step2.description'),
    },
    {
      step: t('how_it_works.step3.number'),
      title: t('how_it_works.step3.title'),
      description: t('how_it_works.step3.description'),
    },
  ];

  return (
    <div className="min-h-screen relative selection:bg-primary/10">
      <AnimatedBackground />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/z-logo.png"
              alt={t('header.logo_alt')}
              width={70}
              height={70}
              className="object-contain"
            />
            <span className="text-2xl font-bold">{t('header.workspace')}</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('header.features')}
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('header.how_it_works')}
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('header.pricing')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Button asChild variant="ghost">
              <Link href={`/${locale}/auth/login`}>{t('header.sign_in')}</Link>
            </Button>
            <Button asChild>
              <Link href={`/${locale}/auth/sign-up`}>{t('header.get_started')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-32 md:pt-20 md:pb-40">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 text-xs sm:text-base font-semibold tracking-[0.15em] text-muted-foreground/70 items-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-muted-foreground/60 uppercase animate-fade-in-up opacity-0 fill-mode-forwards">
              <span>{t('hero.powered_by')}</span>
              <Link
                href="https://lingo.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              />
              <Image
                src="/lingo.dev-logo.png"
                alt="Lingo.dev"
                width={110}
                height={28}
                className="
                    opacity-90
                    grayscale 
                    cursor-pointer
                    hover:grayscale-0
                    hover:scale-105
                    transition-all
                    duration-300
                    ease-out
                    "/>
            </div>
            <div className="inline-block px-4 py-2 rounded-full bg-muted border border-border text-xs sm:text-sm font-medium animate-fade-in-up delay-150 opacity-0 fill-mode-forwards">
              {t('hero.badge')}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance animate-fade-in-up delay-200 opacity-0 fill-mode-forwards">
            {t('hero.title_line1')}
            <br />
            <span className="text-muted-foreground">{t('hero.title_line2')}</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance animate-fade-in-up delay-400 opacity-0 fill-mode-forwards">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up delay-600 opacity-0 fill-mode-forwards">
            <Button asChild size="lg" className="text-lg px-8 h-12">
              <Link href={`/${locale}/auth/sign-up`}>{t('hero.cta_primary')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 h-12 bg-transparent"
            >
              <Link href="#how-it-works">{t('hero.cta_secondary')}</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            {t('hero.no_credit_card')}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.heading')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subheading')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="container mx-auto px-4 py-16 bg-muted/30"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('how_it_works.heading')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('how_it_works.subheading')}
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-lg text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8 p-10 rounded-2xl border border-border bg-card shadow-xl">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">
            {t('cta.heading')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('cta.subheading')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-600 opacity-0 fill-mode-forwards">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href={`/${locale}/auth/sign-up`}>{t('cta.button')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/z-logo.png"
                alt={t('footer.logo_alt')}
                width={48}
                height={48}
                className="object-contain"
              />
              <span className="text-sm text-muted-foreground">
                {t('footer.copyright')}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t('footer.contact')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
