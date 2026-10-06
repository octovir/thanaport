// Match dense phone displays without allocating unbounded fullscreen buffers.
const PIXEL_BUDGET = 3_500_000;
export function scenePixelRatio(
  width,
  height,
  deviceRatio = window.devicePixelRatio || 1,
  maxTextureSize = 4096,
) {
  return Math.min(
    Math.max(1, deviceRatio),
    3,
    Math.sqrt(PIXEL_BUDGET / Math.max(1, width * height)),
    maxTextureSize / Math.max(1, width, height),
  );
}
