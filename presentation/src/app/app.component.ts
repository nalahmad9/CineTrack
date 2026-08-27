import { Component } from '@angular/core';
import { ExplorerComponent } from './explorer/explorer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExplorerComponent],
  template: `<app-explorer />`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class AppComponent {}
