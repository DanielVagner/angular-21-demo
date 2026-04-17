import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField, required, email, minLength, maxLength } from '@angular/forms/signals';

interface RegistrationModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-signal-forms-demo',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-page">
      <div class="page-header">
        <div class="version-badge">Angular v21 — Experimentální 🔥</div>
        <h1>📝 Signal Forms</h1>
        <p>
          Zcela nový přístup k formulářům. Model je <code>WritableSignal</code>,
          validace přes <code>schema()</code>, template binding přes <code>[formField]</code> direktivu.
          <strong>Žádné FormGroup, FormControl, FormBuilder!</strong>
        </p>
      </div>

      <div class="warning-box">
        <strong>Experimentální API —</strong> Signal Forms jsou experimentální od Angular v21.
        Import: <code>import &#123; form, FormField, required, email &#125; from '&#64;angular/forms/signals'</code>
      </div>

      <div class="info-box">
        <strong>Před v21 — Reactive Forms: </strong>
        Musel jsi vytvořit <code>FormBuilder</code>, mapovat na <code>FormGroup</code>,
        přistupovat přes <code>this.form.get('email')?.value</code>, přidávat Validators separátně...
        <br><br>
        <strong>Signal Forms v21: </strong>
        Model je prostý TS objekt v signalu. Validace je součástí schema. Hodnoty čteš přes signal API.
        Template binding přes <code>[formField]</code> — žádné <code>formControlName</code>.
      </div>

      <!-- Comparison -->
      <div class="section-title">Srovnání: Reactive Forms vs Signal Forms</div>
      <div class="side-by-side">
        <div class="sbs-col">
          <div class="sbs-header old">❌ Reactive Forms (starý způsob)</div>
          <pre class="code-block" style="margin:0;border-radius:0 0 8px 8px">// Component
form = this.fb.group(&#123;
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]]
&#125;);

// Template
&lt;input formControlName="email" /&gt;
&lt;div *ngIf="form.get('email')?.errors?.['required']"&gt;
  Povinné pole
&lt;/div&gt;</pre>
        </div>
        <div class="sbs-col">
          <div class="sbs-header new">✅ Signal Forms v21 (nový způsob)</div>
          <pre class="code-block" style="margin:0;border-radius:0 0 8px 8px">// Component
