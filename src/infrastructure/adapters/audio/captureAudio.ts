import { Howl, Howler } from "howler";

import shatter from "@/assets/audio/captures/break-frozen-card.mp3";
import flight from "@/assets/audio/captures/capture-flight.mp3";
import flame from "@/assets/audio/captures/flame-impact.mp3";
import flameRise from "@/assets/audio/captures/flame-rise.mp3";
import freeze from "@/assets/audio/captures/frozen-card-effect.mp3";
import heat from "@/assets/audio/captures/heat-transfer.mp3";
import capture from "@/assets/audio/captures/simple-capture.mp3";
import type { CaptureCue } from "@/domain/audio/captureCue";
import {
  readGamePreferences,
  subscribeGamePreferences,
} from "@/infrastructure/preferences/gamePreferences";

const clips = {
  flight: { src: flight, gain: 0.55 },
  capture: { src: capture, gain: 0.7 },
  "soft-contact": { src: capture, gain: 0.22 },
  freeze: { src: freeze, gain: 0.65 },
  shatter: { src: shatter, gain: 0.85 },
  heat: { src: heat, gain: 0.6 },
  "flame-rise": { src: flameRise, gain: 0.55 },
  flame: { src: flame, gain: 0.5 },
} satisfies Record<CaptureCue, { src: string; gain: number }>;

function voice(cue: CaptureCue) {
  if (cue === "flight") return "movement";
  if (cue === "flame-rise") return "buildup";
  if (cue === "heat") return "fire";
  if (cue === "flame") return "aftermath";
  return "impact";
}

/** Keep the flame aftermath through cascade pickups; reset stops every voice. */
export function createCaptureAudio() {
  const sounds = new Map<CaptureCue, Howl>();
  let disposed = false;
  const gains = new Map<CaptureCue, number>();
  const unsubscribe = subscribeGamePreferences(() => {
    const { volume, muted } = readGamePreferences();
    for (const [cue, sound] of sounds) {
      sound.volume(volume * (gains.get(cue) ?? clips[cue].gain));
      sound.mute(muted);
    }
  });
  function get(cue: CaptureCue, gain = clips[cue].gain) {
    gains.set(cue, gain);
    let sound = sounds.get(cue);
    if (!sound) {
      const { volume, muted } = readGamePreferences();
      sound = new Howl({
        src: [clips[cue].src],
        volume: volume * (gains.get(cue) ?? clips[cue].gain),
        mute: muted,
        loop: cue === "flame-rise",
      });
      sounds.set(cue, sound);
    } else {
      sound.volume(readGamePreferences().volume * gain);
    }
    return sound;
  }
  function stop() {
    for (const sound of sounds.values()) sound.stop();
  }
  return {
    preload() {
      if (!disposed) for (const cue of Object.keys(clips) as CaptureCue[]) get(cue);
    },
    unlock() {
      if (!disposed && Howler.ctx?.state === "suspended") void Howler.ctx.resume().catch(() => {});
    },
    playCapture(cue: CaptureCue) {
      if (disposed) return;
      for (const [playing, sound] of sounds) {
        if (
          voice(cue) === voice(playing) ||
          (cue === "flame" &&
            (voice(playing) === "buildup" ||
              voice(playing) === "fire" ||
              voice(playing) === "impact"))
        )
          sound.stop();
      }
      get(cue).play();
      // Preserve a physical card contact beneath elemental effects, at 31% of its normal gain.
      if (cue === "shatter") get("capture", 0.22).play();
    },
    stop,
    dispose() {
      if (disposed) return;
      disposed = true;
      unsubscribe();
      stop();
      for (const sound of sounds.values()) sound.unload();
      sounds.clear();
    },
  };
}
