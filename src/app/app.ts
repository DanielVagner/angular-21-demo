import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  version: string;
  versionClass: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected navOpen = signal(false);

  protected navItems: NavItem[] = [
    { path: '/',             label: 'Přehled',        icon: '🏠', version: 'v18–v21', versionClass: 'all' },
    { path: '/signals',      label: 'Signals',         icon: '⚡', version: 'v20 stable', versionClass: 'stable' },
    { path: '/control-flow', label: 'Control Flow',    icon: '🔀', version: 'v17+',    versionClass: 'v17' },
    { path: '/linked-signal',label: 'linkedSignal()',  icon: '🔗', version: 'v19',     versionClass: 'v19' },
    { path: '/resource',     label: 'resource()',      icon: '📦', version: 'v20',     versionClass: 'v20' },
    { path: '/http-resource',label: 'httpResource()',  icon: '🌐', version: 'v20',     versionClass: 'v20' },
    { path: '/signal-forms', label: 'Signal Forms',    icon: '📝', version: 'v21 new', versionClass: 'new' },
  ];
}
