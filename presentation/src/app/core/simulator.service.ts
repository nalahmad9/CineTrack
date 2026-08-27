import { Injectable, computed, signal } from '@angular/core';

import {
  BOOT_LINES,
  PHASES,
  PhaseMeta,
  REQUEST_PATH,
  SIM_MODULES,
  SIM_PLUGINS,
  SimFocus,
  SimPhase,
} from './simulator.model';
import { SNIPPETS } from './snippets';

@Injectable({ providedIn: 'root' })
export class SimulatorService {
  readonly phases = PHASES;
  readonly plugins = SIM_PLUGINS;
  readonly modules = SIM_MODULES;
  readonly bootLines = BOOT_LINES;
  readonly requestPath = REQUEST_PATH;

  private readonly phaseIndex = signal(0);
  private readonly bootStep = signal(0);
  private readonly dockedPlugins = signal(0);
  private readonly dockedModules = signal(0);
  private readonly selectedModule = signal<string | null>(null);
  private readonly unfolded = signal(false);
  private readonly requestStop = signal(-1);
  private readonly mongoDown = signal(false);
  private readonly xray = signal(false);
  private readonly terminalLines = signal<string[]>([]);

  readonly phaseMeta = computed<PhaseMeta>(() => this.phases[this.phaseIndex()]);
  readonly phase = computed<SimPhase>(() => this.phaseMeta().id);
  readonly progress = computed(() => (this.phaseIndex() + 1) / this.phases.length);
  readonly isFirst = computed(() => this.phaseIndex() === 0);
  readonly isLast = computed(() => this.phaseIndex() === this.phases.length - 1);

  readonly bootStepIndex = this.bootStep.asReadonly();
  readonly pluginCount = this.dockedPlugins.asReadonly();
  readonly moduleCount = this.dockedModules.asReadonly();
  readonly activeModule = this.selectedModule.asReadonly();
  readonly moduleUnfolded = this.unfolded.asReadonly();
  readonly flightIndex = this.requestStop.asReadonly();
  readonly failure = this.mongoDown.asReadonly();
  readonly xrayMode = this.xray.asReadonly();
  readonly logs = this.terminalLines.asReadonly();

  readonly corePower = computed(() => {
    const p = this.phase();
    if (p === 'void') return 0.08;
    if (p === 'boot') return 0.2 + this.bootStep() * 0.1;
    if (p === 'failure') return 0.35;
    if (p === 'observatory') return 1;
    return Math.min(1, 0.45 + this.dockedPlugins() * 0.05 + this.dockedModules() * 0.03);
  });

  readonly focus = computed<SimFocus>(() => {
    const mod = this.selectedModule();
    if (mod && this.unfolded()) {
      return {
        kind: 'module',
        id: mod,
        label: `${mod} module`,
        detail: 'Routes · Controller · Service · Repository · Schemas',
        snippet: mod === 'auth' ? SNIPPETS.authRoutes : SNIPPETS.registerModules,
      };
    }

    const phase = this.phase();
    if (phase === 'boot') {
      return {
        kind: 'none',
        id: 'boot',
        label: 'Boot',
        detail: this.bootLines[this.bootStep()] ?? 'Booting…',
        snippet: this.bootStep() >= 3 ? SNIPPETS.buildApp : SNIPPETS.serverMain,
      };
    }
    if (phase === 'infrastructure') {
      const i = Math.max(0, this.dockedPlugins() - 1);
      const plug = this.plugins[i];
      return {
        kind: 'plugin',
        id: plug?.id ?? 'plugins',
        label: plug?.label ?? 'Plugins',
        detail: plug?.effect ?? 'Infrastructure',
        snippet: SNIPPETS.registerPlugins,
      };
    }
    if (phase === 'request' || phase === 'xray') {
      const i = Math.max(0, this.requestStop());
      const stop = this.requestPath[i] ?? 'Request';
      const snippet =
        i >= 8 ? SNIPPETS.authCookie : i >= 5 ? SNIPPETS.authController : SNIPPETS.authRoutes;
      return {
        kind: 'request-stop',
        id: stop,
        label: stop,
        detail: phase === 'xray' ? 'X-Ray execution path' : 'Request flight',
        snippet,
      };
    }
    if (phase === 'failure') {
      return {
        kind: 'none',
        id: 'fault',
        label: 'MongoDB offline',
        detail: 'Error Handler intercepts · retries glow · logs stream',
        snippet: SNIPPETS.registerPlugins,
      };
    }
    if (phase === 'concepts') {
      return {
        kind: 'none',
        id: 'concepts',
        label: 'Fastify concepts',
        detail: 'Plugins · Encapsulation · Hooks · Schemas · AJV',
        snippet: SNIPPETS.buildApp,
      };
    }
    if (phase === 'modules' || phase === 'inspect' || phase === 'observatory') {
      return {
        kind: 'none',
        id: 'modules',
        label: 'Feature modules',
        detail: 'Ten domains under /api/v1',
        snippet: SNIPPETS.registerModules,
      };
    }
    return {
      kind: 'none',
      id: 'void',
      label: 'Fastify runtime',
      detail: 'Awaiting boot command',
    };
  });

  constructor() {
    this.pushLog('SIM online · CineTrack backend dormant');
  }

