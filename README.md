# Angular 21 Demo

Tento projekt je prezentační a školící Angular aplikace, která navazuje na dřívější demo a školení k Angularu 17. Zatímco předchozí materiály se soustředily hlavně na první seznámení se `Signals`, `@defer` a novým `Control Flow`, tato verze dělá souhrn toho nejdůležitějšího z novějších verzí Angularu od v18 až po v21.

Cílem projektu je ukázat, co se od Angularu 17 posunulo dál, co už je dnes stabilní, co je stále experimentální a jak tyto novinky vypadají v praxi na malých, samostatných a snadno vysvětlitelných ukázkách.

## Co projekt ukazuje

Projekt je postavený jako standalone Angular aplikace s routovanými demo stránkami. V kódu najdeš hlavně tyto oblasti:

- `Signals` jako stabilní reaktivní API v Angularu 20: `signal()`, `computed()`, `effect()`, `input()`, `output()`, `model()` a `viewChild()`
- nový template `Control Flow`: `@if`, `@for`, `@switch`
- `@defer` a jeho použití pro lazy loading a odložené vykreslování
- `linkedSignal()` pro odvoditelný, ale přepisovatelný stav
- `resource()` pro reaktivní práci s asynchronními daty
- `httpResource()` jako signal-based vrstvu nad HTTP voláním
- `Signal Forms` z Angularu 21 jako nový experimentální přístup k formulářům
- standalone aplikaci bez `NgModule`
- `provideZonelessChangeDetection()` a moderní konfiguraci aplikace přes `app.config.ts`

## Co v aplikaci uživatel najde

Po spuštění aplikace je k dispozici přehledová stránka a několik samostatných demo sekcí:

- `Přehled`
  Stručná časová osa verzí Angular 18 až 21 a rozcestník na jednotlivé ukázky.

- `Signals`
  Praktické ukázky základních signal primitives, odvozených hodnot, side effects a nového component API přes `input()`, `output()`, `model()` a `viewChild()`.

- `Control Flow`
  Ukázky nové template syntaxe `@if`, `@for`, `@switch` a doplnění o `@defer`.

- `linkedSignal()`
  Vysvětlení rozdílu mezi `computed()` a `linkedSignal()` na jednoduchém i realističtějším scénáři.

- `resource()`
  Reaktivní načítání dat, stavové přechody typu loading/resolved/error/reloading a ruční `reload()`.

- `httpResource()`
  Ukázka signal-based HTTP volání nad `HttpClient`, včetně reaktivní URL a srovnání s `resource()`.

- `Signal Forms`
  Experimentální formuláře nad `@angular/forms/signals`, validace přes schema-like API a binding přes `[formField]`.

## Technologie a charakter projektu

- Angular CLI `21.1.0`
- Angular framework `21.1.x`
- TypeScript `5.9`
- SCSS styly
- standalone komponenty a lazy-loaded routy
- zoneless change detection
- test runner přes `ng test`

Některé ukázky sahají na veřejné demo API `https://jsonplaceholder.typicode.com`, konkrétně stránky pro `resource()` a `httpResource()`. Pro jejich plnou funkčnost je tedy potřeba internetové připojení.

## Požadavky

Doporučené prostředí podle projektu:

- Node.js `22`
- npm `10`

## Instalace

```bash
npm install
```

## Spuštění vývojového serveru

```bash
npm start
```

Aplikace poběží standardně na:

```text
http://localhost:4200/
```

Při změně zdrojových souborů se aplikace automaticky přenačte.

## Build projektu

Produkční build:

```bash
npm run build
```

Výstup se uloží do adresáře:

```text
dist/
```

Průběžný build ve watch režimu:

```bash
npm run watch
```

## Testy

Spuštění unit testů:

```bash
npm test
```

Projekt používá Angular test builder a v závislostech je připravený `Vitest`.

## Struktura projektu

Nejdůležitější soubory a složky:

- `src/app/app.config.ts`
  Konfigurace aplikace, routeru, HTTP klienta a zoneless change detection.

- `src/app/app.routes.ts`
  Definice jednotlivých demo stránek.

- `src/app/pages/`
  Samotné ukázky novinek z Angularu 18 až 21.

- `src/styles.scss`
  Sdílené vizuální styly celé demo aplikace.

## Pro koho je projekt určený

Projekt je vhodný jako:

- podklad ke školení nebo interní prezentaci
- rychlý přehled novinek od Angularu 18 do Angularu 21
- praktická sada malých demo ukázek nad moderním Angular API
- startovní bod pro tým, který přechází ze staršího Angularu na novější verze
