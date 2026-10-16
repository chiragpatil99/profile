/**
 * Tiny particle-network simulation used by the hero scene.
 * Kept outside React components: it is mutable per-frame state, updated imperatively.
 */

export const BOX = { x: 9, y: 5, z: 4 };
export const LINK_DIST = 2.6;
export const PACKETS = 14;

export type NetworkData = {
  count: number;
  pos: Float32Array;
  vel: Float32Array;
  col: Float32Array;
  linePos: Float32Array;
  maxSegs: number;
  packetPos: Float32Array;
  packets: { a: number; b: number; t: number }[];
  edges: [number, number][];
  segCount: number;
};

/** Deterministic PRNG so initial layout is pure and identical between renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// brand palette (blue, violet, cyan) as linear RGB floats
const PALETTE = [
  [0.357, 0.549, 1.0],
  [0.608, 0.482, 1.0],
  [0.22, 0.831, 0.949],
];

export function createNetworkData(count: number): NetworkData {
  const rnd = mulberry32(1337 + count);
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rnd() - 0.5) * BOX.x * 2;
    pos[i * 3 + 1] = (rnd() - 0.5) * BOX.y * 2;
    pos[i * 3 + 2] = (rnd() - 0.5) * BOX.z * 2;
    vel[i * 3] = (rnd() - 0.5) * 0.004;
    vel[i * 3 + 1] = (rnd() - 0.5) * 0.004;
    vel[i * 3 + 2] = (rnd() - 0.5) * 0.004;
    const c = PALETTE[i % 3];
    col[i * 3] = c[0];
    col[i * 3 + 1] = c[1];
    col[i * 3 + 2] = c[2];
  }
  const maxSegs = count * 6;
  return {
    count,
    pos,
    vel,
    col,
    linePos: new Float32Array(maxSegs * 6),
    maxSegs,
    packetPos: new Float32Array(PACKETS * 3),
    packets: Array.from({ length: PACKETS }, (_, i) => ({ a: 0, b: 0, t: i / PACKETS })),
    edges: [],
    segCount: 0,
  };
}

/** Advance one frame. `dt` is in "60fps frames" (1 ≈ 16ms). */
export function stepNetwork(d: NetworkData, dt: number, reduced: boolean) {
  const { pos, vel, linePos, maxSegs, packets, packetPos, count } = d;

  if (!reduced) {
    for (let i = 0; i < count; i++) {
      for (let k = 0; k < 3; k++) {
        const idx = i * 3 + k;
        pos[idx] += vel[idx] * dt;
        const lim = k === 0 ? BOX.x : k === 1 ? BOX.y : BOX.z;
        if (pos[idx] > lim || pos[idx] < -lim) vel[idx] *= -1;
      }
    }
  }

  let seg = 0;
  d.edges.length = 0;
  for (let i = 0; i < count && seg < maxSegs; i++) {
    for (let j = i + 1; j < count && seg < maxSegs; j++) {
      const dx = pos[i * 3] - pos[j * 3];
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) {
        const o = seg * 6;
        linePos[o] = pos[i * 3];
        linePos[o + 1] = pos[i * 3 + 1];
        linePos[o + 2] = pos[i * 3 + 2];
        linePos[o + 3] = pos[j * 3];
        linePos[o + 4] = pos[j * 3 + 1];
        linePos[o + 5] = pos[j * 3 + 2];
        d.edges.push([i, j]);
        seg++;
      }
    }
  }
  d.segCount = seg;

  if (d.edges.length) {
    for (let p = 0; p < PACKETS; p++) {
      const pk = packets[p];
      pk.t += (reduced ? 0 : 0.012) * dt;
      if (pk.t >= 1 || pk.a === pk.b) {
        const e = d.edges[Math.floor(Math.random() * d.edges.length)];
        pk.a = e[0];
        pk.b = e[1];
        pk.t = 0;
      }
      for (let k = 0; k < 3; k++) {
        packetPos[p * 3 + k] = pos[pk.a * 3 + k] + (pos[pk.b * 3 + k] - pos[pk.a * 3 + k]) * pk.t;
      }
    }
  }
}
