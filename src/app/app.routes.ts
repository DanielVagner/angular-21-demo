import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'signals',
    loadComponent: () => import('./pages/signals/signals-demo').then(m => m.SignalsDemoComponent),
  },
  {
    path: 'control-flow',
    loadComponent: () => import('./pages/control-flow/control-flow-demo').then(m => m.ControlFlowDemoComponent),
  },
  {
    path: 'linked-signal',
    loadComponent: () => import('./pages/linked-signal/linked-signal-demo').then(m => m.LinkedSignalDemoComponent),
  },
  {
    path: 'resource',
    loadComponent: () => import('./pages/resource/resource-demo').then(m => m.ResourceDemoComponent),
  },
  {
    path: 'http-resource',
    loadComponent: () => import('./pages/http-resource/http-resource-demo').then(m => m.HttpResourceDemoComponent),
  },
  {
    path: 'signal-forms',
    loadComponent: () => import('./pages/signal-forms/signal-forms-demo').then(m => m.SignalFormsDemoComponent),
  },
  { path: '**', redirectTo: '' },
];
