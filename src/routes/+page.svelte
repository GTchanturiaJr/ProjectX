<script lang="ts">
  import PageRenderer from '$lib/components/public/PageRenderer.svelte';
  import type { Page, PageSection } from '$lib/types';

  let { data } = $props();
  let page = data.page as Page | null;
  let sections = data.sections as PageSection[];

  const features = [
    { icon: '⚡', title: 'Blazing Fast', desc: 'Built on SvelteKit for instant page loads and smooth navigation with zero unnecessary overhead.' },
    { icon: '🔒', title: 'Secure by Default', desc: 'Row-level security on every table. Role-based access control with 7 built-in permission levels.' },
    { icon: '🎨', title: 'Page Builder', desc: 'Drag-and-drop sections with 18+ component types. Build any layout without touching code.' },
    { icon: '📝', title: 'Full Blog Engine', desc: 'Write, schedule, and publish posts with categories, tags, featured images, and SEO settings.' },
    { icon: '🌙', title: 'Dark Mode', desc: 'System-aware theming that respects user preferences. Fully customizable color tokens.' },
    { icon: '📊', title: 'Analytics & Logs', desc: 'Built-in audit logging, form submissions tracking, and admin dashboard with live stats.' },
  ];
</script>

{#if page}
  <PageRenderer {sections} />
{:else}
  <!-- Hero -->
  <section class="hero-bg relative overflow-hidden">
    <div class="container py-28 lg:py-36">
      <div class="mx-auto max-w-3xl text-center">
        <div class="badge mb-6 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 animate-fade-up" style="animation-delay: 0ms">
          <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          SvelteKit + Supabase CMS
        </div>

        <h1 class="animate-fade-up text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-6xl xl:text-7xl" style="animation-delay: 60ms">
          The modern CMS<br />
          <span class="gradient-text">built to scale</span>
        </h1>

        <p class="animate-fade-up mt-6 text-xl leading-relaxed text-gray-600 dark:text-gray-400" style="animation-delay: 120ms">
          A production-ready website platform with a powerful admin panel,
          page builder, blog engine, media manager, and role-based access control.
          All backed by Supabase.
        </p>

        <div class="animate-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style="animation-delay: 180ms">
          <a href="/admin/login" class="btn btn-primary px-8 py-3.5 text-base shadow-lg shadow-blue-500/25">
            Open Admin Panel
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a href="/blog" class="btn btn-outline px-8 py-3.5 text-base">
            Read the Blog
          </a>
        </div>
      </div>

      <!-- Abstract decoration -->
      <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 opacity-30 blur-3xl" aria-hidden="true">
        <div class="h-96 w-96 rounded-full bg-blue-400 mix-blend-multiply dark:mix-blend-screen"></div>
      </div>
    </div>
  </section>

  <!-- Social proof strip -->
  <section class="border-y border-gray-100 bg-gray-50/50 py-6 dark:border-gray-800 dark:bg-gray-900/30">
    <div class="container">
      <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-gray-500 dark:text-gray-500">
        <span class="font-medium">Powered by</span>
        {#each ['SvelteKit 5', 'Supabase', 'Tailwind CSS v4', 'TypeScript', 'Lucide Icons'] as tech}
          <span class="flex items-center gap-2">
            <span class="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
            {tech}
          </span>
        {/each}
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="section">
    <div class="container">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white lg:text-4xl">
          Everything you need to ship
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Stop stitching together tools. This template ships with a complete CMS, auth, and deployment pipeline.
        </p>
      </div>

      <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each features as f, i}
          <div class="card group p-6" style="animation-delay: {i * 60}ms">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl dark:bg-blue-950">
              {f.icon}
            </div>
            <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">{f.title}</h3>
            <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Admin panel preview -->
  <section class="section bg-gray-50 dark:bg-gray-900/50">
    <div class="container">
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <div class="badge mb-4 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Admin Panel
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white lg:text-4xl">
            A full-featured backend at your fingertips
          </h2>
          <p class="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Manage pages, blog posts, navigation, media files, forms, users, roles, SEO, and site settings — all from a clean, intuitive admin interface.
          </p>
          <ul class="mt-8 space-y-3">
            {#each ['13 admin sections', 'Role-based access control (7 roles)', 'Drag-and-drop page builder', 'Real-time audit logging'] as item}
              <li class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span class="text-sm font-medium">{item}</span>
              </li>
            {/each}
          </ul>
          <div class="mt-8">
            <a href="/admin/login" class="btn btn-primary py-3 px-6">
              Get started free
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- Mini admin preview card -->
        <div class="relative">
          <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/60 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/30">
            <!-- Fake browser bar -->
            <div class="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <div class="h-3 w-3 rounded-full bg-red-400"></div>
              <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div class="h-3 w-3 rounded-full bg-green-400"></div>
              <div class="ml-3 flex-1 rounded-md bg-white/60 px-3 py-1 text-xs text-gray-400 dark:bg-white/5">localhost:5173/admin/dashboard</div>
            </div>
            <!-- Fake dashboard -->
            <div class="flex h-64 overflow-hidden">
              <!-- Sidebar -->
              <div class="w-36 border-r border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                <div class="mb-3 h-4 w-20 rounded-md bg-blue-600 opacity-80"></div>
                {#each [85, 70, 90, 60, 75, 50] as w}
                  <div class="mb-2 flex items-center gap-2">
                    <div class="h-3 w-3 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div class="h-2.5 rounded-md bg-gray-100 dark:bg-gray-800" style="width: {w}%"></div>
                  </div>
                {/each}
              </div>
              <!-- Content area -->
              <div class="flex-1 bg-gray-50 p-4 dark:bg-gray-950">
                <div class="mb-4 grid grid-cols-3 gap-3">
                  {#each ['bg-blue-50 dark:bg-blue-950', 'bg-emerald-50 dark:bg-emerald-950', 'bg-violet-50 dark:bg-violet-950'] as cls}
                    <div class="rounded-lg {cls} p-3">
                      <div class="mb-1 h-2 w-8 rounded bg-gray-300/60 dark:bg-gray-600"></div>
                      <div class="h-4 w-10 rounded bg-gray-400/40 dark:bg-gray-500"></div>
                    </div>
                  {/each}
                </div>
                <div class="space-y-2">
                  {#each [100, 85, 70, 90] as w}
                    <div class="h-3 rounded-md bg-white shadow-sm dark:bg-gray-800" style="width: {w}%"></div>
                  {/each}
                </div>
              </div>
            </div>
          </div>
          <!-- Glow behind card -->
          <div class="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-blue-500/5 blur-xl dark:bg-blue-500/10"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="section">
    <div class="container">
      <div class="overflow-hidden rounded-2xl bg-blue-600 px-8 py-16 text-center shadow-xl shadow-blue-600/20 lg:px-16">
        <h2 class="text-3xl font-extrabold text-white lg:text-4xl">Ready to build something great?</h2>
        <p class="mt-4 text-lg text-blue-100">
          Sign up, set up your Supabase project, and launch your site in minutes.
        </p>
        <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href="/admin/login" class="btn bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50">
            Open Admin Panel
          </a>
          <a href="/blog" class="btn border border-blue-400 px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-500">
            Explore the Blog
          </a>
        </div>
      </div>
    </div>
  </section>
{/if}
