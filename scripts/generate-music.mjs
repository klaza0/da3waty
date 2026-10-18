import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const sampleRate = 22050;
const duration = 28;

function clamp(value) {
  return Math.max(-1, Math.min(1, value));
}

function note(freq, t, attack = 0.08, release = 0.4, length = 1.6) {
  const env =
    t < 0
      ? 0
      : t < attack
        ? t / attack
        : t > length
          ? 0
          : t > length - release
            ? Math.max(0, (length - t) / release)
            : 1;
  return (
    Math.sin(2 * Math.PI * freq * t) * 0.55 * env +
    Math.sin(4 * Math.PI * freq * t) * 0.12 * env
  );
}

function writeWav(name, samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i += 1) {
    buffer.writeInt16LE(Math.round(clamp(samples[i]) * 32767), 44 + i * 2);
  }
  writeFileSync(join("public/music", name), buffer);
}

function render(pattern, padFreq) {
  const total = sampleRate * duration;
  const samples = new Float64Array(total);
  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    samples[i] += Math.sin(2 * Math.PI * padFreq * t) * 0.08 * (0.7 + 0.3 * Math.sin(t * 0.4));
    samples[i] += Math.sin(2 * Math.PI * (padFreq * 1.5) * t) * 0.03;
  }
  const step = 1.4;
  for (let beat = 0; beat * step < duration; beat += 1) {
    const freq = pattern[beat % pattern.length];
    const start = beat * step;
    for (let i = 0; i < sampleRate * 2; i += 1) {
      const idx = Math.floor((start + i / sampleRate) * sampleRate);
      if (idx >= total) break;
      samples[idx] += note(freq, i / sampleRate) * 0.22;
    }
  }
  return samples;
}

mkdirSync("public/music", { recursive: true });
writeWav("golden-dusk.wav", render([220, 261.63, 293.66, 329.63, 293.66, 246.94], 110));
writeWav("quiet-garden.wav", render([196, 246.94, 261.63, 293.66, 329.63, 261.63], 98));
writeWav("soft-oud.wav", render([146.83, 174.61, 196, 220, 246.94, 196], 73.4));
writeWav("moon-veil.wav", render([174.61, 196, 233.08, 261.63, 220, 174.61], 87));
console.log("music generated");
