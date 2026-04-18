# Angular 21 Demo

This project is a presentation and training Angular application that builds on an earlier Angular 17 demo and training session. While the previous materials focused mainly on a first introduction to `Signals`, `@defer`, and the new `Control Flow`, this version provides a summary of the most important changes in newer Angular releases from v18 up to v21.

The goal of the project is to show what has evolved since Angular 17, what is stable today, what is still experimental, and what these new features look like in practice through small, self-contained, and easy-to-explain examples.

## What the Project Covers

The project is built as a standalone Angular application with routed demo pages. In the codebase, you will mainly find these areas:

- `Signals` as a stable reactive API in Angular 20: `signal()`, `computed()`, `effect()`, `input()`, `output()`, `model()`, and `viewChild()`
- the new `Control Flow` template syntax: `@if`, `@for`, `@switch`
- `@defer` and its use for lazy loading and deferred rendering
- `linkedSignal()` for derived but overridable state
- `resource()` for reactive async data handling
- `httpResource()` as a signal-based layer over HTTP calls
- `Signal Forms` in Angular 21 as a new experimental approach to forms
- a standalone application without `NgModule`
- `provideZonelessChangeDetection()` and modern application configuration via `app.config.ts`

## What Users Will Find in the App

After starting the application, users will see an overview page and several standalone demo sections:

- `Overview`
  A short timeline of Angular versions 18 through 21 and a navigation hub for the individual demos.

- `Signals`
  Practical examples of the core signal primitives, derived values, side effects, and the new component API through `input()`, `output()`, `model()`, and `viewChild()`.

- `Control Flow`
  Examples of the new template syntax `@if`, `@for`, `@switch`, extended with `@defer`.

- `linkedSignal()`
  An explanation of the difference between `computed()` and `linkedSignal()` through both a simple and a more realistic scenario.

- `resource()`
  Reactive data loading, state transitions such as loading/resolved/error/reloading, and manual `reload()`.

- `httpResource()`
  A signal-based HTTP example built on top of `HttpClient`, including reactive URLs and a comparison with `resource()`.

- `Signal Forms`
  Experimental forms built on `@angular/forms/signals`, validation through a schema-like API, and binding through `[formField]`.

## Technology and Project Characteristics

- Angular CLI `21.1.0`
- Angular framework `21.1.x`
- TypeScript `5.9`
- SCSS styling
- standalone components and lazy-loaded routes
- zoneless change detection
- test runner through `ng test`

Some demos use the public demo API at `https://jsonplaceholder.typicode.com`, specifically the pages for `resource()` and `httpResource()`. For full functionality, an internet connection is therefore required.

## Requirements

Recommended environment based on the project:

- Node.js `22`
- npm `10`

## Installation

```bash
npm install
```

## Running the Development Server

```bash
npm start
```

The application will run by default at:

```text
http://localhost:4200/
```

When source files change, the application reloads automatically.

## Building the Project

Production build:

```bash
npm run build
```

The output is stored in:

```text
dist/
```

Continuous build in watch mode:

```bash
npm run watch
```

## Tests

Run unit tests with:

```bash
npm test
```

The project uses the Angular test builder, and `Vitest` is included in the dependencies.

## Project Structure

The most important files and folders:

- `src/app/app.config.ts`
  Application, router, HTTP client, and zoneless change detection configuration.

- `src/app/app.routes.ts`
  Route definitions for the individual demo pages.

- `src/app/pages/`
  The actual feature demos covering Angular 18 through 21.

- `src/styles.scss`
  Shared visual styling for the entire demo application.

## Intended Audience

This project works well as:

- material for training or an internal presentation
- a quick overview of Angular updates from version 18 to version 21
- a practical collection of small demos built on modern Angular APIs
- a starting point for teams moving from older Angular versions to newer ones
