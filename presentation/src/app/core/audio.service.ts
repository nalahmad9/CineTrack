import { Injectable, signal } from '@angular/core';

type Sfx = 'boot' | 'connect' | 'type' | 'whoosh' | 'pulse';

@Injectable({ providedIn: 'root' })
export class AudioService {
  readonly enabled = signal(false);
  private ctx: AudioContext | null = null;
  private ambientNodes: AudioNode[] = [];
  private ambientOn = false;

  toggle(): void {
    const next = !this.enabled();
    this.enabled.set(next);
    if (next) {
      void this.ensureCtx();
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
  }

  play(kind?: Sfx): void {
    if (!this.enabled() || !kind) return;
    void this.ensureCtx().then(() => {
      switch (kind) {
        case 'boot':
          this.tone(90, 0.18, 'sawtooth', 0.04);
          this.tone(180, 0.28, 'sine', 0.03, 0.08);
          break;
        case 'connect':
          this.tone(520, 0.08, 'triangle', 0.03);
          this.tone(780, 0.1, 'sine', 0.02, 0.05);
          break;
        case 'type':
          this.tone(640 + Math.random() * 80, 0.04, 'square', 0.015);
          break;
        case 'whoosh':
          this.noise(0.22, 0.035);
          break;
        case 'pulse':
          this.tone(220, 0.16, 'sine', 0.04);
          break;
      }
    });
  }

  private async ensureCtx(): Promise<AudioContext> {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  private startAmbient(): void {
    if (!this.ctx || this.ambientOn) return;
    this.ambientOn = true;

    const ctx = this.ctx;
    const master = ctx.createGain();
    master.gain.value = 0.028;
    master.connect(ctx.destination);

    const oscA = ctx.createOscillator();
    oscA.type = 'sine';
    oscA.frequency.value = 55;
    const oscB = ctx.createOscillator();
    oscB.type = 'sine';
    oscB.frequency.value = 82.5;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);

    oscA.connect(master);
    oscB.connect(master);
    oscA.start();
    oscB.start();
    lfo.start();

    this.ambientNodes = [oscA, oscB, lfo, lfoGain, master];
  }

  private stopAmbient(): void {
    this.ambientOn = false;
    for (const node of this.ambientNodes) {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        /* ignore */
      }
    }
    this.ambientNodes = [];
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    gain = 0.04,
    delay = 0,
  ): void {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(dur: number, gain = 0.03): void {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.ctx.destination);
    src.start();
  }
}
