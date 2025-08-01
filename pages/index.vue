<template>
  <div class="space-y-12 py-8">
    <!-- Hero Section -->
    <section class="text-center space-y-4">
      <h1 class="text-4xl font-bold tracking-tight">
        <span class="text-primary">Vibecoding</span> Nuxt Starter
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        A modern template for rapidly starting new projects with Nuxt, Supabase, and AI features.
        Optimized for Vercel deployment with AI Gateway integration for scalable production applications.
      </p>
      <div class="flex gap-4 justify-center">
        <NuxtLink
          to="https://github.com/katokdoescode/vibecoding-nuxt-template"
          target="_blank"
          class="text-primary hover:underline"
        >
          <Icon
            name="lucide:github"
            class="mr-2 h-4 w-4"
          />
          View on GitHub
        </NuxtLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="mx-auto space-y-8">
      <h2 class="text-3xl font-bold text-center">
        Key Features
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon
                name="lucide:cpu"
                class="h-5 w-5 text-primary"
              />
              Modern Nuxt Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Built with Nuxt for a powerful, flexible, and scalable frontend with server-side rendering and static site generation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon
                name="lucide:database"
                class="h-5 w-5 text-primary"
              />
              Supabase Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Complete backend solution with authentication, database, and real-time capabilities powered by Supabase.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon
                name="lucide:brain"
                class="h-5 w-5 text-primary"
              />
              AI-Powered Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Ready-to-use AI capabilities via OpenAI API integration for building intelligent applications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon
                name="lucide:palette"
                class="h-5 w-5 text-primary"
              />
              Beautiful UI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Pre-configured with Tailwind CSS v4 and Shadcn UI components for fast, beautiful, and adaptive UI development.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon
                name="lucide:shield-check"
                class="h-5 w-5 text-primary"
              />
              Authentication Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Google OAuth integration with secure authentication flows and user management out of the box.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon
                name="lucide:credit-card"
                class="h-5 w-5 text-primary"
              />
              Payment Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Stripe payment processing built-in for handling subscriptions and one-time payments.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon
                name="lucide:rocket"
                class="h-5 w-5 text-primary"
              />
              Vercel Deployment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Optimized for Vercel deployment with edge functions, automatic deployments, and global CDN distribution.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon
                name="lucide:network"
                class="h-5 w-5 text-primary"
              />
              Vercel AI Gateway
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Integrated Vercel AI Gateway for scalable AI API management with rate limiting, caching, and analytics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Icon
                name="lucide:bar-chart-3"
                class="h-5 w-5 text-primary"
              />
              Vercel Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Built-in Vercel Analytics for real-time performance monitoring and user behavior insights.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Quick Start Section -->
    <section class="space-y-6 bg-muted/50 rounded-lg p-8">
      <h2 class="text-3xl font-bold text-center">
        Quick Start
      </h2>
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="flex items-center gap-4">
          <div class="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <div>
            <h3 class="font-semibold">
              Install Dependencies
            </h3>
            <code class="text-sm bg-background px-2 py-1 rounded">npm install</code>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <div>
            <h3 class="font-semibold">
              Setup Environment
            </h3>
            <code class="text-sm bg-background px-2 py-1 rounded">cp ./.env.example ./.env</code>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
            3
          </div>
          <div>
            <h3 class="font-semibold">
              Start Development
            </h3>
            <code class="text-sm bg-background px-2 py-1 rounded">npm run dev</code>
          </div>
        </div>
      </div>
    </section>

    <!-- What You Can Build Section -->
    <section class="space-y-8">
      <h2 class="text-3xl font-bold text-center">
        What You Can Build
      </h2>
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="space-y-4">
          <h3 class="text-xl font-semibold flex items-center gap-2">
            <Icon
              name="lucide:sparkles"
              class="h-5 w-5 text-primary"
            />
            AI-Powered Applications
          </h3>
          <ul class="space-y-2 text-muted-foreground">
            <li>• Chatbots and conversational AI</li>
            <li>• Content generation tools</li>
            <li>• Code assistants and IDE plugins</li>
            <li>• Automated workflows and agents</li>
          </ul>
        </div>

        <div class="space-y-4">
          <h3 class="text-xl font-semibold flex items-center gap-2">
            <Icon
              name="lucide:users"
              class="h-5 w-5 text-primary"
            />
            SaaS Applications
          </h3>
          <ul class="space-y-2 text-muted-foreground">
            <li>• User authentication and management</li>
            <li>• Subscription-based services</li>
            <li>• Multi-tenant applications</li>
            <li>• Real-time collaboration tools</li>
          </ul>
        </div>

        <div class="space-y-4">
          <h3 class="text-xl font-semibold flex items-center gap-2">
            <Icon
              name="lucide:globe"
              class="h-5 w-5 text-primary"
            />
            Web Applications
          </h3>
          <ul class="space-y-2 text-muted-foreground">
            <li>• E-commerce platforms</li>
            <li>• Content management systems</li>
            <li>• Progressive Web Apps (PWA)</li>
            <li>• Static and dynamic sites</li>
          </ul>
        </div>

        <div class="space-y-4">
          <h3 class="text-xl font-semibold flex items-center gap-2">
            <Icon
              name="lucide:zap"
              class="h-5 w-5 text-primary"
            />
            Developer Tools
          </h3>
          <ul class="space-y-2 text-muted-foreground">
            <li>• MCP (Model Context Protocol) servers</li>
            <li>• API integrations and webhooks</li>
            <li>• Developer documentation sites</li>
            <li>• CLI tools and utilities</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- AI-Powered Development Section -->
    <section class="space-y-8 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-lg p-8">
      <h2 class="text-3xl font-bold text-center">
        AI-Powered Development
      </h2>
      <div class="max-w-4xl mx-auto space-y-6">
        <p class="text-lg text-muted-foreground text-center">
          This template is designed specifically for AI-assisted development workflows.
          Leverage the power of AI coding tools to accelerate your development process.
        </p>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <h3 class="text-xl font-semibold flex items-center gap-2">
              <Icon
                name="lucide:wand-2"
                class="h-5 w-5 text-primary"
              />
              Build it with any AI IDE or Claude Code
            </h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>• Built with Claude Code in mind for optimal AI-assisted development</li>
              <li>• Structured codebase that AI tools can easily understand and modify</li>
              <li>• Comprehensive documentation and clear component architecture</li>
              <li>• Automated testing and deployment workflows</li>
            </ul>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-semibold flex items-center gap-2">
              <Icon
                name="lucide:bot"
                class="h-5 w-5 text-primary"
              />
              AI Development Benefits
            </h3>
            <ul class="space-y-2 text-muted-foreground">
              <li>• Rapid prototyping and feature implementation</li>
              <li>• Intelligent code completion and refactoring</li>
              <li>• Automated debugging and error resolution</li>
              <li>• Natural language to code translation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
</script>
