// A scene may wait indefinitely for a texture or a WebGL frame. The rules
// have already resolved the move; expiry only settles its presentation.
export function createMotionDeadline(expire: () => void) {
  let timer = window.setTimeout(expire, 3500);

  return {
    started(seconds: number) {
      window.clearTimeout(timer);
      const grace = Math.max(3, seconds * 0.75);
      timer = window.setTimeout(expire, (seconds + grace) * 1000);
    },
    dispose() {
      window.clearTimeout(timer);
    },
  };
}
