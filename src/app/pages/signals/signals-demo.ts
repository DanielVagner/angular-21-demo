import {
  Component, signal, computed, effect, input, output, model,
  viewChild, ElementRef, ChangeDetectionStrategy
} from '@angular/core';
import { FormsModule } from '@angular/forms';

/* ── Child component showcasing input() / output() / model() ── */
@Component({
  selector: 'app-counter-child',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="child-box">
      <div class="child-label">Child — input() + output() + model()</div>
      <div class="child-row">
        <span class="child-info">Vstup: <code>{{ label() }}</code></span>
        <span class="child-info">model(): <code>{{ value() }}</code></span>
      </div>
      <div style="display:flex;gap:0.5rem;margin-top:0.75rem">
        <button class="btn btn-secondary" (click)="value.set(value() - 1)">−</button>
        <button class="btn btn-secondary" (click)="value.set(value() + 1)">+</button>
        <button class="btn btn-ghost" (click)="reset.emit()">Reset</button>
      </div>
    </div>
  `,
  styles: [`
    .child-box { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:1rem; }
    .child-label { font-size:0.75rem; color:var(--text-dim); font-weight:600; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.6rem; }
    .child-row { display:flex; gap:1.5rem; }
    .child-info { font-size:0.85rem; color:var(--text-muted); }
    code { font-family:'Fira Code',monospace; color:var(--accent); }
  `]
})
export class CounterChildComponent {
  label = input<string>('counter');
  value = model<number>(0);
  reset = output<void>();
}

/* ── Main demo component ── */
@Component({
  selector: 'app-signals-demo',
  imports: [FormsModule, CounterChildComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-page">
      <div class="page-header">
        <div class="version-badge">Angular v20 — Stable</div>
        <h1>⚡ Signals — plně stabilní API</h1>
        <p>
          Od Angular v20 jsou všechna reaktivní primitiva <strong style="color:var(--green)">stable</strong>.
          Žádné <code>signal()</code> z developer preview — jde do produkce.
        </p>
      </div>

      <!-- 1. signal + computed + effect -->
      <div class="section-title">
        signal() · computed() · effect()
        <span class="tag tag-stable">stable v20</span>
      </div>

      <div class="info-box">
        <strong>v17 vs v20 —</strong> V17 jsme ukazovali základy. Dnes jsou stable a AppRef change detection
        funguje zoneless — žádný Zone.js není potřeba (viz <code>provideZonelessChangeDetection()</code> v app.config).
      </div>

      <div class="live-demo">
        <h4>Live demo</h4>
        <div class="demo-row">
          <div class="demo-col">
            <div class="label-row">
              <label>Počet kliků</label>
              <span class="value-display">{{ count() }}</span>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary" (click)="count.update(v => v + 1)">Přidat +1</button>
              <button class="btn btn-secondary" (click)="count.set(0)">Reset</button>
            </div>
          </div>
          <div class="demo-col">
            <label>computed() — odvozená hodnota</label>
            <div class="computed-vals">
              <div class="cv-item"><span>doubled</span><span class="value-display">{{ doubled() }}</span></div>
              <div class="cv-item"><span>squared</span><span class="value-display">{{ squared() }}</span></div>
              <div class="cv-item"><span>isEven</span><span class="value-display" [style.color]="isEven() ? 'var(--green)' : 'var(--yellow)'">{{ isEven() }}</span></div>
            </div>
          </div>
        </div>

        <div class="effect-log">
          <div class="effect-label">effect() log <span class="effect-badge">side effects</span></div>
          <div class="log-entries">
            @for (entry of effectLog(); track $index) {
              <div class="log-entry">{{ entry }}</div>
            }
            @if (effectLog().length === 0) {
              <div class="log-empty">Zatím žádný effect. Klikni na tlačítko výše.</div>
            }
          </div>
        </div>
      </div>

      <pre class="code-block">// signal() — základ reaktivního stavu
count = <span style="color:#d2a8ff">signal</span>(0);

// computed() — odvozená hodnota (read-only, líně vyhodnocená)
doubled = <span style="color:#d2a8ff">computed</span>(() => this.count() * 2);
squared = <span style="color:#d2a8ff">computed</span>(() => this.count() ** 2);

// effect() — vedlejší efekty, běží když se signal změní
<span style="color:#d2a8ff">effect</span>(() => console.log('count =', this.count()));</pre>

      <!-- 2. Signal-based component API -->
      <div class="section-title">
        input() · output() · model() · viewChild()
        <span class="tag tag-stable">stable v20</span>
      </div>

      <div class="info-box">
        <strong>Nová API pro komponenty —</strong> Nahrazují dekorátory <code>&#64;Input()</code>,
        <code>&#64;Output()</code> a <code>&#64;ViewChild()</code>. Všechno je typové,
        signal-based a lépe interaguje s <code>computed()</code>.
      </div>

      <div class="live-demo">
        <h4>Live demo — model() two-way binding</h4>
        <app-counter-child
          label="prezentace"
          [(value)]="childValue"
          (reset)="childValue.set(0)"
        />
        <div style="margin-top:0.75rem; font-size:0.85rem; color:var(--text-muted)">
          Hodnota v rodiči (model binding):
          <span class="value-display" style="margin-left:0.5rem">{{ childValue() }}</span>
        </div>
      </div>

      <pre class="code-block">// input() — signal-based vstup (bylo: &#64;Input())
label = <span style="color:#d2a8ff">input</span>&lt;string&gt;('counter');
required = <span style="color:#d2a8ff">input</span>.<span style="color:#d2a8ff">required</span>&lt;number&gt;();

// output() — signal-based výstup (bylo: &#64;Output() EventEmitter)
reset = <span style="color:#d2a8ff">output</span>&lt;void&gt;();

// model() — two-way binding signal (bylo: &#64;Input() + &#64;Output() Change)
value = <span style="color:#d2a8ff">model</span>&lt;number&gt;(0);

// viewChild() — template query jako signal (bylo: &#64;ViewChild())
myInput = <span style="color:#d2a8ff">viewChild</span>&lt;ElementRef&gt;('myInput');</pre>

      <!-- 3. viewChild demo -->
      <div class="live-demo">
        <h4>Live demo — viewChild()</h4>
        <input #myInput class="input-field" placeholder="Napiš něco..." style="max-width:280px" />
        <div class="btn-row">
          <button class="btn btn-secondary" (click)="focusInput()">Focus input (přes viewChild)</button>
          <button class="btn btn-ghost" (click)="readInput()">Přečíst hodnotu</button>
        </div>
        @if (inputValue()) {
          <div class="success-msg">Přečteno přes viewChild: "{{ inputValue() }}"</div>
        }
      </div>

      <pre class="code-block">// Template: &lt;input #myInput ... /&gt;
myInput = <span style="color:#d2a8ff">viewChild</span>&lt;ElementRef&gt;('myInput');

focusInput() &#123;
  this.myInput()?.nativeElement.focus();
&#125;</pre>
    </div>
  `,
  styles: [`
    .demo-row { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
    @media(max-width:600px) { .demo-row { grid-template-columns:1fr; } }
    .demo-col {}
    .label-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; }
    .computed-vals { display:flex; flex-direction:column; gap:0.4rem; }
    .cv-item { display:flex; align-items:center; justify-content:space-between; font-size:0.875rem; color:var(--text-muted); }
    .effect-log { margin-top:1.25rem; background:var(--code); border:1px solid var(--border); border-radius:8px; padding:0.75rem 1rem; }
    .effect-label { font-size:0.78rem; font-weight:600; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem; }
    .effect-badge { background:rgba(168,85,247,0.15); color:#c084fc; padding:0.1rem 0.45rem; border-radius:20px; font-size:0.65rem; }
    .log-entries { max-height:100px; overflow-y:auto; }
    .log-entry { font-size:0.8rem; font-family:'Fira Code',monospace; color:#79c0ff; padding:0.1rem 0; }
    .log-empty { font-size:0.8rem; color:var(--text-dim); font-style:italic; }
  `]
})
export class SignalsDemoComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);
  squared = computed(() => this.count() ** 2);
  isEven = computed(() => this.count() % 2 === 0);
  effectLog = signal<string[]>([]);

  childValue = signal(0);
  myInput = viewChild<ElementRef>('myInput');
  inputValue = signal('');

  constructor() {
    effect(() => {
      const val = this.count();
      this.effectLog.update(log => [
        `[${new Date().toLocaleTimeString()}] count změněn na ${val}`,
        ...log.slice(0, 4),
      ]);
    });
  }

  focusInput() {
    this.myInput()?.nativeElement.focus();
  }

  readInput() {
    this.inputValue.set(this.myInput()?.nativeElement.value ?? '');
  }
}
