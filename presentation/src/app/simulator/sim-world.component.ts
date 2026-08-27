import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import gsap from 'gsap';
import * as THREE from 'three';

import { SimulatorService } from '../core/simulator.service';

@Component({
  selector: 'app-sim-world',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="gl"></canvas>`,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
      }
      .gl {
        width: 100%;
        height: 100%;
        display: block;
      }
    `,
  ],
})
export class SimWorldComponent implements AfterViewInit, OnDestroy {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly sim = inject(SimulatorService);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private core!: THREE.Mesh;
  private coreGlow!: THREE.Mesh;
  private shield!: THREE.Mesh;
  private identityRing!: THREE.Mesh;
  private grid!: THREE.Mesh;
  private particleSys!: THREE.Points;
  private pluginGroup = new THREE.Group();
  private moduleGroup = new THREE.Group();
  private requestOrb!: THREE.Mesh;
  private mongoNode!: THREE.Mesh;
  private linkLines!: THREE.LineSegments;
  private raf = 0;
  private dragging = false;
  private prevX = 0;
  private prevY = 0;
  private targetCam = { theta: 0.4, phi: 1.15, radius: 14 };
  private camState = { theta: 0.4, phi: 1.15, radius: 18 };
  private pluginMeshes: THREE.Mesh[] = [];
  private moduleMeshes: THREE.Mesh[] = [];
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private disposed = false;

  constructor() {
    effect(() => {
      const phase = this.sim.phase();
      const power = this.sim.corePower();
      const plugins = this.sim.pluginCount();
      const modules = this.sim.moduleCount();
      const flight = this.sim.flightIndex();
      const fail = this.sim.failure();
      const xray = this.sim.xrayMode();
      const selected = this.sim.activeModule();
      const unfolded = this.sim.moduleUnfolded();
      if (!this.core) return;
      this.applyState({ phase, power, plugins, modules, flight, fail, xray, selected, unfolded });
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef().nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    this.camera.position.set(0, 4, 18);

    const ambient = new THREE.AmbientLight(0x8899aa, 0.55);
    const key = new THREE.PointLight(0xff4d6d, 2.2, 40);
    key.position.set(4, 6, 8);
    const fill = new THREE.PointLight(0x3dffe0, 1.4, 40);
    fill.position.set(-6, -2, 4);
    this.scene.add(ambient, key, fill);

    this.buildCore();
    this.buildParticles();
    this.buildPlugins();
    this.buildModules();
    this.buildExtras();
    this.scene.add(this.pluginGroup, this.moduleGroup);

    this.bindInput(canvas);
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  ngOnDestroy(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.renderer?.dispose();
  }

  private buildCore(): void {
    const geo = new THREE.IcosahedronGeometry(1.35, 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a1020,
      emissive: 0xff4d6d,
      emissiveIntensity: 0.15,
      metalness: 0.35,
      roughness: 0.35,
      wireframe: false,
    });
    this.core = new THREE.Mesh(geo, mat);
    this.scene.add(this.core);

    const glowGeo = new THREE.IcosahedronGeometry(1.7, 1);
    this.coreGlow = new THREE.Mesh(
      glowGeo,
      new THREE.MeshBasicMaterial({
        color: 0xff4d6d,
        transparent: true,
        opacity: 0.08,
        wireframe: true,
      }),
    );
    this.scene.add(this.coreGlow);

    this.shield = new THREE.Mesh(
      new THREE.SphereGeometry(2.15, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x3dffe0,
        transparent: true,
        opacity: 0,
        wireframe: true,
      }),
    );
    this.scene.add(this.shield);

    this.identityRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.035, 12, 80),
      new THREE.MeshBasicMaterial({ color: 0xffd60a, transparent: true, opacity: 0 }),
    );
    this.identityRing.rotation.x = Math.PI / 2.4;
    this.scene.add(this.identityRing);

