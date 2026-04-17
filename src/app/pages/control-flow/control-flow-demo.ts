import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

interface User {
  id: number;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
}

@Component({
  selector: 'app-control-flow-demo',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-page">
      <div class="page-header">
        <div class="version-badge">Angular v17+ · Vylepšeno v19</div>
        <h1>🔀 Control Flow + @defer</h1>
        <p>
          Nová built-in template syntaxe nahrazuje <code>*ngIf</code>, <code>*ngFor</code>, <code>NgSwitch</code>.
          V Angular v19 přibyly <strong>hydration triggery pro @defer</strong>.
        </p>
      </div>

      <!-- @if -->
      <div class="section-title">
        @if / @else if / @else
        <span class="tag tag-stable">stable</span>
      </div>
      <div class="info-box">
        <strong>Proč lepší než *ngIf? —</strong> Výkon (kompilátor generuje menší kód), čitelnější template,
        bez nutnosti importovat <code>NgIf</code>, @else if bez extra direktivy.
      </div>
      <div class="live-demo">
        <h4>Live demo</h4>
        <div class="btn-row">
          @for (r of roles; track r) {
            <button class="btn" [class.btn-primary]="selectedRole() === r" [class.btn-ghost]="selectedRole() !== r" (click)="selectedRole.set(r)">
              {{ r }}
            </button>
          }
        </div>
        <div class="role-result">
          @if (selectedRole() === 'admin') {
            <div class="role-badge admin">🛡️ Admin — plný přístup</div>
          } @else if (selectedRole() === 'editor') {
            <div class="role-badge editor">✏️ Editor — může editovat obsah</div>
          } @else if (selectedRole() === 'viewer') {
            <div class="role-badge viewer">👁️ Viewer — pouze čtení</div>
          } @else {
            <div class="role-badge none">Vyber roli výše</div>
          }
        </div>
      </div>
      <pre class="code-block">@if (role === 'admin') &#123;
  &lt;div&gt;Plný přístup&lt;/div&gt;
&#125; @else if (role === 'editor') &#123;
  &lt;div&gt;Editor&lt;/div&gt;
&#125; @else &#123;
  &lt;div&gt;Viewer&lt;/div&gt;
&#125;</pre>

      <!-- @for -->
      <div class="section-title">
        @for s track + $index, $first, $last, $odd, $even
        <span class="tag tag-stable">stable</span>
      </div>
      <div class="live-demo">
        <h4>Live demo — seznam uživatelů</h4>
        <div class="btn-row">
          <button class="btn btn-secondary" (click)="addUser()">+ Přidat</button>
          <button class="btn btn-ghost" (click)="removeUser()">− Odebrat</button>
        </div>
        <div class="user-list">
          @for (user of users(); track user.id; let i = $index; let first = $first; let last = $last) {
            <div class="user-item" [class.first]="first" [class.last]="last">
              <span class="user-idx">#{{ i + 1 }}</span>
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role" [class]="'role-' + user.role">{{ user.role }}</span>
              <span class="user-status" [class.active]="user.active">{{ user.active ? '●' : '○' }}</span>
              @if (first) { <span class="user-badge">first</span> }
              @if (last)  { <span class="user-badge">last</span> }
            </div>
          } @empty {
            <div class="user-empty">Žádní uživatelé. Přidej pomocí tlačítka.</div>
          }
        </div>
      </div>
      <pre class="code-block">@for (user of users; track user.id; let i = $index; let first = $first) &#123;
  &lt;div&gt;#&#123;&#123;i+1&#125;&#125; &#123;&#123;user.name&#125;&#125;&lt;/div&gt;
&#125; @empty &#123;
  &lt;div&gt;Žádní uživatelé&lt;/div&gt;
&#125;</pre>

      <!-- @switch -->
      <div class="section-title">@switch</div>
      <div class="live-demo">
        <h4>Live demo</h4>
        <div class="btn-row">
          @for (s of statuses; track s) {
            <button class="btn" [class.btn-primary]="currentStatus() === s" [class.btn-ghost]="currentStatus() !== s" (click)="currentStatus.set(s)">{{ s }}</button>
          }
        </div>
        @switch (currentStatus()) {
          @case ('loading') { <div class="status-chip status-chip-loading">⏳ Načítání dat...</div> }
          @case ('success') { <div class="status-chip status-chip-success">✅ Data načtena</div> }
          @case ('error')   { <div class="status-chip status-chip-error">❌ Chyba při načítání</div> }
          @default          { <div class="status-chip status-chip-idle">💤 Idle</div> }
        }
      </div>

      <!-- @defer -->
      <div class="section-title">
        @defer — lazy loading + hydration triggery
        <span class="tag tag-new">v19 nové triggery</span>
      </div>
      <div class="info-box">
        <strong>v19 hydration triggery —</strong> Nový <code>@defer (hydrate on ...)</code> blok umožňuje
        selektivní hydrataci server-side rendered komponent. Lazy loading se spustí na základě uživatelské interakce.
      </div>

      <pre class="code-block">// on idle — načti když je prohlížeč volný
@defer (on idle) &#123;
  &lt;heavy-component /&gt;
&#125; @placeholder &#123;
  &lt;div&gt;Placeholder...&lt;/div&gt;
&#125; @loading (minimum 300ms) &#123;
  &lt;spinner /&gt;
&#125; @error &#123;
  &lt;div&gt;Chyba při načítání&lt;/div&gt;
&#125;

// on viewport — načti když je viditelný
@defer (on viewport) &#123; ... &#125;

// on interaction — načti při kliknutí
@defer (on interaction(btn)) &#123; ... &#125;

// when — načti když je podmínka true
@defer (when isLoggedIn()) &#123; ... &#125;

// prefetch — přednačti ale zobraz až později
@defer (on viewport; prefetch on idle) &#123; ... &#125;

// 🔥 NOVÉ v19 — hydration triggery pro SSR
@defer (hydrate on viewport) &#123; ... &#125;
@defer (hydrate on interaction) &#123; ... &#125;
@defer (hydrate when condition()) &#123; ... &#125;
@defer (hydrate never) &#123; ... &#125;  // zůstane static HTML</pre>

      <div class="live-demo">
        <h4>Live demo — @defer (when condition)</h4>
        <div class="defer-state">
          Stav: <span class="status-chip" [class]="'status-chip-' + deferState()">{{ deferState() }}</span>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" (click)="showDeferred.set(true)">Spustit @defer</button>
          <button class="btn btn-ghost" (click)="showDeferred.set(false)">Reset</button>
        </div>

        @defer (when showDeferred()) {
          <div class="deferred-content">
            🎉 Tento blok byl lazy-loaded přes <code>@defer (when showDeferred())</code>
          </div>
        } @placeholder {
          <div class="placeholder-block">📋 Placeholder — viditelný před spuštěním defer</div>
        } @loading {
          <div class="loading-block">⏳ Loading...</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .role-result { margin-top:0.75rem; }
    .role-badge {
      display:inline-flex; align-items:center; gap:0.5rem;
      padding:0.6rem 1rem; border-radius:8px; font-size:0.9rem; font-weight:500;
      &.admin  { background:rgba(239,68,68,0.1); color:#fca5a5; border:1px solid rgba(239,68,68,0.2); }
      &.editor { background:rgba(59,130,246,0.1); color:#93c5fd; border:1px solid rgba(59,130,246,0.2); }
      &.viewer { background:rgba(34,197,94,0.1); color:#86efac; border:1px solid rgba(34,197,94,0.2); }
      &.none   { background:var(--surface); color:var(--text-dim); border:1px solid var(--border); }
    }
    .user-list { display:flex; flex-direction:column; gap:0.4rem; margin-top:0.75rem; }
    .user-item {
      display:flex; align-items:center; gap:0.75rem;
      background:var(--surface); border:1px solid var(--border); border-radius:8px;
      padding:0.5rem 0.75rem; font-size:0.875rem;
      &.first { border-color:rgba(34,197,94,0.3); }
      &.last  { border-color:rgba(59,130,246,0.3); }
    }
    .user-idx { color:var(--text-dim); font-family:'Fira Code',monospace; width:24px; }
    .user-name { flex:1; color:var(--text); font-weight:500; }
    .user-role {
      font-size:0.72rem; padding:0.1rem 0.5rem; border-radius:20px; font-weight:600;
      &.role-admin  { background:rgba(239,68,68,0.12); color:#fca5a5; }
      &.role-editor { background:rgba(59,130,246,0.12); color:#93c5fd; }
      &.role-viewer { background:rgba(34,197,94,0.12); color:#86efac; }
    }
    .user-status { font-size:0.8rem; &.active { color:var(--green); } color:var(--text-dim); }
    .user-badge { font-size:0.65rem; background:rgba(168,85,247,0.12); color:#c084fc; padding:0.1rem 0.4rem; border-radius:4px; }
    .user-empty { color:var(--text-dim); font-style:italic; font-size:0.875rem; padding:0.5rem 0; }
    .defer-state { margin-bottom:0.75rem; display:flex; align-items:center; gap:0.75rem; font-size:0.875rem; color:var(--text-muted); }
    .deferred-content {
      background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2);
      border-radius:8px; padding:1rem; color:#86efac; margin-top:0.75rem;
      code { font-family:'Fira Code',monospace; color:#4ade80; }
    }
    .placeholder-block {
      background:var(--surface); border:1px dashed var(--border);
      border-radius:8px; padding:1rem; color:var(--text-dim); margin-top:0.75rem;
    }
    .loading-block {
      background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2);
      border-radius:8px; padding:1rem; color:#fcd34d; margin-top:0.75rem;
    }
  `]
})
export class ControlFlowDemoComponent {
  roles = ['admin', 'editor', 'viewer'] as const;
  selectedRole = signal<string>('');

  statuses = ['idle', 'loading', 'success', 'error'] as const;
  currentStatus = signal<string>('idle');

  showDeferred = signal(false);
  deferState = signal<'idle' | 'loading' | 'success'>('idle');

  private allUsers: User[] = [
    { id: 1, name: 'Petr Novák',   role: 'admin',  active: true },
    { id: 2, name: 'Jana Svobodá', role: 'editor', active: true },
    { id: 3, name: 'Tomáš Kovář',  role: 'viewer', active: false },
    { id: 4, name: 'Eva Procházka',role: 'editor', active: true },
    { id: 5, name: 'Marek Beneš',  role: 'viewer', active: true },
  ];

  users = signal<User[]>(this.allUsers.slice(0, 3));

  addUser() {
    const cur = this.users();
    if (cur.length < this.allUsers.length) {
      this.users.set(this.allUsers.slice(0, cur.length + 1));
    }
  }

  removeUser() {
    const cur = this.users();
    if (cur.length > 0) {
      this.users.set(cur.slice(0, cur.length - 1));
    }
  }
}
