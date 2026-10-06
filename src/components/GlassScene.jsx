import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { scenePixelRatio } from "../lib/renderQuality";
import {
  surfaceVertex,
  surfaceFragment,
  backdropVertex,
  backdropFragment,
} from "../lib/glassShaders";

export default function GlassScene({
  progressRef,
  material,
  distortion,
  dispersion,
  paused,
}) {
  const host = useRef(null);
  const typography = useRef(null);
  const settings = useRef({ material, distortion, dispersion, paused });
  useEffect(() => {
    settings.current = { material, distortion, dispersion, paused };
    host.current?.dispatchEvent(new Event("settingschange"));
  }, [material, distortion, dispersion, paused]);

  useEffect(() => {
    let disposed = false;
    let cleanup;
    async function init() {
      const T = await import("three");
      if (disposed) return;
      const container = host.current;
      let renderer;
      try {
        renderer = new T.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        return;
      }

      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      const typeNodes = typography.current.querySelectorAll("text");
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.z = 7.8;
      const backdrop = new T.Scene();
      const backdropCamera = new T.Camera();
      const target = new T.WebGLRenderTarget(1, 1, {
        depthBuffer: false,
        stencilBuffer: false,
      });
      const textures = [];
      function paintType(canvas, word) {
        const rect = container.getBoundingClientRect();
        const mobile = rect.width < 700;
        const ratio = scenePixelRatio(
          rect.width,
          rect.height,
          devicePixelRatio,
          renderer.capabilities.maxTextureSize,
        );
        canvas.height = Math.max(1, Math.floor(rect.height * ratio));
        canvas.width = Math.max(1, Math.floor(rect.width * ratio));
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `500 ${canvas.width * (mobile ? 0.36 : 0.29)}px "Manrope", sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#163651";
        ctx.fillText(
          word,
          canvas.width * 0.043,
          canvas.height * (mobile ? 0.37 : 0.48),
        );
      }
      function makeType(word) {
        const canvas = document.createElement("canvas");
        paintType(canvas, word);
        const texture = new T.CanvasTexture(canvas);
        texture.userData.word = word;
        textures.push(texture);
        return texture;
      }
      await document.fonts.ready;
      if (disposed) {
        renderer.dispose();
        renderer.domElement.remove();
        target.dispose();
        return;
      }
      const backgroundMaterial = new T.ShaderMaterial({
        vertexShader: backdropVertex,
        fragmentShader: backdropFragment,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTypeOne: { value: makeType("fluid.") },
          uTypeTwo: { value: makeType("shift.") },
          uTypeThree: { value: makeType("play.") },
          uProgress: { value: 0 },
          uAspect: { value: 1 },
        },
      });
      const backgroundGeometry = new T.PlaneGeometry(2, 2);
      backdrop.add(new T.Mesh(backgroundGeometry, backgroundMaterial));
      const uniforms = {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uDistortion: { value: 0.35 },
        uImpulse: { value: 0 },
        uBackdrop: { value: target.texture },
        uResolution: { value: new T.Vector2() },
        uDispersion: { value: 0.45 },
        uFrost: { value: 0 },
        uChrome: { value: 0 },
      };
      const shader = new T.ShaderMaterial({
        vertexShader: surfaceVertex,
        fragmentShader: surfaceFragment,
        uniforms,
        side: T.DoubleSide,
      });
      const geometry = new T.PlaneGeometry(1, 1, 192, 128);
      const sculpture = new T.Group();
      const main = new T.Mesh(geometry, shader);
      sculpture.add(main);
      const satelliteGeometry = new T.SphereGeometry(1, 40, 24);
      const satelliteMaterial = new T.ShaderMaterial({
        vertexShader: `varying vec3 vNormal;varying vec3 vView;varying vec3 vPosition;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);vPosition=position;gl_Position=projectionMatrix*p;}`,
        fragmentShader: surfaceFragment,
        uniforms,
      });
      const satellites = Array.from({ length: 5 }, () => {
        const mesh = new T.Mesh(satelliteGeometry, satelliteMaterial);
        sculpture.add(mesh);
        return mesh;
      });
      scene.add(sculpture);
      const media = matchMedia("(prefers-reduced-motion: reduce)");
      let reduced = media.matches,
        visible = true,
        lost = false,
        frame = 0,
        last = 0,
        elapsed = 0;
      let smoothProgress = progressRef.current,
        pointerX = 0,
        pointerY = 0,
        dragX = 0,
        dragY = 0,
        dragging = false,
        prevX = 0,
        prevY = 0,
        impulse = 0;
      let width = 1,
        height = 1;
      const lerp = T.MathUtils.lerp;
      const smooth = T.MathUtils.smoothstep;
      function resize() {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        if (!width || !height) return;
        renderer.setPixelRatio(
          scenePixelRatio(
            width,
            height,
            devicePixelRatio,
            renderer.capabilities.maxTextureSize,
          ),
        );
        renderer.setSize(width, height);
        typography.current.setAttribute("viewBox", `0 0 ${width} ${height}`);
        typeNodes.forEach((node) => {
          node.setAttribute("x", width * 0.043);
          node.setAttribute("y", height * (width < 700 ? 0.37 : 0.48));
          node.setAttribute("font-size", width * (width < 700 ? 0.36 : 0.29));
        });
        textures.forEach((texture) => texture.dispose());
        textures.length = 0;
        for (const [key, word] of [
          ["uTypeOne", "fluid."],
          ["uTypeTwo", "shift."],
          ["uTypeThree", "play."],
        ]) {
          backgroundMaterial.uniforms[key].value = makeType(word);
        }
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const size = renderer.getDrawingBufferSize(new T.Vector2());
        target.setSize(size.x, size.y);
        uniforms.uResolution.value.copy(size);
        backgroundMaterial.uniforms.uAspect.value = width / height;
        resume();
      }
      function render(now) {
        frame = 0;
        if (lost || disposed) return;
        const dt = Math.min((now - (last || now)) / 1000, 0.05);
        last = now;
        const config = settings.current;
        if (!reduced && !config.paused) elapsed += dt;
        smoothProgress = reduced
          ? progressRef.current
          : lerp(smoothProgress, progressRef.current, 1 - Math.exp(-dt * 7));
        const p = smoothProgress;
        const orbit = smooth(p, 0.24, 0.55);
        const returnToLiquid = smooth(p, 0.7, 1);
        const separation = orbit * (1 - returnToLiquid * 0.45);
        impulse = lerp(impulse, dragging ? 0.8 : 0, 0.08);
        uniforms.uTime.value = elapsed;
        uniforms.uMorph.value = orbit;
        uniforms.uImpulse.value = impulse;
        uniforms.uDistortion.value = config.distortion;
        uniforms.uDispersion.value = config.dispersion;
        uniforms.uFrost.value = lerp(
          uniforms.uFrost.value,
          config.material === "Frost" ? 1 : 0,
          reduced || config.paused ? 1 : 0.1,
        );
        uniforms.uChrome.value = lerp(
          uniforms.uChrome.value,
          config.material === "Chrome" ? 1 : 0,
          reduced || config.paused ? 1 : 0.1,
        );
        backgroundMaterial.uniforms.uProgress.value = p;
        const firstTransition = smooth(p, 0.18, 0.43);
        const secondTransition = smooth(p, 0.62, 0.85);
        [
          (1 - firstTransition) * (1 - secondTransition),
          firstTransition * (1 - secondTransition),
          secondTransition,
        ].forEach((opacity, index) => {
          typeNodes[index].style.opacity = opacity;
        });
        const mobile = width < 700;
        sculpture.position.set(
          mobile ? 0.12 : 0.9,
          (mobile ? 0.2 : 0.08) + Math.sin(elapsed * 0.45) * 0.04,
          0,
        );
        const scale = mobile ? 0.5 : 1.06;
        sculpture.scale.setScalar(scale);
        main.rotation.set(
          0.24 + p * 0.8 + dragY + (reduced ? 0 : pointerY * 0.13),
          -0.35 + p * 2.1 + dragX + (reduced ? 0 : pointerX * 0.22),
          -0.32 + p * 0.9,
        );
        main.scale.setScalar(1 - separation * 0.25);
        satellites.forEach((mesh, i) => {
          const angle = (i * Math.PI * 2) / 5 + elapsed * 0.15 + p * 2;
          mesh.position.set(
            Math.cos(angle) * (1.65 + separation * 0.5),
            Math.sin(angle) * 1.5,
            Math.sin(angle + 1) * 0.6,
          );
          mesh.scale.setScalar(
            Math.max(0.001, separation * (0.2 + (i % 3) * 0.07)),
          );
        });
        renderer.setRenderTarget(target);
        renderer.render(backdrop, backdropCamera);
        renderer.setRenderTarget(null);
        // The browser draws sharp vector type behind this transparent canvas.
        // Only its refracted image is rasterized into the offscreen target.
        renderer.autoClear = true;
        renderer.render(scene, camera);
        container.dataset.ready = "true";
        container.dataset.phase =
          p < 0.34 ? "fluid" : p < 0.72 ? "orbit" : "play";
        if (
          visible &&
          !document.hidden &&
          ((!reduced && !config.paused) ||
            Math.abs(p - progressRef.current) > 0.001 ||
            dragging)
        )
          frame = requestAnimationFrame(render);
      }
      function resume() {
        if (!frame && visible && !document.hidden && !lost) {
          last = 0;
          frame = requestAnimationFrame(render);
        }
      }
      function move(e) {
        const rect = container.getBoundingClientRect();
        pointerX = (e.clientX - rect.left) / width - 0.5;
        pointerY = (e.clientY - rect.top) / height - 0.5;
        if (dragging) {
          dragX += (e.clientX - prevX) * 0.007;
          dragY += (e.clientY - prevY) * 0.007;
          prevX = e.clientX;
          prevY = e.clientY;
          resume();
        }
      }
      function down(e) {
        if (e.pointerType === "touch") return;
        dragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
        container.setPointerCapture(e.pointerId);
        container.dataset.dragging = "true";
        resume();
      }
      function up() {
        dragging = false;
        delete container.dataset.dragging;
        resume();
      }
      function motion(e) {
        reduced = e.matches;
        resume();
      }
      function contextRestored() {
        lost = false;
        resize();
        resume();
      }
      function keyboard(e) {
        if (
          !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        )
          return;
        e.preventDefault();
        if (e.key === "ArrowLeft") dragX -= 0.15;
        if (e.key === "ArrowRight") dragX += 0.15;
        if (e.key === "ArrowUp") dragY -= 0.15;
        if (e.key === "ArrowDown") dragY += 0.15;
        resume();
      }
      function contextLost(e) {
        e.preventDefault();
        lost = true;
        cancelAnimationFrame(frame);
        frame = 0;
        delete container.dataset.ready;
      }
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else resume();
      });
      intersection.observe(container);
      container.addEventListener("keydown", keyboard);
      renderer.domElement.addEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      container.addEventListener("pointermove", move);
      container.addEventListener("pointerdown", down);
      container.addEventListener("pointerup", up);
      container.addEventListener("pointercancel", up);
      container.addEventListener("settingschange", resume);
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      window.addEventListener("scroll", resume, { passive: true });
      document.addEventListener("visibilitychange", resume);
      media.addEventListener("change", motion);
      resize();
      resume();
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        intersection.disconnect();
        container.removeEventListener("keydown", keyboard);
        renderer.domElement.removeEventListener(
          "webglcontextrestored",
          contextRestored,
        );
        container.removeEventListener("pointermove", move);
        container.removeEventListener("pointerdown", down);
        container.removeEventListener("pointerup", up);
        container.removeEventListener("pointercancel", up);
        container.removeEventListener("settingschange", resume);
        window.removeEventListener("scroll", resume);
        document.removeEventListener("visibilitychange", resume);
        media.removeEventListener("change", motion);
        renderer.domElement.removeEventListener(
          "webglcontextlost",
          contextLost,
        );
        geometry.dispose();
        satelliteGeometry.dispose();
        shader.dispose();
        satelliteMaterial.dispose();
        backgroundGeometry.dispose();
        backgroundMaterial.dispose();
        textures.forEach((t) => t.dispose());
        target.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        delete container.dataset.ready;
      };
    }
    init().catch(() => {});
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [progressRef]);
  return (
    <div
      className="glass-scene"
      ref={host}
      tabIndex={0}
      aria-label="Interactive liquid glass sculpture. Drag or use arrow keys to rotate; material controls are available below."
      role="img"
    >
      <svg
        ref={typography}
        className="glass-vector-type"
        aria-hidden="true"
        focusable="false"
      >
        {["fluid.", "shift.", "play."].map((word, index) => (
          <text
            key={word}
            dominantBaseline="middle"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            {word}
          </text>
        ))}
      </svg>
      <div className="glass-fallback" aria-hidden="true">
        <span>fluid.</span>
        <small className="fallback-label">STATIC GLASS STUDY</small>
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
GlassScene.propTypes = {
  progressRef: PropTypes.shape({ current: PropTypes.number }).isRequired,
  material: PropTypes.string.isRequired,
  distortion: PropTypes.number.isRequired,
  dispersion: PropTypes.number.isRequired,
  paused: PropTypes.bool.isRequired,
};
