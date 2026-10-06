import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function GalleryScene({ progressRef, paused }) {
  const host = useRef(null);
  const pauseRef = useRef(paused);
  useEffect(() => {
    pauseRef.current = paused;
    host.current?.dispatchEvent(new Event("settingschange"));
  }, [paused]);
  useEffect(() => {
    let disposed = false;
    let cleanup;
    async function init() {
      const [T, { RoomEnvironment }, { RoundedBoxGeometry }] =
        await Promise.all([
          import("three"),
          import("three/addons/environments/RoomEnvironment.js"),
          import("three/addons/geometries/RoundedBoxGeometry.js"),
        ]);
      if (disposed) return;
      const container = host.current;
      let renderer;
      try {
        renderer = new T.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }
      renderer.setPixelRatio(
        Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.5),
      );
      renderer.setClearColor(0xffffff, 0);
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      container.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.z = 8;
      const room = new RoomEnvironment();
      const pmrem = new T.PMREMGenerator(renderer);
      let environment = pmrem.fromScene(room, 0.02);
      scene.environment = environment.texture;
      const materials = [],
        geometries = [];
      function glass(color, transmission = 0.83) {
        const material = new T.MeshPhysicalMaterial({
          color,
          transmission,
          roughness: 0.085,
          metalness: 0.08,
          thickness: 0.8,
          ior: 1.46,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
          envMapIntensity: 1.3,
          attenuationColor: color,
          attenuationDistance: 3,
        });
        materials.push(material);
        return material;
      }
      function shape(geometry) {
        geometries.push(geometry);
        return geometry;
      }
      const groups = Array.from({ length: 3 }, () => new T.Group());
      groups.forEach((group) => scene.add(group));
      const pane = shape(new RoundedBoxGeometry(1.65, 2.45, 0.16, 4, 0.08));
      ["#c9eaff", "#a4d9ff", "#6abaff", "#3e9ef4", "#1473d3"].forEach(
        (color, index) => {
          const mesh = new T.Mesh(pane, glass(color, 0.75));
          mesh.position.set(
            (index - 2) * 0.47,
            (index - 2) * 0.13,
            (index - 2) * -0.26,
          );
          mesh.rotation.set(0.06 * index, -0.1, -0.1);
          groups[0].add(mesh);
        },
      );
      const ring = shape(new T.TorusGeometry(1.13, 0.22, 28, 112));
      ["#b4e5ff", "#74b9f2", "#d9f3ff"].forEach((color, index) => {
        const mesh = new T.Mesh(ring, glass(color));
        mesh.rotation.set((index * Math.PI) / 3, index * 0.8, index * 0.3);
        groups[1].add(mesh);
      });
      const pearl = new T.Mesh(
        shape(new T.SphereGeometry(0.49, 48, 32)),
        glass("#227fd0", 0.6),
      );
      groups[1].add(pearl);
      const cube = shape(new RoundedBoxGeometry(0.71, 0.71, 0.71, 4, 0.12));
      for (let index = 0; index < 9; index++) {
        const mesh = new T.Mesh(
          cube,
          glass(["#cceaff", "#79bff5", "#348fdb"][index % 3], 0.74),
        );
        mesh.position.set(
          ((index % 3) - 1) * 0.89,
          (Math.floor(index / 3) - 1) * 0.89,
          0,
        );
        groups[2].add(mesh);
      }
      scene.add(new T.HemisphereLight(0xe9f6ff, 0x6793b9, 1));
      const key = new T.DirectionalLight(0xffffff, 2);
      key.position.set(-4, 5, 5);
      scene.add(key);
      const blue = new T.DirectionalLight(0x579fe5, 2);
      blue.position.set(4, -2, 3);
      scene.add(blue);
      const media = matchMedia("(prefers-reduced-motion: reduce)");
      let reduced = media.matches,
        visible = false,
        lost = false,
        frame = 0,
        last = 0,
        time = 0,
        pointerX = 0,
        pointerY = 0;
      let width = 1,
        height = 1;
      const trackingSurface = container.parentElement;
      function render(now) {
        frame = 0;
        if (lost || disposed) return;
        const delta = Math.min((now - (last || now)) / 1000, 0.05);
        last = now;
        if (!reduced && !pauseRef.current) time += delta;
        const p = progressRef.current;
        const mobile = width < 700;
        const viewWidth =
          2 *
          Math.tan(T.MathUtils.degToRad(17.5)) *
          camera.position.z *
          camera.aspect;
        groups.forEach((group, index) => {
          const offset = index - p * 2;
          group.visible = Math.abs(offset) < 1.3;
          group.position.set(
            offset * viewWidth + (mobile ? 0 : -viewWidth * 0.225),
            mobile ? 0.45 : 0,
            0,
          );
          const scale = mobile ? Math.min(0.62, viewWidth / 4.7) : 0.96;
          group.scale.setScalar(scale);
          group.rotation.set(
            [-0.19, 0.23, 0.35][index] + (reduced ? 0 : pointerY * 0.08),
            [-0.55, 0.3, -0.38][index] +
              Math.sin(time * 0.19) * 0.07 +
              (reduced ? 0 : pointerX * 0.14),
            [-0.22, -0.18, -0.22][index] + Math.sin(time * 0.25) * 0.035,
          );
          group.position.y += Math.sin(time * 0.65 + index) * 0.055;
        });
        groups[0].children.forEach((mesh, i) => {
          mesh.position.y =
            (i - 2) * 0.13 + Math.sin(time * 0.65 + i * 0.55) * 0.08;
        });
        groups[1].children.slice(0, 3).forEach((mesh, i) => {
          mesh.rotation.y = i * 0.8 + time * 0.055 * (i % 2 ? -1 : 1);
        });
        groups[2].children.forEach((mesh, i) => {
          mesh.position.z = Math.sin(time * 0.75 + i * 0.65) * 0.15;
        });
        renderer.render(scene, camera);
        container.dataset.ready = "true";
        if (visible && !document.hidden && !reduced && !pauseRef.current)
          frame = requestAnimationFrame(render);
      }
      function resume() {
        if (!frame && visible && !document.hidden && !lost) {
          last = 0;
          frame = requestAnimationFrame(render);
        }
      }
      function resize() {
        const bounds = container.getBoundingClientRect();
        width = bounds.width;
        height = bounds.height;
        if (!width || !height) return;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        resume();
      }
      function move(event) {
        if (event.pointerType === "touch" || reduced) return;
        const rect = container.getBoundingClientRect();
        pointerX = (event.clientX - rect.left) / width - 0.5;
        pointerY = (event.clientY - rect.top) / height - 0.5;
        resume();
      }
      function leave() {
        pointerX = 0;
        pointerY = 0;
        resume();
      }
      function motion(event) {
        reduced = event.matches;
        resume();
      }
      function contextLost(event) {
        event.preventDefault();
        lost = true;
        cancelAnimationFrame(frame);
        frame = 0;
        delete container.dataset.ready;
      }
      function contextRestored() {
        environment.dispose();
        environment = pmrem.fromScene(room, 0.02);
        scene.environment = environment.texture;
        lost = false;
        resize();
        resume();
      }
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) resume();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      });
      intersection.observe(container);
      trackingSurface.addEventListener("pointermove", move);
      trackingSurface.addEventListener("pointerleave", leave);

      container.addEventListener("settingschange", resume);
      document.addEventListener("visibilitychange", resume);
      media.addEventListener("change", motion);
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      renderer.domElement.addEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      resize();
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        intersection.disconnect();
        trackingSurface.removeEventListener("pointermove", move);
        trackingSurface.removeEventListener("pointerleave", leave);

        container.removeEventListener("settingschange", resume);
        document.removeEventListener("visibilitychange", resume);
        media.removeEventListener("change", motion);
        renderer.domElement.removeEventListener(
          "webglcontextlost",
          contextLost,
        );
        renderer.domElement.removeEventListener(
          "webglcontextrestored",
          contextRestored,
        );
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
        environment.dispose();
        pmrem.dispose();
        room.dispose();
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
    <div className="gallery-canvas" ref={host} aria-hidden="true">
      <div className="gallery-fallback">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
GalleryScene.propTypes = {
  progressRef: PropTypes.shape({ current: PropTypes.number }).isRequired,
  paused: PropTypes.bool.isRequired,
};
