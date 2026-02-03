import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe2, Languages, Zap, Shield, Users, Workflow } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-muted/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/z-logo.png"
              alt="Z Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-bold">Z Workspace</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium">
            Built for global teams
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Build once.
            <br />
            <span className="text-muted-foreground">Ship everywhere.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
            The workspace platform with translation and localization built in.
            Create, collaborate, and scale your content globally.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/sign-up">Start building free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent"
            >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • Free forever for individuals
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to go global
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built-in features that help you create, translate, and manage
            content across languages and markets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Languages,
              title: "Lingo.dev Ready",
              description:
                "Seamlessly integrate with Lingo.dev for powerful translation workflows and glossary management.",
            },
            {
              icon: Globe2,
              title: "Multi-language Support",
              description:
                "Create content in one language and distribute it globally with built-in translation tools.",
            },
            {
              icon: Zap,
              title: "Real-time Collaboration",
              description:
                "Work together with your team in real-time, with changes synced instantly across all users.",
            },
            {
              icon: Workflow,
              title: "Rich Text Editor",
              description:
                "Powerful block-based editor with support for text, images, code, and custom content blocks.",
            },
            {
              icon: Users,
              title: "Team Workspaces",
              description:
                "Organize your content in workspaces, collaborate with team members, and manage permissions.",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description:
                "Enterprise-grade security with row-level access control and encrypted data storage.",
            },
          ].map((feature) => (
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
        className="container mx-auto px-4 py-20 bg-muted/30"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, powerful workflow
            </h2>
            <p className="text-lg text-muted-foreground">
              From content creation to global distribution in three easy steps
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Create your workspace",
                description:
                  "Set up your workspace and invite your team. Organize your content with flexible document structures.",
              },
              {
                step: "02",
                title: "Build your content",
                description:
                  "Use our rich editor to create documents with text, images, code blocks, and more. Structure ready for translation.",
              },
              {
                step: "03",
                title: "Go global with Lingo.dev",
                description:
                  "Add Lingo.dev integration to enable translation workflows, glossary management, and multi-language distribution.",
              },
            ].map((item) => (
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
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 p-12 rounded-2xl border border-border bg-card shadow-xl">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">
            Ready to build for a global audience?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join teams using Z to create and distribute content worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/sign-up">Start for free</Link>
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
                alt="Z Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-sm text-muted-foreground">
                © 2026 Z. Built for global teams.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
