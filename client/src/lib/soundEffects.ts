export function playCheeringSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;

    // Create a series of ascending tones for a "cheering" effect
    const notes = [
      { freq: 523.25, start: 0, duration: 0.1 },    // C5
      { freq: 659.25, start: 0.1, duration: 0.1 },  // E5
      { freq: 783.99, start: 0.2, duration: 0.15 }, // G5
      { freq: 1046.5, start: 0.35, duration: 0.2 }, // C6 - high note
    ];

    notes.forEach(({ freq, start, duration }) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.setValueAtTime(freq, now + start);
      osc.type = "sine";

      gain.gain.setValueAtTime(0.3, now + start);
      gain.gain.exponentialRampToValueAtTime(0.01, now + start + duration);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (e) {
    // Silently fail if audio context is not available
  }
}