  /** Primary presenter command — advance lifecycle. */
  command(): void {
    const phase = this.phase();

    if (phase === 'void') {
      this.goPhase(1);
      this.runBoot();
      return;
    }
    if (phase === 'boot') {
      if (this.bootStep() < this.bootLines.length - 1) {
        this.bootStep.update((n) => n + 1);
        this.pushLog(this.bootLines[this.bootStep()]);
        return;
      }
      this.goPhase(2);
      this.dockedPlugins.set(0);
      this.pushLog('Infrastructure assembly initiated');
      return;
    }
    if (phase === 'infrastructure') {
      if (this.dockedPlugins() < this.plugins.length) {
        this.dockedPlugins.update((n) => n + 1);
        const p = this.plugins[this.dockedPlugins() - 1];
        this.pushLog(`DOCK ${p.label} · ${p.effect}`);
        return;
      }
      this.goPhase(3);
      this.dockedModules.set(0);
      this.pushLog('Module bay open');
      return;
    }
    if (phase === 'modules') {
      if (this.dockedModules() < this.modules.length) {
        this.dockedModules.update((n) => n + 1);
        const m = this.modules[this.dockedModules() - 1];
        this.pushLog(`MODULE ${m.label} online`);
        return;
      }
      this.goPhase(4);
      this.pushLog('Dependency graph energized');
      return;
    }
    if (phase === 'inspect') {
      this.goPhase(5);
      this.requestStop.set(0);
      this.pushLog('FLIGHT POST /api/v1/auth/login');
      return;
    }
    if (phase === 'request') {
      if (this.requestStop() < this.requestPath.length - 1) {
        this.requestStop.update((n) => n + 1);
        this.pushLog(`→ ${this.requestPath[this.requestStop()]}`);
        return;
      }
      this.goPhase(6);
      this.xray.set(true);
      this.pushLog('XRAY mode enabled');
      return;
    }
    if (phase === 'xray') {
      this.goPhase(7);
      this.mongoDown.set(true);
      this.xray.set(false);
      this.pushLog('FAULT MongoDB connection lost');
      this.pushLog('Error Handler engaged');
      return;
    }
    if (phase === 'failure') {
      this.goPhase(8);
      this.mongoDown.set(false);
      this.pushLog('CONCEPTS overlay');
      return;
    }
    if (phase === 'concepts') {
      this.goPhase(9);
      this.pushLog('OBSERVATORY · full architecture');
      return;
    }
  }

  back(): void {
    if (this.isFirst()) return;
    const next = this.phaseIndex() - 1;
    this.goPhase(next);
    this.syncStateForPhase(this.phases[next].id);
  }

  jumpTo(phase: SimPhase): void {
    const idx = this.phases.findIndex((p) => p.id === phase);
    if (idx < 0) return;
    this.goPhase(idx);
    this.syncStateForPhase(phase);
  }

  selectModule(id: string): void {
    if (this.phase() !== 'modules' && this.phase() !== 'inspect' && this.phase() !== 'observatory') {
      return;
    }
    if (this.selectedModule() === id && this.unfolded()) {
      this.unfolded.set(false);
      this.selectedModule.set(null);
      this.pushLog(`CLOSE ${id}`);
      return;
    }
    this.selectedModule.set(id);
    this.unfolded.set(true);
    this.pushLog(`INSPECT ${id} · unfolding layers`);
  }

  restart(): void {
    this.phaseIndex.set(0);
    this.bootStep.set(0);
    this.dockedPlugins.set(0);
    this.dockedModules.set(0);
    this.selectedModule.set(null);
    this.unfolded.set(false);
    this.requestStop.set(-1);
    this.mongoDown.set(false);
    this.xray.set(false);
    this.terminalLines.set(['SIM online · CineTrack backend dormant']);
  }

  private goPhase(index: number): void {
    this.phaseIndex.set(index);
  }

  private runBoot(): void {
    this.bootStep.set(0);
    this.pushLog(this.bootLines[0]);
  }

  private syncStateForPhase(phase: SimPhase): void {
    this.selectedModule.set(null);
    this.unfolded.set(false);
    this.xray.set(phase === 'xray');
    this.mongoDown.set(phase === 'failure');
    if (phase === 'void') {
      this.bootStep.set(0);
      this.dockedPlugins.set(0);
      this.dockedModules.set(0);
      this.requestStop.set(-1);
    } else if (phase === 'boot') {
      this.bootStep.set(this.bootLines.length - 1);
      this.dockedPlugins.set(0);
      this.dockedModules.set(0);
    } else if (phase === 'infrastructure') {
      this.dockedPlugins.set(this.plugins.length);
      this.dockedModules.set(0);
    } else if (phase === 'modules') {
      this.dockedPlugins.set(this.plugins.length);
      this.dockedModules.set(this.modules.length);
    } else if (phase === 'request') {
      this.dockedPlugins.set(this.plugins.length);
      this.dockedModules.set(this.modules.length);
      this.requestStop.set(0);
    } else {
      this.dockedPlugins.set(this.plugins.length);
      this.dockedModules.set(this.modules.length);
      this.requestStop.set(this.requestPath.length - 1);
    }
  }

  private pushLog(line: string): void {
    this.terminalLines.update((lines) => [...lines.slice(-10), `> ${line}`]);
  }
}
