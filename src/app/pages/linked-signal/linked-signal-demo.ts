import { Component, signal, computed, linkedSignal, ChangeDetectionStrategy } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-linked-signal-demo',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-page">
      <div class="page-header">
        <div class="version-badge">Angular v19</div>
        <h1>🔗 linkedSignal()</h1>
        <p>
          <strong>WritableSignal odvozený z jiného signalu.</strong>
          Na rozdíl od <code>computed()</code> (read-only) lze hodnotu i ručně přepsat —
          ale automaticky se resetuje když se zdrojový signal změní.
        </p>
      </div>

      <div class="info-box">
        <strong>Problém s computed() —</strong> computed() je read-only. Nemůžeš napsat
        <code>doubled.set(10)</code>. To je správně pro čisté derivace, ale co třeba
        "výchozí hodnota závisí na vstupu, ale uživatel ji může přepsat"?
        Pro to přesně je <code>linkedSignal()</code>.
      </div>

      <div class="section-title">
        computed() vs linkedSignal()
        <span class="tag tag-stable">stable v20</span>
      </div>

      <div class="comparison">
        <div class="comp-col">
          <div class="comp-header comp-red">computed() — read-only</div>
          <pre class="code-block" style="margin:0">doubled = <span style="color:#d2a8ff">computed</span>(() => count() * 2);
// doubled.set(10); ← CHYBA! Read-only</pre>
        </div>
        <div class="comp-col">
          <div class="comp-header comp-green">linkedSignal() — writable</div>
          <pre class="code-block" style="margin:0">doubled = <span style="color:#d2a8ff">linkedSignal</span>(() => count() * 2);
// doubled.set(10); ← OK! Lze přepsat
// Po změně count() se hodnota znovu odvodí</pre>
        </div>
      </div>

      <!-- Demo 1: Jednoduché počítadlo -->
      <div class="section-title">Demo 1 — Resettable odvozený stav</div>
      <div class="live-demo">
        <h4>Live demo</h4>
        <div class="demo-grid">
          <div class="demo-col">
            <label>Základní hodnota (signal)</label>
            <div class="val-row">
              <span class="value-display">{{ base() }}</span>
              <div class="btn-row" style="margin:0">
                <button class="btn btn-secondary" (click)="base.update(v => v - 1)">−</button>
                <button class="btn btn-secondary" (click)="base.update(v => v + 1)">+</button>
              </div>
            </div>
          </div>
          <div class="demo-col">
            <label>linkedSignal × 2 (lze přepsat)</label>
            <div class="val-row">
              <span class="value-display" style="color:var(--green)">{{ linkedDouble() }}</span>
              <div class="btn-row" style="margin:0">
                <button class="btn btn-ghost" (click)="linkedDouble.set(0)">Nastavit na 0</button>
                <button class="btn btn-ghost" (click)="linkedDouble.set(999)">Nastavit na 999</button>
              </div>
            </div>
            <div class="hint">↑ Přepis funguje, ale změní-li se base, hodnota se znovu odvodí</div>
          </div>
        </div>
      </div>

      <pre class="code-block">base = <span style="color:#d2a8ff">signal</span>(5);

// linkedSignal — odvozuje se z base, ale lze i přepsat
linkedDouble = <span style="color:#d2a8ff">linkedSignal</span>(() => this.base() * 2);

// Manuální přepis:
this.linkedDouble.<span style="color:#d2a8ff">set</span>(999);  // OK!

// Ale změna base() znovu odvodí hodnotu:
this.base.set(10);  // linkedDouble() === 20 (znovu odvozeno)</pre>

      <!-- Demo 2: Realistický use-case — produkt se slevou -->
      <div class="section-title">Demo 2 — Realistický případ: produkt + sleva</div>
      <div class="info-box">
        Výchozí sleva závisí na vybraném produktu, ale uživatel ji může ručně upravit.
        Při přepnutí produktu se sleva resetuje na výchozí pro daný produkt.
      </div>
      <div class="live-demo">
        <h4>Live demo — E-shop: produkt + custom sleva</h4>
        <div class="product-grid">
          @for (p of products; track p.id) {
            <button
              class="product-btn"
              [class.selected]="selectedProduct().id === p.id"
              (click)="selectedProduct.set(p)"
            >
              <span class="p-name">{{ p.name }}</span>
              <span class="p-price">{{ p.price }} Kč</span>
            </button>
          }
        </div>

        <div class="discount-row">
          <label>Sleva (%) — linkedSignal, výchozí dle produktu</label>
          <div class="discount-controls">
            <span class="value-display" style="color:var(--yellow)">{{ discount() }}%</span>
            <button class="btn btn-ghost" (click)="discount.update(v => Math.max(0, v - 5))">−5%</button>
            <button class="btn btn-ghost" (click)="discount.update(v => Math.min(50, v + 5))">+5%</button>
            <button class="btn btn-secondary" (click)="resetDiscount()">Reset výchozí</button>
          </div>
          <div class="hint">Výchozí sleva produktu: <strong>{{ defaultDiscount() }}%</strong> — přepnutím produktu se sleva resetuje</div>
        </div>

        <div class="price-summary">
          <div class="price-row">
            <span>Cena produktu</span>
            <span>{{ selectedProduct().price }} Kč</span>
          </div>
          <div class="price-row">
            <span>Sleva ({{ discount() }}%)</span>
            <span style="color:var(--green)">−{{ discountAmount() }} Kč</span>
          </div>
          <div class="price-row total">
            <span>Celkem</span>
            <span style="color:var(--accent)">{{ finalPrice() }} Kč</span>
          </div>
        </div>
      </div>

      <pre class="code-block">selectedProduct = <span style="color:#d2a8ff">signal</span>(products[0]);

