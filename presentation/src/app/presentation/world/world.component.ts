import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { StageFocus } from '../../core/presentation.model';
import { PresentationService } from '../../core/presentation.service';
import { ArchitectureStackComponent } from './architecture-stack.component';
import { AuthLayersComponent } from './auth-layers.component';
import { ComparisonStageComponent } from './comparison-stage.component';
import { ModuleRingComponent } from './module-ring.component';
import { PluginOrbitComponent } from './plugin-orbit.component';
import { RepoPatternsComponent } from './repo-patterns.component';
import { RequestPathComponent } from './request-path.component';
import { RequirementsFieldComponent } from './requirements-field.component';
import { ServerCoreComponent } from './server-core.component';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [
    ServerCoreComponent,
    RequirementsFieldComponent,
    PluginOrbitComponent,
    ModuleRingComponent,
    AuthLayersComponent,
    RequestPathComponent,
    RepoPatternsComponent,
    ArchitectureStackComponent,
    ComparisonStageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stage">
      <div class="canvas">
        @switch (focus()) {
          @case ('void') {
            <div class="empty"></div>
          }
          @case ('requirements') {
            <app-requirements-field />
          }
          @case ('core') {
            <app-server-core />
          }
          @case ('plugins') {
            <div class="stack">
              <app-server-core [compact]="true" />
              <app-plugin-orbit />
            </div>
          }
          @case ('modules') {
            <app-module-ring />
          }
          @case ('layers') {
            <app-auth-layers />
          }
          @case ('request') {
            <app-request-path />
          }
          @case ('concepts') {
            <div class="stack">
              <app-server-core [compact]="true" />
              <app-plugin-orbit />
            </div>
          }
          @case ('repos') {
            <app-repo-patterns />
          }
          @case ('architecture') {
            <div class="stack">
              <app-server-core [compact]="true" />
              <app-architecture-stack />
            </div>
          }
          @case ('comparison') {
            <app-comparison-stage />
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
      }

      .stage {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 7.5rem 10rem 5rem 10rem;
        background:
          radial-gradient(ellipse 60% 45% at 50% 55%, rgba(240, 164, 58, 0.06), transparent 70%),
          #0c0b09;
      }

      .canvas {
        width: min(920px, 100%);
        max-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }

      .empty {
        width: 1px;
        height: 1px;
      }

      @media (max-width: 960px) {
        .stage {
          padding: 7rem 1.25rem 4.5rem;
        }
      }
    `,
  ],
})
export class WorldComponent {
  private readonly presentation = inject(PresentationService);

  /** One panel at a time — prevents overlap. */
  readonly focus = computed<StageFocus>(() => {
    const w = this.presentation.world();
    if (w.showComparison) return 'comparison';
    if (w.showRepos) return 'repos';
    if (w.showRequest) return 'request';
    if (w.showLayers) return 'layers';
    if (w.showConcepts) return 'concepts';
    if (w.showFullArchitecture) return 'architecture';
    if (w.showModules) return 'modules';
    if (w.showPlugins) return 'plugins';
    if (w.showRequirements) return 'requirements';
    if (w.bootStage > 0 || w.corePower >= 0.4) return 'core';
    return 'void';
  });
}
