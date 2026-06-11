export const fadeOutAndPause = (
  audioElement: HTMLAudioElement | null,
  duration = 800,
) => {
  if (!audioElement || audioElement.paused) return;

  const startVolume = audioElement.volume;
  const stepTime = 50;
  const steps = duration / stepTime;
  const volumeStep = startVolume / steps;

  const interval = setInterval(() => {
    if (audioElement.volume > volumeStep) {
      audioElement.volume -= volumeStep;
    } else {
      clearInterval(interval);
      audioElement.pause();
      audioElement.volume = startVolume;
    }
  }, stepTime);
};
