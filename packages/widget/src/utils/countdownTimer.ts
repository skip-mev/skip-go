export function createCountdownTimer({
  duration,
  onUpdate,
  onComplete,
}: {
  duration: number;
  onUpdate: (remainingTime: number) => void;
  onComplete?: () => void;
}) {
  let start: number | null = null;
  let animationFrameId: number | null = null;

  function step(timestamp: number) {
    if (!start) start = timestamp;

    const elapsed = timestamp - start;
    const remainingTime = Math.max(duration * 1_000 - elapsed, 0);

    onUpdate(remainingTime / 1_000);

    if (remainingTime > 0) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      if (onComplete) onComplete();
    }
  }

  function startCountdown() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
    start = null;
    animationFrameId = requestAnimationFrame(step);
  }

  function stopCountdown() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  return { startCountdown, stopCountdown };
}
