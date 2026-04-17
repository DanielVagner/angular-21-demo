import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Feature {
  path: string;
  icon: string;
  title: string;
  version: string;
  versionClass: string;
  desc: string;
  tags: string[];
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="demo-page">
      <div class="page-header">
        <div class="version-badge">Angular v18 – v21 · 2024/2025</div>
        <h1>Nové technologie v Angularu</h1>
        <p>
          Prezentace pro tým — navazuje na <strong style="color:var(--text)">Angular v17 demo</strong>
          kde jsme probírali první Signals, Defer a nový Control Flow.
          Dnes jdeme dál: co se stabilizovalo, co je nového a proč na to přejít.
        </p>
      </div>

      <!-- Timeline -->
      <div class="timeline">
        @for (v of versions; track v.num) {
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-body">
              <div class="timeline-header">
                <span class="timeline-version">Angular {{ v.num }}</span>
                <span class="timeline-date">{{ v.date }}</span>
              </div>
              <ul class="timeline-list">
                @for (item of v.items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          </div>
        }
      </div>

      <h2 class="features-heading">Co si dnes ukážeme</h2>

      <div class="feature-grid">
        @for (f of features; track f.path) {
          <a [routerLink]="f.path" class="feature-card">
            <div class="fc-icon">{{ f.icon }}</div>
            <div class="fc-body">
              <div class="fc-header">
                <span class="fc-title">{{ f.title }}</span>
                <span class="fc-ver" [class]="'ver-' + f.versionClass">{{ f.version }}</span>
              </div>
              <p class="fc-desc">{{ f.desc }}</p>
              <div class="fc-tags">
                @for (tag of f.tags; track tag) {
                  <span class="fc-tag">{{ tag }}</span>
                }
              </div>
            </div>
          </a>
        }
      </div>

      <div class="info-box">
        <strong>Kde jsme skončili v17 —</strong> Ukázali jsme si základy Signals
        (<code>signal()</code>, <code>computed()</code>, <code>effect()</code>),
        nový Control Flow (<code>&#64;if</code>, <code>&#64;for</code>)
        a <code>&#64;defer</code> blok. Dnes se podíváme co se stabilizovalo
        a jaké nové API přibyla ve v18 až v21.
      </div>
    </div>
  `,
  styles: [`
    .timeline {
      position: relative;
      padding-left: 1.5rem;
      margin: 0 0 2.5rem;
      border-left: 2px solid var(--border);
    }
    .timeline-item {
      position: relative;
      margin-bottom: 1.5rem;
    }
    .timeline-dot {
      position: absolute;
      left: -1.65rem;
      top: 0.3rem;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent);
      border: 2px solid var(--bg);
    }
    .timeline-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.4rem;
    }
    .timeline-version {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text);
    }
    .timeline-date {
      font-size: 0.78rem;
      color: var(--text-dim);
    }
    .timeline-list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .timeline-list li {
      font-size: 0.8rem;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.15rem 0.6rem;
      color: var(--text-muted);
    }
    .features-heading {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.8rem;
    }
    .feature-card {
      display: flex;
      gap: 1rem;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      text-decoration: none;
      color: inherit;
      transition: border-color 0.2s, background 0.2s;
      &:hover { background: var(--card-hover); border-color: var(--accent); }
    }
    .fc-icon { font-size: 1.75rem; flex-shrink: 0; }
    .fc-body { flex: 1; min-width: 0; }
    .fc-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; }
    .fc-title { font-weight: 600; font-size: 0.95rem; color: var(--text); }
    .fc-ver {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.1rem 0.45rem;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      &.ver-stable { background: rgba(34,197,94,0.12); color: #4ade80; }
      &.ver-v17    { background: rgba(168,85,247,0.12); color: #c084fc; }
      &.ver-v19    { background: rgba(59,130,246,0.12); color: #60a5fa; }
      &.ver-v20    { background: rgba(59,130,246,0.12); color: #60a5fa; }
      &.ver-new    { background: rgba(221,0,49,0.2); color: #ff6b8a; }
    }
    .fc-desc { font-size: 0.83rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.6rem; }
    .fc-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
    .fc-tag {
      font-size: 0.72rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 0.1rem 0.45rem;
      color: var(--text-dim);
      font-family: 'Fira Code', monospace;
    }
  `]
})
export class HomeComponent {
  versions = [
    {
      num: '18', date: 'Květen 2024',
      items: ['Zoneless (experimentální)', 'Material 3 stable', 'Route redirects jako funkce', 'TypeScript 5.4']
    },
    {
      num: '19', date: 'Listopad 2024',
      items: ['linkedSignal() — nové API', 'resource() API preview', 'Incremental Hydration preview', 'Route-level render mode', 'Lazy loading komponent ve Routes', 'TypeScript 5.6']
    },
    {
      num: '20', date: 'Květen 2025',
      items: ['Signals STABLE ✓ (signal, computed, effect, input, output, model, viewChild)', 'resource() stable', 'httpResource() experimentální', 'Zoneless STABLE ✓', 'Incremental Hydration stable', 'Standalone default', 'Template HMR stable', 'TypeScript 5.8']
    },
    {
      num: '21', date: 'Prosinec 2025',
      items: ['Signal Forms (experimentální) 🔥', 'Angular MCP Server', 'Angular Aria package', 'TypeScript 5.9']
    },
  ];

  features: Feature[] = [
    {
      path: '/signals', icon: '⚡', title: 'Signals — plně stabilní',
      version: 'v20 stable', versionClass: 'stable',
      desc: 'Všechna reaktivní primitiva jsou od v20 stable: signal, computed, effect, input(), output(), model(), viewChild().',
      tags: ['signal()', 'computed()', 'effect()', 'input()', 'output()', 'model()', 'viewChild()'],
    },
    {
      path: '/control-flow', icon: '🔀', title: 'Control Flow + @defer',
      version: 'v17+', versionClass: 'v17',
      desc: 'Nová template syntaxe @if, @for, @switch. Defer blok s hydration triggery (v19+): on viewport, on interaction, on idle.',
      tags: ['@if', '@for', '@switch', '@defer', '@placeholder', 'on viewport'],
    },
    {
      path: '/linked-signal', icon: '🔗', title: 'linkedSignal()',
      version: 'v19', versionClass: 'v19',
      desc: 'Odvoditelný WritableSignal. Na rozdíl od computed() lze hodnotu i ručně přepsat — ideální pro resettable stav závislý na vstupu.',
      tags: ['linkedSignal()', 'WritableSignal', 'derived state'],
    },
    {
      path: '/resource', icon: '📦', title: 'resource() API',
      version: 'v20', versionClass: 'v20',
      desc: 'Reaktivní správa async dat. Automatické stavy: Idle, Loading, Resolved, Error, Reloading. Napojení na signal vstupy.',
      tags: ['resource()', 'ResourceStatus', 'reload()', 'async'],
    },
    {
      path: '/http-resource', icon: '🌐', title: 'httpResource()',
      version: 'v20', versionClass: 'v20',
      desc: 'HTTP volání jako Signal. Reaktivně reaguje na změny URL/parametrů, automaticky cancelluje in-flight requesty.',
      tags: ['httpResource()', 'HttpClient', 'signal-based', 'reactive HTTP'],
    },
    {
      path: '/signal-forms', icon: '📝', title: 'Signal Forms',
      version: 'v21 new', versionClass: 'new',
      desc: 'Zcela nový přístup k formulářům. Model je WritableSignal, validace přes schema, template binding přes [formField] direktivu.',
      tags: ['form()', 'FormField', 'schema()', 'required()', 'email()'],
    },
  ];
}