// Výchozí sleva závisí na produktu
defaultDiscount = <span style="color:#d2a8ff">computed</span>(() => getDefaultDiscount(this.selectedProduct()));

// linkedSignal — výchozí hodnota = defaultDiscount, ale lze přepsat
// Při změně selectedProduct() se automaticky resetuje na defaultDiscount()
discount = <span style="color:#d2a8ff">linkedSignal</span>(() => this.defaultDiscount());

finalPrice = <span style="color:#d2a8ff">computed</span>(() =>
  Math.round(this.selectedProduct().price * (1 - this.discount() / 100))
);</pre>
    </div>
  `,
  styles: [`
    .comparison { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1rem 0; }
    @media(max-width:600px) { .comparison { grid-template-columns:1fr; } }
    .comp-col {}
    .comp-header { font-size:0.8rem; font-weight:700; padding:0.4rem 0.75rem; border-radius:6px 6px 0 0; }
    .comp-red   { background:rgba(239,68,68,0.15); color:#fca5a5; }
    .comp-green { background:rgba(34,197,94,0.15); color:#86efac; }
    .comp-col .code-block { border-radius:0 0 6px 6px; border-top:none; }
    .demo-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
    @media(max-width:600px) { .demo-grid { grid-template-columns:1fr; } }
    .val-row { display:flex; align-items:center; gap:0.75rem; margin-top:0.4rem; }
    .hint { font-size:0.78rem; color:var(--text-dim); margin-top:0.4rem; font-style:italic; }
    .product-grid { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem; }
    .product-btn {
      display:flex; flex-direction:column; align-items:flex-start;
      background:var(--surface); border:1px solid var(--border);
      border-radius:8px; padding:0.6rem 0.9rem; cursor:pointer; transition:all 0.15s;
      &:hover { border-color:var(--accent); }
      &.selected { border-color:var(--accent); background:rgba(221,0,49,0.08); }
    }
    .p-name { font-size:0.875rem; font-weight:500; color:var(--text); }
    .p-price { font-size:0.78rem; color:var(--text-muted); margin-top:0.1rem; }
    .discount-row { margin-bottom:1.25rem; }
    .discount-controls { display:flex; align-items:center; gap:0.5rem; margin:0.4rem 0; flex-wrap:wrap; }
    .price-summary { background:var(--surface); border:1px solid var(--border); border-radius:8px; overflow:hidden; }
    .price-row { display:flex; justify-content:space-between; padding:0.6rem 1rem; font-size:0.875rem; color:var(--text-muted); border-bottom:1px solid var(--border); &:last-child { border-bottom:none; } }
    .price-row.total { color:var(--text); font-weight:600; font-size:1rem; }
  `]
})
export class LinkedSignalDemoComponent {
  base = signal(5);
  linkedDouble = linkedSignal(() => this.base() * 2);

  products: Product[] = [
    { id: 1, name: 'Základní plán', price: 990 },
    { id: 2, name: 'Pro plán', price: 1990 },
    { id: 3, name: 'Enterprise', price: 4990 },
  ];

  selectedProduct = signal<Product>(this.products[0]);

  defaultDiscount = computed(() => {
    const p = this.selectedProduct();
    if (p.price < 1000) return 5;
    if (p.price < 3000) return 10;
    return 20;
  });

  discount = linkedSignal(() => this.defaultDiscount());

  discountAmount = computed(() =>
    Math.round(this.selectedProduct().price * this.discount() / 100)
  );

  finalPrice = computed(() =>
    Math.round(this.selectedProduct().price * (1 - this.discount() / 100))
  );

  resetDiscount() {
    this.discount.set(this.defaultDiscount());
  }
}
