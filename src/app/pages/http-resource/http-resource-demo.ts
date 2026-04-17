import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { httpResource } from '@angular/common/http';

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

@Component({
  selector: 'app-http-resource-demo',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-page">
      <div class="page-header">
        <div class="version-badge">Angular v20 — Experimentální</div>
        <h1>🌐 httpResource()</h1>
        <p>
          HTTP volání jako Signal. Reaktivně reaguje na změny URL/parametrů, automaticky cancelluje
          in-flight requesty. Postaveno na <code>HttpClient</code>.
        </p>
      </div>

      <div class="warning-box">
        <strong>Experimentální API —</strong> <code>httpResource()</code> je v Angular v20/v21 stále
        experimentální. API se může změnit. Vyžaduje <code>provideHttpClient()</code> v app.config.
      </div>

      <div class="info-box">
        <strong>Výhody oproti resource() —</strong> httpResource() automaticky používá
        <code>HttpClient</code>
        (interceptory, testování, caching), parsuje JSON, má built-in abort, reactive URL.
        Nepotřebuješ manuálně volat fetch().
      </div>

      <!-- Demo 1: Základní httpResource -->
      <div class="section-title">
        Demo 1 — Reactive URL (todos by user)
        <span class="tag tag-experimental">experimental</span>
      </div>

      <div class="live-demo">
        <h4>Live demo — Todos reaktivně dle User ID</h4>
        <div class="controls">
          <label>User ID — změna automaticky spustí nový HTTP request</label>
          <div class="id-row">
            @for (id of [1, 2, 3, 4, 5]; track id) {
              <button
                class="btn"
                [class.btn-primary]="selectedUserId() === id"
                [class.btn-ghost]="selectedUserId() !== id"
                (click)="selectedUserId.set(id)"
              >
                User {{ id }}
              </button>
            }
          </div>
        </div>

        <div class="status-row">
          <span class="label-small">Status:</span>
          @switch (todosResource.status()) {
            @case ('loading') {
              <span class="status-chip status-chip-loading">⏳ Loading</span>
            }
            @case ('reloading') {
              <span class="status-chip status-chip-loading">🔄 Reloading</span>
            }
            @case ('resolved') {
              <span class="status-chip status-chip-success"
                >✅ {{ completedCount() }}/{{ todosResource.value()?.length ?? 0 }} splněno</span
              >
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
          <span class="label-small">URL:</span>
          <code class="url-display">{{ currentUrl() }}</code>
        </div>

        <div class="todos-list">
          @if (todosResource.isLoading()) {
            @for (s of [1, 2, 3, 4, 5]; track s) {
              <div class="skeleton"></div>
            }
          }
          @for (todo of (todosResource.value() ?? []).slice(0, 8); track todo.id) {
            <div class="todo-item" [class.done]="todo.completed">
              <span class="todo-check">{{ todo.completed ? '✅' : '⬜' }}</span>
              <span class="todo-title">{{ todo.title }}</span>
            </div>
          }
          @if ((todosResource.value()?.length ?? 0) > 8) {
            <div class="more-hint">+ {{ (todosResource.value()?.length ?? 0) - 8 }} dalších...</div>
          }
        </div>
      </div>

      <pre class="code-block">selectedUserId = <span style="color:#d2a8ff">signal</span>(1);

// httpResource — reaktivní URL (signal ve funkci)
todosResource = <span style="color:#d2a8ff">httpResource</span>&lt;Todo[]&gt;(
  () => \`https://jsonplaceholder.typicode.com/todos?userId=$&#123;this.selectedUserId()&#125;\`
);

// Přístup ke stavům (stejné jako resource()):
todosResource.value()     // Todo[] | undefined
todosResource.status()    // ResourceStatus
todosResource.isLoading() // boolean
todosResource.error()     // unknown</pre>

      <!-- Demo 2: POST request -->
      <div class="section-title">
        Demo 2 — httpResource s POST + headers
        <span class="tag tag-experimental">experimental</span>
      </div>

      <pre class="code-block">// httpResource s plným request objektem
userResource = <span style="color:#d2a8ff">httpResource</span>&lt;User&gt;(&#123;
  url: () => \`/api/users/$&#123;this.userId()&#125;\`,
  method: 'GET',
  headers: &#123; 'Authorization': \`Bearer $&#123;this.token()&#125;\` &#125;
&#125;);

// POST:
createTodo = <span style="color:#d2a8ff">httpResource</span>(&lcub;
  url: '/api/todos',
  method: 'POST',
  body: () => (&#123; title: this.newTitle(), completed: false &#125;)
&#125;);</pre>

      <!-- Demo 3: httpResource.text() a další parsery -->
      <div class="section-title">Varianty parsování odpovědi</div>
      <pre class="code-block">// JSON (výchozí)
jsonRes = <span style="color:#d2a8ff">httpResource</span>&lt;MyType&gt;('/api/data');

// Text
textRes = <span style="color:#d2a8ff">httpResource</span>.text('/api/text');

// Blob (soubory)
blobRes = <span style="color:#d2a8ff">httpResource</span>.blob('/api/file.pdf');

// ArrayBuffer
bufRes  = <span style="color:#d2a8ff">httpResource</span>.arrayBuffer('/api/binary');</pre>

      <!-- Srovnání resource vs httpResource -->
      <div class="section-title">resource() vs httpResource() — kdy co použít</div>
      <div class="compare-table">
        <div class="ct-header">
          <div>Kritérium</div>
          <div>resource()</div>
          <div>httpResource()</div>
        </div>
        @for (row of comparison; track row.label) {
          <div class="ct-row">
            <div class="ct-label">{{ row.label }}</div>
            <div [innerHTML]="row.resource"></div>
            <div [innerHTML]="row.http"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .controls {
        margin-bottom: 0.75rem;
      }
      .id-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-top: 0.4rem;
      }
      .status-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
        font-size: 0.85rem;
        color: var(--text-muted);
      }
      .label-small {
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-dim);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .url-display {
        font-family: 'Fira Code', monospace;
        font-size: 0.78rem;
        color: #60a5fa;
        background: var(--code);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
      }
      .todos-list {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        max-height: 280px;
        overflow-y: auto;
      }
      .todo-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
        &.done {
          opacity: 0.5;
        }
      }
      .todo-check {
        flex-shrink: 0;
      }
      .todo-title {
        color: var(--text-muted);
      }
      .todo-item.done .todo-title {
        text-decoration: line-through;
      }
      .more-hint {
        font-size: 0.78rem;
        color: var(--text-dim);
        text-align: center;
        padding: 0.4rem;
      }
      .skeleton {
        height: 38px;
        background: linear-gradient(90deg, var(--surface) 25%, var(--card) 50%, var(--surface) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 6px;
        border: 1px solid var(--border);
      }
      @keyframes shimmer {
        0% {
          background-position: 200%;
        }
        100% {
          background-position: -200%;
        }
      }
      .compare-table {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
        margin-top: 1rem;
      }
      .ct-header,
      .ct-row {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr;
        gap: 0;
      }
      .ct-header {
        background: var(--surface);
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-dim);
        letter-spacing: 0.06em;
      }
      .ct-header > *,
      .ct-row > * {
        padding: 0.6rem 0.9rem;
        border-bottom: 1px solid var(--border);
      }
      .ct-row:last-child > * {
        border-bottom: none;
      }
      .ct-label {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-muted);
      }
      .ct-row > :not(.ct-label) {
        font-size: 0.82rem;
        color: var(--text-muted);
      }
    `,
  ],
})
export class HttpResourceDemoComponent {
  selectedUserId = signal(1);

  currentUrl = computed(() => `...todos?userId=${this.selectedUserId()}`);

  todosResource = httpResource<Todo[]>(
    () => `https://jsonplaceholder.typicode.com/todos?userId=${this.selectedUserId()}`,
  );

  completedCount = computed(
    () => (this.todosResource.value() ?? []).filter((t) => t.completed).length,
  );

  comparison = [
    { label: 'Transport', resource: 'fetch() / vlastní', http: 'HttpClient' },
    { label: 'Interceptory', resource: '❌', http: '✅ plná podpora' },
    { label: 'Testing (mock)', resource: '❌ manuální', http: '✅ HttpTestingController' },
    { label: 'JSON parsing', resource: 'manuální', http: 'automatické' },
    { label: 'Abort', resource: 'abortSignal v loader', http: 'automatické' },
    {
      label: 'Kdy použít',
      resource: 'WebSocket, IndexedDB, vlastní async',
      http: 'REST API, HTTP volání',
    },
  ];
}
