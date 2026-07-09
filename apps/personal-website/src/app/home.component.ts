import { Component, inject, LOCALE_ID, OnInit, signal } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'

import { APP_DESCRIPTION, APP_TITLE } from './app-seo'
import { SeoService } from './seo.service'

@Component({
  imports: [HlmButton, HlmBadge, ...HlmCardImports],
  selector: 'app-home',
  standalone: true,
  template: `
    <main class="relative mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-20">
      <!-- Print-Only Header (Hidden on screen) -->
      <header
        class="mb-8 hidden items-start justify-between border-b border-zinc-300 pb-6 print:flex"
      >
        <div>
          <h1 class="text-3xl leading-none font-bold text-zinc-950">
            Francesco Colamonici
          </h1>
          <p class="mt-2 text-sm font-semibold text-zinc-700">
            Fractional Technical Architect & System Design
          </p>
          <p class="mt-2.5 flex items-center gap-4 text-xs text-zinc-500">
            <span>info&#64;francescocolamonici.it</span>
            <span>•</span>
            <span>https://francescocolamonici.it</span>
          </p>
        </div>
        <!-- <div class="flex flex-col items-center">
          <img
            alt="Contact QR Code"
            class="h-20 w-20 border bg-white p-0.5"
            src="/qr-code.svg"
          />
          <span class="mt-1 text-[7px] font-medium text-zinc-400"
            >Scan to save contact</span
          >
        </div> -->
        <img
          alt="Contact QR Code"
          class="h-28 w-28 bg-white p-0.5"
          height="112"
          src="/qr-code.svg"
          width="112"
        />
      </header>

      <!-- Page Actions Header (Hidden when printing) -->
      <div class="print-hidden mb-16 flex items-center justify-between">
        <!-- Biography Badge -->
        <span
          class="text-primary border-primary/20 bg-primary/5 inline-flex items-center gap-1.5 px-3 py-1"
          hlmBadge
          variant="outline"
        >
          <span
            class="bg-primary h-1.5 w-1.5 animate-pulse rounded-full"
          ></span>
          <span i18n>Fractional Architect</span>
        </span>

        <!-- Legacy Site Action Controls -->
        <div class="flex items-center gap-3">
          <!-- Save contact (VCF Download) -->
          <a
            class="text-on-surface-variant hover:text-primary cursor-pointer"
            hlmBtn
            href="/francesco.colamonici.vcf"
            id="save-contact"
            size="icon"
            title="Save contact"
            variant="outline"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle
                cx="9"
                cy="7"
                r="4"
              />
              <line
                x1="19"
                x2="19"
                y1="8"
                y2="14"
              />
              <line
                x1="22"
                x2="16"
                y1="11"
                y2="11"
              />
            </svg>
          </a>

          <!-- Print CV -->
          <button
            class="text-on-surface-variant hover:text-primary hidden cursor-pointer md:inline-flex"
            hlmBtn
            id="print-button"
            size="icon"
            title="Print profile"
            variant="outline"
            (click)="printPage()"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path
                d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
              />
              <rect
                height="8"
                width="12"
                x="6"
                y="14"
              />
            </svg>
          </button>

          <!-- Scan QR code Toggle -->
          <button
            class="text-on-surface-variant hover:text-primary hidden cursor-pointer md:inline-flex"
            hlmBtn
            id="show-qr"
            size="icon"
            title="Scan contact"
            variant="outline"
            (click)="toggleQrModal(true)"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <rect
                height="8"
                rx="1"
                width="8"
                x="3"
                y="3"
              />
              <rect
                height="8"
                rx="1"
                width="8"
                x="13"
                y="3"
              />
              <rect
                height="8"
                rx="1"
                width="8"
                x="3"
                y="13"
              />
              <line
                x1="13"
                x2="21"
                y1="13"
                y2="13"
              />
              <line
                x1="13"
                x2="13"
                y1="13"
                y2="21"
              />
              <line
                x1="17"
                x2="17"
                y1="17"
                y2="21"
              />
              <line
                x1="21"
                x2="21"
                y1="17"
                y2="21"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Hero Section -->
      <!-- Hero Section -->
      <section
        class="mb-20 flex flex-col items-center justify-between gap-12 sm:flex-row md:items-start print:mb-8"
      >
        <div class="order-2 flex-1 md:order-1">
          <h2
            class="text-foreground mb-6 text-4xl font-bold tracking-tight md:text-6xl print:hidden"
            i18n
          >
            Fractional Technical Architect & System Design for Startups &
            Scaleups
          </h2>
          <p
            class="text-muted-foreground mb-8 max-w-3xl text-lg leading-relaxed md:text-xl print:mb-2 print:text-xs print:leading-relaxed"
            i18n
          >
            Strategic architectural advisory for startups and scaleups. From
            pharma-grade platforms and Web3 scaling to cross-platform systems
            (Web, Desktop, Mobile) and multi-cloud infrastructure optimized with
            a relentless focus on Developer Experience (DevX). Services provided
            through
            <a
              class="no-print-href hover:underline"
              href="https://byebyeq.com"
              rel="noopener noreferrer"
              target="_blank"
              >BYEBYEQ S.R.L.S.</a
            >
          </p>

          <!-- Biography Quote/Hook -->
          <div
            class="border-primary my-10 border-l-4 pl-6 print:my-4 print:pl-4"
          >
            <blockquote
              class="text-foreground mb-2 text-lg italic print:mb-1 print:text-xs"
              i18n
            >
              "Architecting Clarity: Turning the complex into the possible
              through a pragmatic approach to technology, sharpened over 15
              years of in-the-field experience."
            </blockquote>
            <cite
              class="text-muted-foreground text-sm font-semibold print:text-[10px]"
              i18n
            >
              — Francesco Colamonici
            </cite>
          </div>
        </div>

        <!-- Profile Image -->
        <div class="order-1 mb-6 shrink-0 md:order-2 md:mb-0 print:hidden">
          <img
            alt="Francesco Colamonici"
            class="border-border h-32 w-32 rounded-full border object-cover shadow-lg md:h-40 md:w-40"
            height="160"
            src="https://www.gravatar.com/avatar/82d353ae5a09599ac19268955838fa94?s=160&d=identicon"
            width="160"
          />
        </div>
      </section>

      <!-- The Three B2B Services (Pillars using hlm-card) -->
      <section class="mb-24 print:mb-8">
        <h3
          class="border-border mb-10 border-b pb-2 text-2xl font-bold print:mb-4 print:pb-1 print:text-base"
          i18n
        >
          Core Architecture Pillars
        </h3>
        <div
          class="grid grid-cols-1 gap-8 md:grid-cols-3 print:grid-cols-3 print:gap-4"
        >
          <!-- Pillar 1 -->
          <div
            class="p-6 transition-shadow hover:shadow-md print:border-none print:p-0 print:shadow-none"
            hlmCard
          >
            <div
              class="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-lg print:hidden"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect
                  height="11"
                  rx="2"
                  ry="2"
                  width="18"
                  x="3"
                  y="11"
                />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h4
              class="mb-3 text-lg print:mb-1 print:flex print:items-center print:gap-1.5 print:text-sm print:font-bold"
              hlmCardTitle
            >
              <span class="text-primary hidden print:inline">🔒</span>
              <span i18n>Multi-Tenancy & Data Isolation</span>
            </h4>
            <p
              class="text-muted-foreground p-0 text-sm leading-relaxed print:text-[10px] print:text-zinc-700"
              hlmCardContent
              i18n
            >
              Secure backend architecture with logical/physical tenant isolation
              (Prisma/PostgreSQL). Integration of KMS, encryption at rest, and
              secure separation for complex SaaS environments.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div
            class="p-6 transition-shadow hover:shadow-md print:border-none print:p-0 print:shadow-none"
            hlmCard
          >
            <div
              class="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-lg print:hidden"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <line
                  x1="18"
                  x2="18"
                  y1="20"
                  y2="10"
                />
                <line
                  x1="12"
                  x2="12"
                  y1="20"
                  y2="4"
                />
                <line
                  x1="6"
                  x2="6"
                  y1="20"
                  y2="14"
                />
              </svg>
            </div>
            <h4
              class="mb-3 text-lg print:mb-1 print:flex print:items-center print:gap-1.5 print:text-sm print:font-bold"
              hlmCardTitle
            >
              <span class="text-primary hidden print:inline">📈</span>
              <span i18n>Cloud Cost & Performance Audit</span>
            </h4>
            <p
              class="text-muted-foreground p-0 text-sm leading-relaxed print:text-[10px] print:text-zinc-700"
              hlmCardContent
              i18n
            >
              Infrastructure analysis across Google Cloud, Firebase, or Azure to
              cut compute waste, reduce hosting costs, and optimize CI/CD
              pipeline speed.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div
            class="p-6 transition-shadow hover:shadow-md print:border-none print:p-0 print:shadow-none"
            hlmCard
          >
            <div
              class="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-lg print:hidden"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h4
              class="mb-3 text-lg print:mb-1 print:flex print:items-center print:gap-1.5 print:text-sm print:font-bold"
              hlmCardTitle
            >
              <span class="text-primary hidden print:inline">👥</span>
              <span i18n>Fractional Architecture Advisory</span>
            </h4>
            <p
              class="text-muted-foreground p-0 text-sm leading-relaxed print:text-[10px] print:text-zinc-700"
              hlmCardContent
              i18n
            >
              Asynchronous, strategic support for mid-level development teams.
              RFC reviews, complex PR analysis, data modeling, and periodic
              alignment to prevent technical debt.
            </p>
          </div>
        </div>
      </section>

      <!-- Pricing Packages Section (Hidden completely when printing as it is action-oriented) -->
      <section class="mb-24 print:hidden">
        <h3
          class="mb-3 text-2xl font-bold"
          i18n
        >
          Consulting Packages
        </h3>
        <p
          class="text-muted-foreground mb-10"
          i18n
        >
          Transparent pricing plans tailored to your business needs.
        </p>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <!-- Audit Package -->
          <div
            class="relative flex flex-col justify-between overflow-hidden p-8"
            hlmCard
          >
            <div>
              <h4
                class="mb-2"
                hlmCardTitle
                i18n
              >
                System Audit
              </h4>
              <p
                class="text-muted-foreground mb-6 text-xs"
                hlmCardDescription
                i18n
              >
                One-time infrastructure review
              </p>
              <div class="text-foreground mb-6 text-3xl font-extrabold">
                @if (locale === 'it') {
                  €1.900
                  <span class="text-muted-foreground text-xs font-normal"
                    >+ IVA</span
                  >
                } @else {
                  $2,900
                }
              </div>
              <ul
                class="text-muted-foreground mb-8 space-y-3 p-0 text-sm"
                hlmCardContent
              >
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>GCP/Firebase Cost Audit</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>Database & query speed analysis</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>Multi-tenant data isolation check</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>DevX & CI/CD bottleneck evaluation</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>Comprehensive report & 1h review</span>
                </li>
              </ul>
            </div>
            <a
              class="w-full cursor-pointer py-2.5 text-center"
              hlmBtn
              href="https://cal.com/francescocolamonici"
              i18n
              rel="noopener noreferrer"
              target="_blank"
              variant="outline"
            >
              Order Audit
            </a>
          </div>

          <!-- Weekly Sprint Package -->
          <div
            class="border-primary relative flex flex-col justify-between overflow-hidden border-2 p-8 shadow-sm"
            hlmCard
          >
            <span
              class="bg-primary text-primary-foreground absolute top-0 right-0 rounded-bl-lg px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
              i18n
            >
              Low Commitment
            </span>
            <div>
              <h4
                class="mb-2"
                hlmCardTitle
                i18n
              >
                Weekly Architecture Sprint
              </h4>
              <p
                class="text-muted-foreground mb-6 text-xs"
                hlmCardDescription
                i18n
              >
                Short-term execution & advisory
              </p>
              <div class="text-foreground mb-6 text-3xl font-extrabold">
                @if (locale === 'it') {
                  €1.000
                  <span class="text-muted-foreground text-xs font-normal"
                    >+ IVA / week</span
                  >
                } @else {
                  $1,500
                  <span class="text-muted-foreground text-xs font-normal"
                    >/ week</span
                  >
                }
              </div>
              <ul
                class="text-muted-foreground mb-8 space-y-3 p-0 text-sm"
                hlmCardContent
              >
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>7 Days Async Slack Access</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>System Design RFC/PR reviews</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>CI/CD & environment bootstrapping</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>Up to 4 hours of focused deep work</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>1x 1h Live Design Alignment session</span>
                </li>
              </ul>
            </div>
            <a
              class="bg-primary text-primary-foreground w-full cursor-pointer py-2.5 text-center transition-opacity hover:opacity-90"
              hlmBtn
              href="https://cal.com/francescocolamonici"
              i18n
              rel="noopener noreferrer"
              target="_blank"
              variant="default"
            >
              Start Sprint
            </a>
          </div>

          <!-- Monthly Retainer Package -->
          <div
            class="relative flex flex-col justify-between overflow-hidden p-8"
            hlmCard
          >
            <div>
              <h4
                class="mb-2"
                hlmCardTitle
                i18n
              >
                Monthly Fractional Advisory
              </h4>
              <p
                class="text-muted-foreground mb-6 text-xs"
                hlmCardDescription
                i18n
              >
                Ongoing architecture partnership
              </p>
              <div class="text-foreground mb-6 text-3xl font-extrabold">
                @if (locale === 'it') {
                  €3.000
                  <span class="text-muted-foreground text-xs font-normal"
                    >+ IVA / month</span
                  >
                } @else {
                  $4,500
                  <span class="text-muted-foreground text-xs font-normal"
                    >/ month</span
                  >
                }
              </div>
              <ul
                class="text-muted-foreground mb-8 space-y-3 p-0 text-sm"
                hlmCardContent
              >
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>Full Monthly Slack/PR Integration</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>Weekly 1h Live Alignment calls</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>Web3, dApps & Multi-Cloud advisory</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>Up to 10 hours of monthly deep work</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg
                    class="text-primary h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span i18n>Strategic system design mentoring</span>
                </li>
              </ul>
            </div>
            <a
              class="w-full cursor-pointer py-2.5 text-center"
              hlmBtn
              href="https://cal.com/francescocolamonici"
              i18n
              rel="noopener noreferrer"
              target="_blank"
              variant="outline"
            >
              Subscribe
            </a>
          </div>
        </div>
      </section>

      <!-- Technical Ecosystem Section (Hidden on print) -->
      <section class="mb-24 print:hidden">
        <h3
          class="border-border mb-6 border-b pb-2 text-2xl font-bold"
          i18n
        >
          Technical Ecosystem & Capabilities
        </h3>
        <div class="grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
          <div class="space-y-2">
            <h4
              class="text-foreground font-semibold"
              i18n
            >
              Frontend & Mobile
            </h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Angular</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >React</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Next.js</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Remix</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Capacitor</span
              >
            </div>
          </div>
          <div class="space-y-2">
            <h4
              class="text-foreground font-semibold"
              i18n
            >
              Backend & Desktop
            </h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >NestJS</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Node.js</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >TypeScript</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Electron</span
              >
            </div>
          </div>
          <div class="space-y-2">
            <h4
              class="text-foreground font-semibold"
              i18n
            >
              Cloud & DevOps
            </h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >GCP</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Azure</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >AWS</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Docker & CI/CD</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Terraform</span
              >
            </div>
          </div>
          <div class="space-y-2">
            <h4
              class="text-foreground font-semibold"
              i18n
            >
              Data & Web3
            </h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >SQL</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >NoSQL</span
              >
              <span
                class="bg-primary/5 text-primary border-primary/20 rounded border px-2 py-0.5 text-xs"
                >Web3 dApps</span
              >
            </div>
          </div>
        </div>
      </section>

      <!-- Qualifications & Biography details -->
      <section
        class="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 print:mb-0 print:grid-cols-2 print:gap-8"
      >
        <!-- Highlights -->
        <div>
          <h3
            class="border-border mb-6 border-b pb-2 text-2xl font-bold print:mb-4 print:pb-1 print:text-base"
            i18n
          >
            Key Highlights
          </h3>
          <ul class="space-y-4 print:space-y-1">
            <li class="flex items-start gap-3">
              <span
                class="text-primary text-lg leading-none font-bold select-none print:mt-0 print:text-xs"
                >•</span
              >
              <div class="text-sm print:text-xs">
                <strong
                  class="text-foreground print:text-[10px] print:text-zinc-900"
                  i18n
                  >Enterprise & Pharma Track Record:</strong
                >
                <span
                  class="text-muted-foreground print:text-[10px] print:text-zinc-700"
                  i18n
                >
                  Leading architectural innovation from Math graduate to
                  Solution Architect for Big Pharma, scaling enterprise
                  infrastructures.</span
                >
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="text-primary text-lg leading-none font-bold select-none print:mt-0 print:text-xs"
                >•</span
              >
              <div class="text-sm print:text-xs">
                <strong
                  class="text-foreground print:text-[10px] print:text-zinc-900"
                  i18n
                  >Full-Stack & Multi-Platform:</strong
                >
                <span
                  class="text-muted-foreground print:text-[10px] print:text-zinc-700"
                  i18n
                >
                  Expert in Angular, React (Next.js, Remix) ecosystems, plus
                  desktop (Electron) and mobile (Capacitor) wrappers.</span
                >
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="text-primary text-lg leading-none font-bold select-none print:mt-0 print:text-xs"
                >•</span
              >
              <div class="text-sm print:text-xs">
                <strong
                  class="text-foreground print:text-[10px] print:text-zinc-900"
                  i18n
                  >Web3 & Startup Execution:</strong
                >
                <span
                  class="text-muted-foreground print:text-[10px] print:text-zinc-700"
                  i18n
                >
                  Proven track record architecting decentralized components
                  (dApps) and Web3 integrations for early-stage startups.</span
                >
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="text-primary text-lg leading-none font-bold select-none print:mt-0 print:text-xs"
                >•</span
              >
              <div class="text-sm print:text-xs">
                <strong
                  class="text-foreground print:text-[10px] print:text-zinc-900"
                  i18n
                  >Multi-Cloud & DevOps:</strong
                >
                <span
                  class="text-muted-foreground print:text-[10px] print:text-zinc-700"
                  i18n
                >
                  Production experience with GCP, Azure, and AWS, including 6
                  months of dedicated DevOps and CI/CD orchestration.</span
                >
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="text-primary text-lg leading-none font-bold select-none print:mt-0 print:text-xs"
                >•</span
              >
              <div class="text-sm print:text-xs">
                <strong
                  class="text-foreground print:text-[10px] print:text-zinc-900"
                  i18n
                  >DevX & Mathematics Honors:</strong
                >
                <span
                  class="text-muted-foreground print:text-[10px] print:text-zinc-700"
                  i18n
                >
                  Applying mathematical precision and logical systems to slash
                  technical debt and maximize developer experience (DevX).</span
                >
              </div>
            </li>
          </ul>
        </div>

        <!-- Personal & Social Info -->
        <div>
          <h3
            class="border-border mb-6 border-b pb-2 text-2xl font-bold print:mb-4 print:pb-1 print:text-base"
            i18n
          >
            Qualifications & Profiles
          </h3>
          <div
            class="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 print:grid-cols-1 print:gap-2 print:space-y-0"
          >
            <!-- Biography Extras -->
            <div
              class="text-muted-foreground space-y-3 print:space-y-1 print:text-[10px] print:text-zinc-700"
            >
              <p class="flex items-center gap-2">
                <span class="text-primary select-none">🥋</span>
                <span i18n>Two-time Black Belt (Taekwondo & Jujutsu)</span>
              </p>
              <p class="flex items-center gap-2">
                <span class="text-primary select-none">♟️</span>
                <span i18n>Chess Player (~1600 ELO)</span>
              </p>
              <p class="flex items-center gap-2">
                <span class="text-primary select-none">🐉</span>
                <span i18n>D&D Player & Game Master</span>
              </p>
              <p class="flex items-center gap-2">
                <!-- <svg class="h-3.5 w-4.5 shrink-0 inline-block align-middle print:hidden" viewBox="0 0 60 30">
                  <rect width="60" height="30" fill="#012169"/>
                  <path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/>
                  <path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" stroke-width="4"/>
                  <path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/>
                  <path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/>
                </svg> -->
                <svg
                  aria-hidden="true"
                  class="inline-block h-3.5 w-4.5 shrink-0 align-middle"
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  viewBox="0 0 36 36"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"
                    fill="#00247D"
                  ></path>
                  <path
                    d="M25.14 23l9.712 6.801a3.977 3.977 0 0 0 .99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8a3.988 3.988 0 0 0-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2a3.994 3.994 0 0 0-.991 1.749L7.372 13h3.487z"
                    fill="#CF1B2B"
                  ></path>
                  <path
                    d="M36 21H21v10h2v-5.836L31.335 31H32a3.99 3.99 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9a3.983 3.983 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4.001 4.001 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4a3.985 3.985 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A3.968 3.968 0 0 0 0 9v.059L5.628 13H0v2h15V5h-2z"
                    fill="#EEE"
                  ></path>
                  <path
                    d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"
                    fill="#CF1B2B"
                  ></path>
                </svg>
                <span i18n>Certified C2 English (Fluent since 2020)</span>
              </p>
            </div>

            <!-- Social Links -->
            <div class="flex flex-col gap-2.5 print:gap-1.5 print:text-xs">
              <a
                class="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors print:whitespace-nowrap print:text-zinc-700"
                href="https://www.linkedin.com/in/francesco-colamonici"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  class="h-4 w-4 shrink-0 print:hidden"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764l-1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  />
                </svg>
                <span class="hidden print:inline">🔗 </span
                ><span i18n>LinkedIn CV</span>
              </a>

              <a
                class="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors print:text-zinc-700"
                href="https://github.com/fr-esco"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  class="h-4 w-4 shrink-0 print:hidden"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                <span class="hidden print:inline">🔗 </span
                ><span i18n>GitHub Profile</span>
              </a>

              <a
                class="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors print:text-zinc-700"
                href="https://stackoverflow.com/users/8682941"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  class="h-4 w-4 shrink-0 print:hidden"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18.986 21.867H1.997v-6.953h-1.99v8.943h20.975v-8.943h-1.996v6.953zm-14.97-4.482h10.975v-1.99H4.016v1.99zm.557-4.992l10.825 1.834.332-1.96-10.825-1.834-.332 1.96zm1.748-4.708l10.023 4.492.83-1.808-10.023-4.493-.83 1.809zm3.17-4.089l8.36 7.108 1.3-1.517-8.36-7.108-1.3 1.517zm4.908-2.915l5.967 9.245 1.666-1.077-5.966-9.245-1.667 1.077z"
                  />
                </svg>
                <span class="hidden print:inline">🔗 </span
                ><span i18n>Stack Overflow</span>
              </a>

              <!-- Obfuscated E-mail Link -->
              <span
                class="text-muted-foreground flex items-center gap-2 print:text-zinc-700"
              >
                <svg
                  class="h-4 w-4 shrink-0 print:hidden"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span class="hidden print:inline">✉️ </span>
                <a
                  class="hover:text-primary no-print-href cursor-pointer transition-colors print:text-black"
                  href="mailto:info&#64;francescocolamonici.it"
                >
                  info&#64;francescocolamonici.it
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer Branding Info (Hidden on print) -->
      <footer
        class="border-border text-muted-foreground print-hidden mt-20 flex items-center justify-between gap-4 border-t pt-8 text-xs"
      >
        <p>© 2011-2026 Francesco Colamonici. All rights reserved.</p>
        <p i18n>
          Services provided through
          <a
            class="no-print-href hover:underline"
            href="https://byebyeq.com"
            rel="noopener noreferrer"
            target="_blank"
            >BYEBYEQ S.R.L.S.</a
          >
        </p>
      </footer>
    </main>

    <!-- Scan Contact modal / overlay lightbox (Hidden when printing) -->
    @if (showQrModal()) {
      <div
        aria-label="Close QR Code Modal"
        class="bg-background/80 animate-in fade-in print-hidden fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md duration-300"
        role="button"
        tabindex="0"
        (click)="toggleQrModal(false)"
        (window:keydown.escape)="toggleQrModal(false)"
      >
        <div
          class="bg-card border-border animate-in zoom-in-95 mx-6 flex w-full max-w-sm flex-col items-center rounded-2xl border p-6 shadow-xl duration-300"
          role="document"
          tabindex="0"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <h3
            class="text-foreground mb-4 text-lg font-bold"
            i18n
          >
            Scan Contact Card
          </h3>
          <div
            class="border-border relative mb-6 rounded-xl border bg-white p-4 shadow-inner"
          >
            <img
              alt="My contact in a QR code"
              class="h-48 w-48"
              src="/qr-code.svg"
            />
          </div>
          <p
            class="text-muted-foreground mb-6 text-center text-xs leading-relaxed"
            i18n
          >
            Scan this QR code with your mobile camera to quickly import contact
            details into your address book.
          </p>
          <button
            class="bg-primary text-primary-foreground w-full cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            i18n
            (click)="toggleQrModal(false)"
          >
            Close
          </button>
        </div>
      </div>
    }
  `,
})
export class HomeComponent implements OnInit {
  private titleService = inject(Title)
  private meta = inject(Meta)
  private seoService = inject(SeoService)
  public locale = inject(LOCALE_ID)

  // Signals
  public showQrModal = signal(false)

  ngOnInit() {
    this.setSeo()
  }

  private setSeo() {
    this.titleService.setTitle(APP_TITLE)
    this.meta.updateTag({ name: 'description', content: APP_DESCRIPTION })

    // JSON-LD structured data for ProfessionalService
    const professionalServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Francesco Colamonici — Fractional Technical Architect',
      image: 'https://francescocolamonici.it/favicon.png',
      url: 'https://francescocolamonici.it',
      logo: 'https://francescocolamonici.it/favicon.png',
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Napoli',
        addressRegion: 'NA',
        postalCode: '80038',
        addressCountry: 'IT',
      },
      provider: {
        '@type': 'Person',
        name: 'Francesco Colamonici',
        url: 'https://francescocolamonici.it',
        jobTitle: 'Fractional Technical Architect',
        worksFor: {
          '@type': 'Organization',
          name: 'BYEBYEQ S.R.L.S.',
        },
      },
    }

    this.seoService.setStructuredData(professionalServiceSchema)
  }

  public printPage() {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  public toggleQrModal(show: boolean) {
    this.showQrModal.set(show)
  }
}
