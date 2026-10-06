import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
});

test("high-density phones render both glass scenes at screen resolution, including after rotation", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator('.glass-scene[data-ready="true"] canvas');
  await expect(hero).toBeVisible();
  async function sharp(canvas) {
    await expect
      .poll(() =>
        canvas.evaluate((node) => {
          const box = node.getBoundingClientRect();
          return Math.min(node.width / box.width, node.height / box.height);
        }),
      )
      .toBeGreaterThan(2.8);
  }
  await sharp(hero);
  await page.goto("/#work");
  const gallery = page.locator('.gallery-canvas[data-ready="true"] canvas');
  await expect(gallery).toBeVisible();
  await sharp(gallery);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.getByRole("button", { name: "Show Thanaport" }).click();
  await sharp(gallery);
  await expect(
    page.getByRole("link", { name: "Thanaport", exact: true }),
  ).toBeInViewport();
});

test("the actual GPU surface stays outside its axis throughout the morph and closes its seam", async ({
  page,
}) => {
  const { surfaceVertex } = await import("../src/lib/glassShaders.js");
  await page.goto("/");
  const result = await page.evaluate((source) => {
    const gl = document.createElement("canvas").getContext("webgl2");
    const compile = (type, code) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const vertex = compile(
      gl.VERTEX_SHADER,
      "#version 300 es\nprecision highp float;\n" +
        source.split("void main()")[0].replaceAll("varying ", "out ") +
        "\nin vec2 sampleUv; out vec3 samplePoint; void main(){samplePoint=surface(sampleUv);gl_Position=vec4(0,0,0,1);}",
    );
    const fragment = compile(
      gl.FRAGMENT_SHADER,
      "#version 300 es\nprecision highp float;out vec4 color;void main(){color=vec4(1);}",
    );
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.transformFeedbackVaryings(
      program,
      ["samplePoint"],
      gl.INTERLEAVED_ATTRIBS,
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const uv = [];
    for (let a = 0; a <= 64; a++)
      for (let b = 0; b <= 32; b++) uv.push(a / 64, b / 32);
    const input = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, input);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, "sampleUv");
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    const output = gl.createBuffer();
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, output);
    gl.bufferData(
      gl.TRANSFORM_FEEDBACK_BUFFER,
      (uv.length / 2) * 3 * 4,
      gl.STREAM_READ,
    );
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, output);
    gl.enable(gl.RASTERIZER_DISCARD);
    let minimum = Infinity,
      seamError = 0;
    for (const morph of [0, 0.25, 0.5, 0.75, 1])
      for (const time of [0, 2.3, 8]) {
        for (const [name, value] of Object.entries({
          uMorph: morph,
          uTime: time,
          uDistortion: 1,
          uImpulse: 0.8,
        }))
          gl.uniform1f(gl.getUniformLocation(program, name), value);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, uv.length / 2);
        gl.endTransformFeedback();
        const points = new Float32Array((uv.length / 2) * 3);
        gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, points);
        for (let i = 0; i < uv.length / 2; i++)
          minimum = Math.min(
            minimum,
            points[i * 3] * Math.cos(uv[i * 2] * Math.PI * 2) +
              points[i * 3 + 1] * Math.sin(uv[i * 2] * Math.PI * 2),
          );
        for (let b = 0; b <= 32; b++)
          for (let c = 0; c < 3; c++)
            seamError = Math.max(
              seamError,
              Math.abs(points[b * 3 + c] - points[(64 * 33 + b) * 3 + c]),
            );
      }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return { minimum, seamError };
  }, surfaceVertex);
  expect(result.minimum).toBeGreaterThan(0.05);
  expect(result.seamError).toBeLessThan(0.00001);
});

test("vector typography follows each glass chapter without being rasterized with the scene", async ({
  page,
}) => {
  await page.goto("/");
  const type = page.locator(".glass-vector-type");
  await expect(type).toBeVisible();
  for (const [chapter, word] of [
    ["Form", "fluid."],
    ["Motion", "shift."],
    ["Play", "play."],
  ]) {
    await page
      .getByRole("button", { name: `Go to ${chapter} chapter` })
      .click();
    const text = type.locator("text").filter({ hasText: word });
    await expect(text).toHaveCSS("opacity", "1");
    const bounds = await text.evaluate((node) => node.getBBox().width);
    expect(bounds).toBeGreaterThan(100);
  }
});
