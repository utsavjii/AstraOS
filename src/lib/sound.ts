export function playStartupTone(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  const context = new AudioCtor();
  const gain = context.createGain();
  gain.gain.value = 0.035;
  gain.connect(context.destination);
  [220, 330, 494].forEach((frequency, index) => {
    const osc = context.createOscillator();
    osc.frequency.value = frequency;
    osc.type = "sine";
    osc.connect(gain);
    const start = context.currentTime + index * 0.09;
    osc.start(start);
    osc.stop(start + 0.18);
  });
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
