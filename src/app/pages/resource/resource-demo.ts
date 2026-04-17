import { Component, signal, resource, ChangeDetectionStrategy } from '@angular/core';
import { SlicePipe } from '@angular/common';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Component({
  selector: 'app-resource-demo',
  imports: [SlicePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-page">
      <div class="page-header">
        <div class="version-badge">Angular v20 — Stable</div>
        <h1>📦 resource() API</h1>
        <p>
          Reaktivní správa asynchronních dat se Signal-based stavem.
          Automaticky sleduje <strong>Loading, Resolved, Error, Reloading</strong> stavy.
        </p>
      </div>

      <div class="info-box">
        <strong>Co řeší resource()? —</strong> Dříve jsi musel sám spravovat
        <code>isLoading</code>, <code>data</code>, <code>error</code> signály + effect pro fetch.
        <code>resource()</code> tohle dělá automaticky a reaktivně reaguje na změny vstupů.
      </div>

      <div class="section-title">
        Základní resource() s reaktivním vstupem
        <span class="tag tag-stable">stable v20</span>
      </div>

      <div class="live-demo">
        <h4>Live demo — Posts API (JSONPlaceholder)</h4>

        <div class="controls">
          <label>User ID (mění se → resource se znovu načte)</label>
          <div class="id-controls">
            @for (id of [1, 2, 3, 4, 5]; track id) {
              <button
                class="btn"
                [class.btn-primary]="userId() === id"
                [class.btn-ghost]="userId() !== id"
                (click)="userId.set(id)">
                User {{ id }}
              </button>
            }
            <button class="btn btn-secondary" (click)="postsResource.reload()">🔄 Reload</button>
          </div>
        </div>

        <div class="status-row">
          Status:
          @switch (postsResource.status()) {
            @case ('loading') {
              <span class="status-chip status-chip-loading">⏳ Loading</span>
            }
            @case ('reloading') {
              <span class="status-chip status-chip-loading">🔄 Reloading</span>
            }
            @case ('resolved') {
              <span class="status-chip status-chip-success">✅ Resolved</span>
            }
            @case ('error') {
              <span class="status-chip status-chip-error">❌ Error</span>
            }
            @case ('idle') {
              <span class="status-chip status-chip-idle">💤 Idle</span>
            }
            @case ('local') {
              <span class="status-chip status-chip-success">✏️ Local</span>
            }
          }

          @if (postsResource.isLoading()) {
            <span class="loading-dots">●●●</span>
          }
        </div>

        @if (postsResource.error(); as error) {
          <div class="error-msg" style="margin-top:0.75rem">
            {{ error.message }}
          </div>
        }

        <div class="posts-list">
          @if (postsResource.isLoading() && !postsResource.hasValue()) {
            @for (s of skeletons; track s) {
              <div class="post-skeleton"></div>
            }
          }

          @if (postsResource.hasValue()) {
            @for (post of postsResource.value(); track post.id) {
              <div class="post-card" [class.fading]="postsResource.isLoading()">
                <div class="post-num">#{{ post.id }}</div>
                <div class="post-body">
                  <div class="post-title">{{ post.title }}</div>
                  <div class="post-excerpt">{{ post.body | slice:0:80 }}...</div>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .controls { margin-bottom:1rem; }
    .id-controls { display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.4rem; }
    .status-row { display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem; font-size:0.875rem; color:var(--text-muted); }
    .loading-dots { color:var(--yellow); animation:blink 1s infinite; font-size:0.75rem; letter-spacing:3px; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
    .posts-list { display:flex; flex-direction:column; gap:0.5rem; max-height:320px; overflow-y:auto; }

    .post-card {
      display:flex;
      gap:0.75rem;
      background:var(--surface);
      border:1px solid var(--border);
      border-radius:8px;
      padding:0.75rem;
      transition:opacity 0.3s;
    }

    .post-card.fading {
      opacity:0.5;
    }

    .post-num { font-family:'Fira Code',monospace; font-size:0.8rem; color:var(--text-dim); min-width:30px; }
    .post-title { font-size:0.875rem; font-weight:500; color:var(--text); margin-bottom:0.25rem; }
    .post-excerpt { font-size:0.8rem; color:var(--text-muted); }

    .post-skeleton {
      height:60px;
      background:linear-gradient(90deg, var(--surface) 25%, var(--card) 50%, var(--surface) 75%);
      background-size:200% 100%;
      animation:shimmer 1.5s infinite;
      border-radius:8px;
      border:1px solid var(--border);
    }

    @keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }

    .status-diagram { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:0.75rem; margin-top:1rem; }
    .state-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:0.75rem; }
    .state-name { font-weight:600; font-size:0.875rem; margin-bottom:0.25rem; }
    .state-desc { font-size:0.78rem; color:var(--text-muted); }
    .state-idle .state-name { color:var(--text-dim); }
    .state-loading .state-name { color:var(--yellow); }
    .state-resolved .state-name { color:var(--green); }
    .state-error .state-name { color:var(--red); }
    .state-reload .state-name { color:#60a5fa; }
  `]
})
export class ResourceDemoComponent {
  readonly skeletons = [1, 2, 3];

  readonly userId = signal(1);

  readonly postsResource = resource<Post[], { userId: number }>({
    params: () => ({ userId: this.userId() }),
    loader: async ({ params, abortSignal }) => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${params.userId}`,
        { signal: abortSignal }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return res.json() as Promise<Post[]>;
    }
  });

  readonly statusStates = [
    { name: 'Idle', color: 'idle', desc: 'params() vrátilo undefined, žádné volání' },
    { name: 'Loading', color: 'loading', desc: 'První načítání dat' },
    { name: 'Resolved', color: 'resolved', desc: 'Data úspěšně načtena' },
    { name: 'Error', color: 'error', desc: 'Loader hodil chybu' },
    { name: 'Reloading', color: 'reload', desc: 'Reload — stará data stále dostupná' },
    { name: 'Local', color: 'resolved', desc: 'Hodnota byla upravena lokálně přes set/update' },
  ];
}