model = signal(&#123; email: '', password: '' &#125;);
myForm = form(this.model, (f) => &#123;
  required(f.email);
  email(f.email);
  required(f.password);
  minLength(f.password, 8);
&#125;);

// Template
&lt;input [formField]="myForm.email" /&gt;
&#64;if (myForm.email().errors()?.required) &#123;
  &lt;span&gt;Povinné pole&lt;/span&gt;
&#125;</pre>
        </div>
      </div>

      <!-- Live demo -->
      <div class="section-title">
        Live Demo — Registrační formulář
        <span class="tag tag-new">v21</span>
      </div>

      <div class="live-demo">
        <h4>Registrace — Signal Forms</h4>
        <div class="form-grid">
          <!-- firstName -->
          <div class="form-field">
            <label>Jméno <span class="req">*</span></label>
            <input
              type="text"
              class="input-field"
              [formField]="regForm.firstName"
              placeholder="Jan"
            />
            @if (regForm.firstName().dirty() && regForm.firstName().errors().some(e => e.kind === 'required')) {
              <div class="error-msg">⚠ Jméno je povinné</div>
            }
            @if (regForm.firstName().dirty() && regForm.firstName().errors().some(e => e.kind === 'minLength')) {
              <div class="error-msg">⚠ Minimálně 2 znaky</div>
            }
          </div>

          <!-- lastName -->
          <div class="form-field">
            <label>Příjmení <span class="req">*</span></label>
            <input
              type="text"
              class="input-field"
              [formField]="regForm.lastName"
              placeholder="Novák"
            />
            @if (regForm.lastName().dirty() && regForm.lastName().errors().some(e => e.kind === 'required')) {
              <div class="error-msg">⚠ Příjmení je povinné</div>
            }
          </div>

          <!-- email -->
          <div class="form-field">
            <label>Email <span class="req">*</span></label>
            <input
              type="email"
              class="input-field"
              [formField]="regForm.email"
              placeholder="jan@example.com"
            />
            @if (regForm.email().dirty() && regForm.email().errors().some(e => e.kind === 'required')) {
              <div class="error-msg">⚠ Email je povinný</div>
            }
            @if (regForm.email().dirty() && regForm.email().errors().some(e => e.kind === 'email')) {
              <div class="error-msg">⚠ Neplatný formát emailu</div>
            }
          </div>

          <!-- password -->
          <div class="form-field">
            <label>Heslo <span class="req">*</span></label>
            <input
              type="password"
              class="input-field"
              [formField]="regForm.password"
              placeholder="min. 8 znaků"
            />
            @if (regForm.password().dirty() && regForm.password().errors()?.['required']) {
              <div class="error-msg">⚠ Heslo je povinné</div>
            }
            @if (regForm.password().dirty() && regForm.password().errors()?.['minLength']) {
              <div class="error-msg">⚠ Minimálně 8 znaků</div>
            }
          </div>
        </div>

        <div class="form-footer">
          <div class="validity-status">
            Formulář je
            @if (regForm().valid()) {
              <span class="status-chip status-chip-success">✅ platný</span>
            } @else {
              <span class="status-chip status-chip-error">❌ neplatný</span>
            }
          </div>
          <button
            class="btn btn-primary"
            [disabled]="!regForm().valid()"
            (click)="onSubmit()"
          >
            Zaregistrovat
          </button>
          <button class="btn btn-ghost" (click)="resetForm()">Reset</button>
        </div>

        @if (submitted()) {
          <div class="submit-result">
            <div class="submit-title">✅ Odesláno! Hodnoty formuláře:</div>
            <pre class="code-block" style="margin:0.5rem 0 0">{{ formValueJson() }}</pre>
          </div>
        }

        <!-- Reactive value preview -->
        <div class="value-preview">
          <div class="vp-title">Reaktivní model signal (aktualizuje se živě)</div>
          <pre class="code-block" style="margin:0.5rem 0 0;max-height:100px;overflow:auto">{{ modelJson() }}</pre>
        </div>
      </div>

      <pre class="code-block">// Import z nového @angular/forms/signals
<span style="color:#ff7b72">import</span> &#123; form, FormField, required, email, minLength &#125; <span style="color:#ff7b72">from</span> <span style="color:#a5d6ff">'@angular/forms/signals'</span>;

// 1. Model jako WritableSignal
model = <span style="color:#d2a8ff">signal</span>&lt;RegistrationModel&gt;(&#123;
  firstName: '', lastName: '', email: '', password: ''
&#125;);

// 2. Vytvoření formu s validačním schématem
regForm = <span style="color:#d2a8ff">form</span>(this.model, (f) => &#123;
  <span style="color:#d2a8ff">required</span>(f.firstName);  <span style="color:#8b949e">// ← inline validace</span>
  <span style="color:#d2a8ff">minLength</span>(f.firstName, 2);
  <span style="color:#d2a8ff">required</span>(f.email);
  <span style="color:#d2a8ff">email</span>(f.email);
  <span style="color:#d2a8ff">required</span>(f.password);
  <span style="color:#d2a8ff">minLength</span>(f.password, 8);
&#125;);

// 3. Template — FormField direktiva (importuj do component imports!)
// imports: [FormField]
// &lt;input [formField]="regForm.email" /&gt;

// 4. Přístup ke stavu polí přes signal API
regForm.email().value()   <span style="color:#8b949e">// aktuální hodnota</span>
regForm.email().errors()  <span style="color:#8b949e">// chyby validace</span>
regForm.email().dirty()   <span style="color:#8b949e">// byl field upraven?</span>
regForm.email().touched() <span style="color:#8b949e">// byl field "touched"?</span>
regForm().valid()         <span style="color:#8b949e">// celkový stav formu</span>
regForm().value()         <span style="color:#8b949e">// celá hodnota formu</span></pre>
    </div>
  `,
  styles: [`
    .side-by-side { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1rem 0; }
    @media(max-width:650px) { .side-by-side { grid-template-columns:1fr; } }
    .sbs-header { font-size:0.82rem; font-weight:600; padding:0.5rem 0.85rem; border-radius:8px 8px 0 0; }
    .sbs-header.old { background:rgba(239,68,68,0.12); color:#fca5a5; }
    .sbs-header.new { background:rgba(34,197,94,0.12); color:#86efac; }
    .sbs-col .code-block { border-radius:0 0 8px 8px; }
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
    @media(max-width:600px) { .form-grid { grid-template-columns:1fr; } }
    .form-field {}
    .req { color:var(--accent); }
    .form-footer { display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; margin-top:0.5rem; }
    .validity-status { display:flex; align-items:center; gap:0.5rem; font-size:0.875rem; color:var(--text-muted); flex:1; }
    .submit-result { margin-top:1rem; background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2); border-radius:8px; padding:1rem; }
    .submit-title { font-size:0.875rem; color:#86efac; font-weight:600; }
    .value-preview { margin-top:1rem; border-top:1px solid var(--border); padding-top:1rem; }
    .vp-title { font-size:0.78rem; font-weight:600; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.06em; }
  `]
})
export class SignalFormsDemoComponent {
  model = signal<RegistrationModel>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  regForm = form(this.model, (f) => {
    required(f.firstName);
    minLength(f.firstName, 2);
    maxLength(f.firstName, 50);
    required(f.lastName);
    required(f.email);
    email(f.email);
    required(f.password);
    minLength(f.password, 8);
  });

  submitted = signal(false);

  formValueJson = computed(() =>
    JSON.stringify(this.regForm().value(), null, 2)
  );

  modelJson = computed(() =>
    JSON.stringify(this.model(), null, 2)
  );

  onSubmit() {
    if (this.regForm().valid()) {
      this.submitted.set(true);
    }
  }

  resetForm() {
    this.model.set({ firstName: '', lastName: '', email: '', password: '' });
    this.submitted.set(false);
  }
}
