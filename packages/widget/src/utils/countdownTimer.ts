export function createCountdownTimer({
  duration,
  onUpdate,
  onComplete,
}: {
  duration: number;
  onUpdate?: (remainingTime: number) => void;
  onComplete?: () => void;
}) {
  let start: number | null = null;
  let animationFrameId: number | null = null;

  function step(timestamp: number) {
    if (!start) start = timestamp;

    const elapsed = timestamp - start;
    const remainingTime = Math.max(duration - elapsed, 0);

    onUpdate?.(remainingTime);

    if (remainingTime > 0) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      onComplete?.();
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