    this.grid = new THREE.Mesh(
      new THREE.SphereGeometry(3.2, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0xff4d6d,
        transparent: true,
        opacity: 0,
        wireframe: true,
      }),
    );
    this.scene.add(this.grid);
  }

  private buildParticles(): void {
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleSys = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x8ab4ff, size: 0.035, transparent: true, opacity: 0.55 }),
    );
    this.scene.add(this.particleSys);
  }

  private buildPlugins(): void {
    this.pluginMeshes = [];
    SIM_PLUGIN_DEFS.forEach((p, i) => {
      const mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28, 0),
        new THREE.MeshStandardMaterial({
          color: p.color,
          emissive: p.color,
          emissiveIntensity: 0.4,
          metalness: 0.2,
          roughness: 0.4,
        }),
      );
      mesh.userData = { type: 'plugin', id: p.id, index: i };
      mesh.visible = false;
      mesh.position.set(12, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
      this.pluginGroup.add(mesh);
      this.pluginMeshes.push(mesh);
    });
  }

  private buildModules(): void {
    this.moduleMeshes = [];
    SIM_MODULE_DEFS.forEach((m, i) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.7, 0.7),
        new THREE.MeshStandardMaterial({
          color: 0x151520,
          emissive: m.color,
          emissiveIntensity: 0.25,
          metalness: 0.3,
          roughness: 0.45,
        }),
      );
      mesh.userData = { type: 'module', id: m.id, index: i };
      mesh.visible = false;
      const angle = (i / SIM_MODULE_DEFS.length) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 6.5, Math.sin(angle * 1.3) * 1.2, Math.sin(angle) * 6.5);
      this.moduleGroup.add(mesh);
      this.moduleMeshes.push(mesh);
    });
  }

  private buildExtras(): void {
    this.requestOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff4d6d }),
    );
    this.requestOrb.visible = false;
    this.scene.add(this.requestOrb);

    this.mongoNode = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0x0f2a1a,
        emissive: 0x3dffe0,
        emissiveIntensity: 0.5,
      }),
    );
    this.mongoNode.position.set(0, -4.2, 0);
    this.mongoNode.visible = false;
    this.scene.add(this.mongoNode);

    const positions: number[] = [];
    for (let i = 0; i < 40; i++) {
      positions.push(0, 0, 0, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 10);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.linkLines = new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: 0x3dffe0, transparent: true, opacity: 0 }),
    );
    this.scene.add(this.linkLines);
  }

  private applyState(s: {
    phase: string;
    power: number;
    plugins: number;
    modules: number;
    flight: number;
    fail: boolean;
    xray: boolean;
    selected: string | null;
    unfolded: boolean;
  }): void {
    const mat = this.core.material as THREE.MeshStandardMaterial;
    gsap.to(mat, { emissiveIntensity: 0.15 + s.power * 1.4, duration: 0.8 });
    gsap.to(this.core.scale, { x: 1 + s.power * 0.15, y: 1 + s.power * 0.15, z: 1 + s.power * 0.15, duration: 0.8 });
    (this.coreGlow.material as THREE.MeshBasicMaterial).opacity = 0.05 + s.power * 0.18;

    // camera framing per phase
    const frames: Record<string, { theta: number; phi: number; radius: number }> = {
      void: { theta: 0.2, phi: 1.2, radius: 16 },
      boot: { theta: 0.5, phi: 1.05, radius: 11 },
      infrastructure: { theta: 1.1, phi: 1.0, radius: 13 },
      modules: { theta: 0.3, phi: 1.25, radius: 15 },
      inspect: { theta: 0.8, phi: 0.95, radius: 12 },
      request: { theta: 0.1, phi: 1.15, radius: 10 },
      xray: { theta: 0.6, phi: 1.0, radius: 9 },
      failure: { theta: -0.4, phi: 1.3, radius: 12 },
      concepts: { theta: 0.9, phi: 1.1, radius: 11 },
      observatory: { theta: 0.4, phi: 0.85, radius: 22 },
    };
    const f = frames[s.phase] ?? frames['void'];
    gsap.to(this.targetCam, { ...f, duration: 1.4, ease: 'power2.inOut' });

    // plugins dock
    this.pluginMeshes.forEach((mesh, i) => {
      const active = i < s.plugins;
      mesh.visible = active || s.phase === 'infrastructure';
      if (i < s.plugins) {
        const angle = (i / this.pluginMeshes.length) * Math.PI * 2;
        const r = 3.4;
        gsap.to(mesh.position, {
          x: Math.cos(angle) * r,
          y: Math.sin(angle * 2) * 0.4,
          z: Math.sin(angle) * r,
          duration: 0.9,
          ease: 'power3.out',
        });
        mesh.visible = true;
      } else if (s.phase === 'infrastructure') {
        mesh.visible = true;
      } else {
        mesh.visible = s.phase === 'observatory' || s.phase === 'concepts';
      }
    });

    const shieldOn = s.plugins > 0;
    gsap.to(this.shield.material as THREE.MeshBasicMaterial, {
      opacity: shieldOn ? 0.18 : 0,
      duration: 0.6,
    });
    const jwtOn = s.plugins >= 5;
    gsap.to(this.identityRing.material as THREE.MeshBasicMaterial, {
      opacity: jwtOn ? 0.85 : 0,
      duration: 0.6,
    });
    const rateOn = s.plugins >= 7;
    gsap.to(this.grid.material as THREE.MeshBasicMaterial, {
      opacity: rateOn ? 0.12 : 0,
      duration: 0.6,
    });

    // modules
    this.moduleMeshes.forEach((mesh, i) => {
      const show = i < s.modules || s.phase === 'modules' || s.phase === 'observatory' || s.phase === 'inspect';
      mesh.visible = i < s.modules;
      if (i < s.modules) {
        const angle = (i / this.moduleMeshes.length) * Math.PI * 2;
        const r = s.phase === 'observatory' ? 8.5 : 6.5;
        gsap.to(mesh.position, {
          x: Math.cos(angle) * r,
          y: Math.sin(angle * 1.3) * (s.phase === 'observatory' ? 2.2 : 1.2),
          z: Math.sin(angle) * r,
          duration: 0.85,
          ease: 'power3.out',
        });
        const selected = s.selected === mesh.userData['id'] && s.unfolded;
        gsap.to(mesh.scale, {
          x: selected ? 1.6 : 1,
          y: selected ? 1.6 : 1,
          z: selected ? 1.6 : 1,
          duration: 0.45,
        });
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = selected ? 0.9 : 0.25;
      } else {
        mesh.visible = false;
      }
      if (!show && i >= s.modules) mesh.visible = false;
    });

    this.mongoNode.visible =
      s.modules > 0 || s.phase === 'request' || s.phase === 'inspect' || s.phase === 'observatory';
    (this.mongoNode.material as THREE.MeshStandardMaterial).emissiveIntensity = s.fail ? 0.05 : 0.55;
    (this.mongoNode.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(
      s.fail ? 0xff4d6d : 0x3dffe0,
    );

    const linksOn = s.phase === 'inspect' || s.phase === 'xray' || s.phase === 'observatory';
    gsap.to(this.linkLines.material as THREE.LineBasicMaterial, {
      opacity: linksOn ? (s.xray ? 0.55 : 0.22) : 0,
      duration: 0.5,
    });

    // request orb along a path
    const flying = s.phase === 'request' || s.phase === 'xray';
    this.requestOrb.visible = flying && s.flight >= 0;
    if (flying && s.flight >= 0) {
      const t = s.flight / 10;
      const x = Math.sin(t * Math.PI * 2) * (3 + t * 2);
      const y = 2 - t * 5;
      const z = Math.cos(t * Math.PI * 2) * (3 + t);
      gsap.to(this.requestOrb.position, { x, y, z, duration: 0.65, ease: 'power2.out' });
    }

    // xray dims non-path
    const dim = s.xray ? 0.15 : 1;
    this.pluginGroup.children.forEach((c) => {
      if (c instanceof THREE.Mesh) {
        (c.material as THREE.MeshStandardMaterial).opacity = 1;
        (c.material as THREE.MeshStandardMaterial).transparent = s.xray;
        (c.material as THREE.MeshStandardMaterial).opacity = s.xray ? 0.25 : 1;
      }
    });
    void dim;
  }

  private bindInput(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    });
    window.addEventListener('pointerup', () => {
      this.dragging = false;
    });
    window.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.prevX;
      const dy = e.clientY - this.prevY;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
      this.targetCam.theta -= dx * 0.005;
      this.targetCam.phi = Math.min(Math.PI - 0.2, Math.max(0.2, this.targetCam.phi + dy * 0.005));
    });
    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.targetCam.radius = Math.min(30, Math.max(6, this.targetCam.radius + e.deltaY * 0.01));
      },
      { passive: false },
    );
    canvas.addEventListener('click', (e) => this.onClick(e, canvas));
  }

  private onClick(e: MouseEvent, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.moduleMeshes, false);
    if (hits[0]) {
      const id = hits[0].object.userData['id'] as string;
      this.sim.selectModule(id);
    }
  }

  private onResize = (): void => {
    const canvas = this.canvasRef().nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  };

  private loop = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const t = performance.now() * 0.001;

    this.camState.theta += (this.targetCam.theta - this.camState.theta) * 0.06;
    this.camState.phi += (this.targetCam.phi - this.camState.phi) * 0.06;
    this.camState.radius += (this.targetCam.radius - this.camState.radius) * 0.06;

    const { theta, phi, radius } = this.camState;
    this.camera.position.set(
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta),
    );
    this.camera.lookAt(0, 0, 0);

    this.core.rotation.y = t * 0.25;
    this.coreGlow.rotation.y = -t * 0.15;
    this.shield.rotation.y = t * 0.1;
    this.identityRing.rotation.z = t * 0.4;
    this.grid.rotation.x = t * 0.08;
    this.particleSys.rotation.y = t * 0.02;
    this.pluginMeshes.forEach((m, i) => {
      m.rotation.y = t + i;
      m.rotation.x = t * 0.5;
    });
    this.moduleMeshes.forEach((m, i) => {
      m.rotation.y = t * 0.3 + i * 0.2;
    });

    this.renderer.render(this.scene, this.camera);
  };
}

const SIM_PLUGIN_DEFS = [
  { id: 'helmet', color: 0x3dffe0 },
  { id: 'cors', color: 0x7c9cff },
  { id: 'compress', color: 0xffd60a },
  { id: 'cookie', color: 0xff8fab },
  { id: 'jwt', color: 0xff4d6d },
  { id: 'swagger', color: 0x94a3b8 },
  { id: 'rate-limit', color: 0xf472b6 },
  { id: 'error-handler', color: 0xfb7185 },
];

const SIM_MODULE_DEFS = [
  { id: 'auth', color: 0xff4d6d },
  { id: 'users', color: 0x7c9cff },
  { id: 'tmdb', color: 0x3dffe0 },
  { id: 'watchlist', color: 0xffd60a },
  { id: 'favorites', color: 0xf472b6 },
  { id: 'ratings', color: 0xa78bfa },
  { id: 'journal', color: 0x34d399 },
  { id: 'collections', color: 0x60a5fa },
  { id: 'statistics', color: 0xfb7185 },
  { id: 'recommendations', color: 0x2dd4bf },
];
