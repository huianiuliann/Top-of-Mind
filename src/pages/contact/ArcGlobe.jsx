import { useRef, useEffect } from "react";
import { cn } from "../../lib/cn";
const globeLandMask =
  "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oKQUhIKyEhAUCkJAWAkICWUhIKAUhICyEhASykJASAkIDWUhICAUhYCyEhASykJAQCkIAWUlICQUhYCQEhASykJAQCgKAWUlICQUhYCQUhASykJASCgKASElIDQUhYCAUhACykpAaCgKASGtICQUhYCQUBQCQkpASCgKAQGlIAQElICQUBQCQkpASCgIASGhIAQUlICQUBQCAkpBaAgIASGhKAQElICQUBACQkJBCCooASGhKAQElICQEBACQkJRCAgoASGhJAQElIIQFBACQkNRCAooAaEhJASEhIJQVFACQkJBCAooASEoJASEhKIQFFICQlNICAoJASEoJASEhqIQFFICQlBICAhJRSGopASEoIAQFJICQlBICAhNBSEopASEopAQFJKCQlBJCAhJASEopASEoJAQFJoCQlBJCAhBASEoJAWFoJASFJoCQlBICwhBISEoJAWEoJIQEIoCQlBICgpBISUoNAWEoJAUEIoCQlBICghBJSUoFAWEoJAUFIJCSlBoCghBISkgBAWEoJAUEIJKSlAoCghBISkgBAWEoJAUEIJCUkAoCghFISkABJWEoBAUEIJCUkAICkhBISkABIWkgBAUEIpCUgAIKkhBISgAFIWkgBAUkIpKUgAIKkFBISgAFIWkABBUgIpCUAAICkEBISgAFZWgABBUgIJCUAAICkEBIKgAFYWgAhAUgIJAUAAqKkEBIKgAFYGgABAUggJAUAAqCkEBICgAFYGgABRUggJAUAEqCkEBIKgAFYGgAFQUggJAUAEqAkEBKKgABYCgAlQUigJAUAAqAkEBqCgEBYCgAFQUggJAUAEqAkEBqCgEBYCgAlQEggJQUQAqAEEBqCgEBYCgAlQEggJQUQAqAEUFqAgEBaCgAlQEigJQUQAKAEUFqAgEBaCgAFQEggpQUQgKQEUFqAgEFaCiAFQAggpQEQgKAEEBqAgEFaCiABSAggpREQgKQEEBqAgVFaCiABSAigJREQgqQEUBKAAUFaIiEBSAggJQEQoqQEWBKAAVBaIiVBSIggJQEAoqQMUAKBAFBaAiFFSAigJQACoKQEUgqBAFB6ACFFSAihJQICoKREUoqBAFJaJAVBSIihBQIAoKQEEoqBAVJaBAFBSIghBQIQpKQMGoKBAFIaBAFBSAglFQIQpKQIEoKAAFIaBCFJSAglFQIQpCQIGoKAAFI6BCFJSAglFRAApCQIEoKAEFo6AAFISAAlFQAgpGQIUoKAEFo6AAFISAAlFRAgpGQAEoGAEFo6AEFIyAClFwAgpGQQEoCAEFoqAEFIyAAlAQAgpEQYkoGAEVoqAEVIyCAlAQAipEQQmoGAEFoKAEVIyCElAQAipEQQmoGAEFoCAEVIiCElAxIgpEQQmoGAUFoCAEFIiCElARAgpARQgoAAUloGBEFICCElAQCgpARQgoEBUloCBEFICCElAgCgpAwQgoAAUloCBEFICCEFAACkpAQQgoAAUloAAUFICCEVAACkpAQQgoAAUhoAAUFICCEFAACkpAQSgoAAUh4AAUFICCEFAACkJAASgoAAUhoAAUlICCUFAACkJAgSgoAAUhoAAUlIACUFAACkJAASg4AAUhoAAUhIgCUFAACkJAASgoAQWgoAAUhIICUVAoCkJAASgoEQWgoEAUhIACUFAgCkBBASgIBQWioEAUhIACUFAgCkBBASgIAQWgoFAUgIACUFAiCkRBgSgIAQWgoEAUgIICUBAiCkRBoSgIEQWgoEAUgIICUBACCkBBoSgAFQWgoEQUiIJCURAiCkBBgSgQBQWgIEQUiIJCUQAiCkBBgSgQBQWiIEQUgIJCUSAqCkBBiSgQBYWiAEQUgIJCUSAKCkRBiCgABYWiAEQUgIJSUSAqCkQBiCgABYWiQEQUiAJSUSAKCkUBiCgQBYWiQEQUiAIQUQAKCkWBmCoQBaSiQEQUiAIQUSAKCkWBiCgQBaCiQBQUigIQUSAKCEWBiCgQBSCiQBQUigIRUSAKSEWBiCgQBSCiQBQQigIRUSAKQESBCCgUBSKiQBQQigIRUSAKQESBKCAUBSKiQBSAiAIRUSAKRESBKCAUBSKiQBSIiAIRUSgKRESBKAAUBSKiQByIiAJRQSgKRESBqBAVBSKiQBSIiAJRASgKRESBOBARBaKiUBSIiAJRASgKRESBKBARBaICUBSIiAJRISoKRESBKBARBaJCUBSIiAJxISIKRAWhKBARBaJCUBSIiAJRISAKRAWgKBARBaJCQBSIigJRICAKRIWgKBARBaJCQBSICkBRICAKRIWgKBARBaJCQBSICkFRICAKRIWAKBARBaJAQBSICkFRICIKRIWAKBARgqJAQBSICgFRICIORIGAKBAVAqJAQBSICgFRICIGRIGAKBAVAqJARBSIAgFRICIERIGAKBAVAqJARByIAgFRICoERIGAKBAVAqJARAiIAgFRICoERIGIKBAFAqJARAiIAgFRICoERIGIGBAFAqJAVAiIAgFRIAoERIGIEBAFAqJAVAiIAhExIAoERIGIEBAFAqJAVAiIAhExIAoERIGIEBAFAiJAFAiIAhEhIAoERIGoEBAFAmJAFAiIAhEhIAoERIAoEBAFImJAFAiIAhEhIAoERIAoEBAFIkJAFAiIAFEgIAoExIAoEBAFIkJAFAiIAFEgIAoExAAoEBAFIkBAFAiIAFEgIApEhAAoEBABIkBAFAiIAVAgIApEhAAoEBABoEAAFAgIAVAgIAJEgAAoEBABoEAAFIgIAVAgIAJAgAAoEBADoEBAFIgIAVAgIAJAgAAoEBACIEAABIAAARAgAAIAgAAIABACIEAABIAAARAAAAJAgAAIAAACIEAABIAAARAAAARAgBAIAAACIAAABIAAARAAAARAgAAIAAACIAAABIAAARAAAARAAAAIAAECIAAACIAAARAAAARAAAAIAAFCIAAACIAAARAAAgRAAAAIAAECIAAACIAAABAAAoRAAAAAAAEAIAAACIAAABAAAoRAAAAAAAEAIAAAAIEAABAAAIBAAAAAAAEAIAAAAIEAAAAAAABAAAAAAAEAIAAAAIEAAAAAAgBAAAAAAAEAIAAAAIAAAAAAAgBAAAAAAgEAQAAAAIEAACAAAABAAAAAAAEAQAAAAIAAAAAAAgAAAAAAAgEAQAAAAIAAAAAAAgCAAAAAAgEAAAAEAAAAAAAAAgCAAAAAAgEAAAAEAIAAAAAAAgAAAAAAAgEAAAAEAAAAAAAAAgAAAAgAAgAAAAAEAAAAAAAEAgAAAAgAAgAAAAAEAAAAAAAEAgAAAAgAAAAAAAAEAAAAAAAEAgAAAAgAAAAAAAAEAAAAAAAAAgAAAAgAAAAAAAAEAAAAEAAAAAAAAAgAAAAgAAAAAAAAEAAAAAAAAAgAAAAgAAAAAAAAEAAAAAAAAAgAAAAgAAAAAAAAEAAAAAAAAAgAAAAgAAAAAAAAEAAAAGAAAAAAAAAgAAAAAAAAAAAAAEAAAAAAAAAgAAAAAAAAEAAAAEAAAAAAAAAgAAAAAAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAACAAAAAAAAAAAAAAQAAAAAAAACAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const DEG_TO_RAD = Math.PI / 180;
const latLngToVec3 = (lat, lng) => [
  Math.cos(lat * DEG_TO_RAD) * Math.sin(lng * DEG_TO_RAD),
  Math.sin(lat * DEG_TO_RAD),
  Math.cos(lat * DEG_TO_RAD) * Math.cos(lng * DEG_TO_RAD),
];
const crossVec3 = (vecA, vecB) => [
  vecA[1] * vecB[2] - vecA[2] * vecB[1],
  vecA[2] * vecB[0] - vecA[0] * vecB[2],
  vecA[0] * vecB[1] - vecA[1] * vecB[0],
];
const normalizeVec3 = (vec) => {
  const length = Math.hypot(vec[0], vec[1], vec[2]) || 1;
  return [vec[0] / length, vec[1] / length, vec[2] / length];
};
const globeDotColor = [0.831, 0.831, 0.847, 0.6];
const arcHeadColor = [0.647, 0.706, 0.988];
const arcTailColor = [0.506, 0.549, 0.973];
const globeDotVertexShader = `attribute vec3 aPos; attribute float aSize; attribute vec4 aColor;
uniform mat3 uRot; uniform float uScale; uniform float uDpr;
varying vec4 vColor;
void main(){
  vec3 p = uRot * aPos;
  float hidden = step(p.z, 0.0) * step(length(p.xy), 1.0);
  float facing = clamp(p.z / length(aPos), 0.0, 1.0);
  gl_Position = vec4(p.xy * uScale, 0.0, 1.0);
  gl_PointSize = aSize * uDpr * (0.45 + 0.55 * facing) * (1.0 - hidden);
  vColor = aColor * (0.15 + 0.85 * facing) * (1.0 - hidden);
}`;
const globeDotFragmentShader = `precision mediump float;
varying vec4 vColor;
void main(){
  float d = length(gl_PointCoord - 0.5);
  gl_FragColor = vColor * (1.0 - smoothstep(0.3, 0.5, d));
}`;
const globeArcVertexShader = `attribute vec3 aA; attribute vec3 aB; attribute vec4 aP;
uniform mat3 uRot; uniform float uScale; uniform float uRes; uniform float uWidth;
varying float vT; varying float vVis; varying float vPhase;
vec3 arcAt(float t){
  float d = acos(clamp(dot(aA, aB), -1.0, 1.0));
  vec3 p = (sin((1.0 - t) * d) * aA + sin(t * d) * aB) / sin(d);
  return uRot * (p * (1.0 + aP.z * sin(3.14159265 * t)));
}
void main(){
  float t = aP.x;
  vec3 p = arcAt(t);
  vec2 dir = arcAt(min(t + 0.004, 1.0)).xy - arcAt(max(t - 0.004, 0.0)).xy;
  dir = normalize(dir + vec2(1e-7, 0.0));
  gl_Position = vec4(p.xy * uScale + vec2(-dir.y, dir.x) * aP.y * uWidth * 2.0 / uRes, 0.0, 1.0);
  vT = t;
  vVis = 1.0 - step(p.z, 0.0) * step(length(p.xy), 1.0);
  vPhase = aP.w;
}`;
const globeArcFragmentShader = `precision mediump float;
uniform float uTime; uniform float uCycle; uniform float uStatic; uniform vec3 uC1; uniform vec3 uC2;
varying float vT; varying float vVis; varying float vPhase;
void main(){
  float head = fract((uTime + vPhase) / uCycle) * 2.6;   // 0→1 draws, 1→1.8 leaves, then a gap
  float g = clamp((vT - (head - 0.8)) / 0.8, 0.0, 1.0);
  float dash = step(head - 0.8, vT) * step(vT, head) * pow(g, 1.6);
  float a = max(dash, 0.07 * smoothstep(0.0, 0.08, vT) * (1.0 - smoothstep(0.92, 1.0, vT)));
  a = mix(a, 0.55, uStatic) * vVis;
  gl_FragColor = vec4(mix(uC1, uC2, mix(g, 1.0, uStatic)) * a, a);
}`;
const ARC_CYCLE_SECONDS = 5.2;
const ORIGIN_RIPPLE_SECONDS = 2.6;
function buildGlobeDots() {
  const maskString = atob(globeLandMask);
  const maskBits = new Uint8Array(maskString.length);
  for (let byteIndex = 0; byteIndex < maskString.length; byteIndex++)
    maskBits[byteIndex] = maskString.charCodeAt(byteIndex);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const evenDots = [];
  const oddDots = [];
  for (let pointIndex = 0, landCount = 0; pointIndex < 40000; pointIndex++) {
    if (!(maskBits[pointIndex >> 3] & (1 << (pointIndex & 7)))) continue;
    const pointY = 1 - ((pointIndex + 0.5) * 2) / 40000;
    const ringRadius = Math.sqrt(1 - pointY * pointY);
    const theta = pointIndex * goldenAngle;
    (landCount++ % 2 ? oddDots : evenDots).push(
      Math.cos(theta) * ringRadius,
      pointY,
      Math.sin(theta) * ringRadius,
    );
  }
  return {
    data: new Float32Array(evenDots.concat(oddDots)),
    half: evenDots.length / 3,
    all: (evenDots.length + oddDots.length) / 3,
  };
}
function createGlProgram(gl, vertexSource, fragmentSource, attribNames) {
  const program = gl.createProgram();
  for (let [source, shaderType] of [
    [vertexSource, gl.VERTEX_SHADER],
    [fragmentSource, gl.FRAGMENT_SHADER],
  ]) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader) || "shader");
    gl.attachShader(program, shader);
  }
  attribNames.forEach((attribName, attribIndex) => gl.bindAttribLocation(program, attribIndex, attribName));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program) || "link");
  return { p: program, u: (uniformName) => gl.getUniformLocation(program, uniformName) };
}
export function ArcGlobe({ origin, targets, centerLng, className, ariaLabel }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const label = labelRef.current;
    if (!container || !canvas || !label) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let context = null;
    let rafId = 0;
    let isVisible = false;
    let isDisposed = false;
    let isContextLost = false;
    let renderFrame = () => {};
    let resize = () => {};
    let resizeObserver = null;
    const initGl = () => {
      context = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      if (!context) {
        container.dataset.fallback = "1";
        return;
      }
      const gl = context;
      canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        isContextLost = true;
        cancelAnimationFrame(rafId);
        delete container.dataset.ready;
        container.dataset.fallback = "1";
      });
      const dotProgram = createGlProgram(gl, globeDotVertexShader, globeDotFragmentShader, [
        "aPos",
        "aSize",
        "aColor",
      ]);
      const arcProgram = createGlProgram(gl, globeArcVertexShader, globeArcFragmentShader, [
        "aA",
        "aB",
        "aP",
      ]);
      const globeDots = buildGlobeDots();
      const dotBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, dotBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, globeDots.data, gl.STATIC_DRAW);
      const originVec = latLngToVec3(origin.lat, origin.lng);
      const segmentCount = 96;
      const arcVertices = [];
      const arcs = [];
      targets.forEach((target, targetIndex) => {
        const targetVec = latLngToVec3(target.lat, target.lng);
        const angle = Math.acos(
          Math.min(
            1,
            Math.max(
              -1,
              originVec[0] * targetVec[0] + originVec[1] * targetVec[1] + originVec[2] * targetVec[2],
            ),
          ),
        );
        const altitude = 0.04 + angle * 0.2;
        const phase = (targetIndex * ARC_CYCLE_SECONDS) / targets.length;
        arcs.push({ b: targetVec, ang: angle, alt: altitude, phase });
        for (let segment = 0; segment < segmentCount; segment++) {
          const segStart = segment / segmentCount;
          const segEnd = (segment + 1) / segmentCount;
          for (let [pathT, side] of [
            [segStart, -1],
            [segStart, 1],
            [segEnd, 1],
            [segStart, -1],
            [segEnd, 1],
            [segEnd, -1],
          ])
            arcVertices.push(...originVec, ...targetVec, pathT, side, altitude, phase);
        }
      });
      const arcBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, arcBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arcVertices), gl.STATIC_DRAW);
      const arcVertexCount = arcVertices.length / 10;
      const ringSegments = 72;
      const maxMarkers = ringSegments * 2 + targets.length * 2 + 1;
      const markerData = new Float32Array(maxMarkers * 8);
      const markerBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, markerBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, markerData, gl.DYNAMIC_DRAW);
      const tangentU = normalizeVec3(crossVec3([0, 1, 0], originVec));
      const tangentV = crossVec3(originVec, tangentU);
      let cssSize = 0;
      let dpr = 1;
      resize = () => {
        const width = container.clientWidth;
        if (!width) return;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        cssSize = width;
        canvas.width = canvas.height = Math.round(width * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (reducedMotion || !isVisible) renderFrame(performance.now());
      };
      const globeScale = 0.7;
      const baseYaw = -(centerLng ?? origin.lng) * DEG_TO_RAD;
      let dragYaw = 0;
      let dragPitch = 0;
      let isDragging = false;
      let lastPointerX = 0;
      let lastPointerY = 0;
      let lastFrameTime = 0;
      let elapsed = 0;
      canvas.addEventListener("pointerdown", (event) => {
        isDragging = true;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
        canvas.style.cursor = "grabbing";
      });
      canvas.addEventListener("pointermove", (event) => {
        if (!isDragging) return;
        dragYaw += (event.clientX - lastPointerX) * 0.006;
        dragPitch = Math.max(-0.3, Math.min(0.3, dragPitch + (event.clientY - lastPointerY) * 0.004));
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        if (reducedMotion) renderFrame(performance.now());
      });
      const endDrag = () => {
        isDragging = false;
        canvas.style.cursor = "";
      };
      canvas.addEventListener("pointerup", endDrag);
      canvas.addEventListener("pointercancel", endDrag);
      const rotationMatrix = new Float32Array(9);
      let lastTransform = "";
      let lastOpacity = "";
      renderFrame = (now) => {
        if (isContextLost || !cssSize) return;
        const dt = lastFrameTime ? Math.min(0.05, (now - lastFrameTime) / 1000) : 0;
        lastFrameTime = now;
        if (!reducedMotion) elapsed += dt;
        if (!isDragging && !reducedMotion) {
          dragYaw *= Math.exp(-dt / 6);
          dragPitch *= Math.exp(-dt / 3);
        }
        const yaw = baseYaw + (reducedMotion ? 0 : 0.6 * Math.sin((elapsed * 2 * Math.PI) / 34)) + dragYaw;
        const pitch = 0.42 + dragPitch;
        const cosYaw = Math.cos(yaw);
        const sinYaw = Math.sin(yaw);
        const cosPitch = Math.cos(pitch);
        const sinPitch = Math.sin(pitch);
        rotationMatrix.set([
          cosYaw,
          sinPitch * sinYaw,
          -cosPitch * sinYaw,
          0,
          cosPitch,
          sinPitch,
          sinYaw,
          -sinPitch * cosYaw,
          cosPitch * cosYaw,
        ]);
        const rotate = (point) => [
          cosYaw * point[0] + sinYaw * point[2],
          sinPitch * sinYaw * point[0] + cosPitch * point[1] - sinPitch * cosYaw * point[2],
          -cosPitch * sinYaw * point[0] + sinPitch * point[1] + cosPitch * cosYaw * point[2],
        ];
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        const radiusPx = (cssSize / 2) * globeScale;
        gl.useProgram(dotProgram.p);
        gl.uniformMatrix3fv(dotProgram.u("uRot"), false, rotationMatrix);
        gl.uniform1f(dotProgram.u("uScale"), globeScale);
        gl.uniform1f(dotProgram.u("uDpr"), dpr);
        gl.bindBuffer(gl.ARRAY_BUFFER, dotBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(2);
        gl.vertexAttrib1f(1, Math.max(1.2, Math.min(2.3, radiusPx * 0.0095)));
        gl.vertexAttrib4f(
          2,
          globeDotColor[0] * globeDotColor[3],
          globeDotColor[1] * globeDotColor[3],
          globeDotColor[2] * globeDotColor[3],
          globeDotColor[3],
        );
        gl.drawArrays(gl.POINTS, 0, radiusPx < 170 ? globeDots.half : globeDots.all);
        gl.useProgram(arcProgram.p);
        gl.uniformMatrix3fv(arcProgram.u("uRot"), false, rotationMatrix);
        gl.uniform1f(arcProgram.u("uScale"), globeScale);
        gl.uniform1f(arcProgram.u("uRes"), canvas.width);
        gl.uniform1f(arcProgram.u("uWidth"), 1 * dpr);
        gl.uniform1f(arcProgram.u("uTime"), elapsed);
        gl.uniform1f(arcProgram.u("uCycle"), ARC_CYCLE_SECONDS);
        gl.uniform1f(arcProgram.u("uStatic"), reducedMotion ? 1 : 0);
        gl.uniform3fv(arcProgram.u("uC1"), arcTailColor);
        gl.uniform3fv(arcProgram.u("uC2"), arcHeadColor);
        gl.bindBuffer(gl.ARRAY_BUFFER, arcBuffer);
        for (let attrib = 0; attrib < 3; attrib++) gl.enableVertexAttribArray(attrib);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 40, 0);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 40, 12);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 40, 24);
        gl.drawArrays(gl.TRIANGLES, 0, arcVertexCount);
        let markerCount = 0;
        const pushMarker = (position, size, color, alpha) => {
          markerData.set(
            [
              position[0],
              position[1],
              position[2],
              size,
              color[0] * alpha,
              color[1] * alpha,
              color[2] * alpha,
              alpha,
            ],
            markerCount * 8,
          );
          markerCount++;
        };
        for (let ringIndex = 0; ringIndex < 2; ringIndex++) {
          const ringProgress = reducedMotion
            ? 0.55 - ringIndex * 0.3
            : (elapsed / ORIGIN_RIPPLE_SECONDS + ringIndex / 2) % 1;
          const ringRadius = ringProgress * 6.5 * DEG_TO_RAD;
          const ringAlpha = (1 - ringProgress) * (1 - ringProgress) * 0.9;
          for (let step = 0; step < ringSegments; step++) {
            const stepAngle = (step / ringSegments) * Math.PI * 2;
            const offsetU = Math.cos(stepAngle) * Math.sin(ringRadius);
            const offsetV = Math.sin(stepAngle) * Math.sin(ringRadius);
            const cosRadius = Math.cos(ringRadius);
            pushMarker(
              [
                originVec[0] * cosRadius + tangentU[0] * offsetU + tangentV[0] * offsetV,
                originVec[1] * cosRadius + tangentU[1] * offsetU + tangentV[1] * offsetV,
                originVec[2] * cosRadius + tangentU[2] * offsetU + tangentV[2] * offsetV,
              ],
              1.6,
              arcTailColor,
              ringAlpha,
            );
          }
        }
        for (let { b: targetVec, ang: angle, alt: altitude, phase } of arcs) {
          const head = (((elapsed + phase) / ARC_CYCLE_SECONDS) % 1) * 2.6;
          const pulse = head >= 1 ? Math.exp(-(head - 1) * 2.2) : 0;
          pushMarker(targetVec, 3 + pulse * 3, arcHeadColor, reducedMotion ? 0.7 : 0.35 + 0.65 * pulse);
          if (!reducedMotion && head < 1) {
            const weightOrigin = Math.sin((1 - head) * angle) / Math.sin(angle);
            const weightTarget = Math.sin(head * angle) / Math.sin(angle);
            const lift = 1 + altitude * Math.sin(Math.PI * head);
            pushMarker(
              [
                (originVec[0] * weightOrigin + targetVec[0] * weightTarget) * lift,
                (originVec[1] * weightOrigin + targetVec[1] * weightTarget) * lift,
                (originVec[2] * weightOrigin + targetVec[2] * weightTarget) * lift,
              ],
              3.4,
              [0.78, 0.8, 0.996],
              1,
            );
          }
        }
        pushMarker(originVec, 6, [0.78, 0.8, 0.996], 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, markerBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, markerData.subarray(0, markerCount * 8));
        gl.useProgram(dotProgram.p);
        for (let attrib = 0; attrib < 3; attrib++) gl.enableVertexAttribArray(attrib);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
        gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 32, 12);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 32, 16);
        gl.drawArrays(gl.POINTS, 0, markerCount);
        const originScreen = rotate(originVec);
        const transform = `translate3d(${((cssSize / 2) * (1 + originScreen[0] * globeScale)).toFixed(1)}px, ${((cssSize / 2) * (1 - originScreen[1] * globeScale)).toFixed(1)}px, 0)`;
        const opacity = originScreen[2] > 0.25 ? "1" : "0";
        if (transform !== lastTransform) label.style.transform = lastTransform = transform;
        if (opacity !== lastOpacity) label.style.opacity = lastOpacity = opacity;
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();
      container.dataset.ready = "1";
    };
    const tick = (time) => {
      if (isDisposed || isContextLost || !isVisible) return;
      renderFrame(time);
      rafId = requestAnimationFrame(tick);
    };
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !context && !container.dataset.fallback)
          try {
            initGl();
          } catch {
            container.dataset.fallback = "1";
          }
        cancelAnimationFrame(rafId);
        if (!isVisible || !context) return;
        if (reducedMotion) renderFrame(performance.now());
        else rafId = requestAnimationFrame(tick);
      },
      { rootMargin: "240px 0px" },
    );
    intersectionObserver.observe(container);
    return () => {
      isDisposed = true;
      cancelAnimationFrame(rafId);
      intersectionObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, []);
  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      className={cn("group/globe relative mx-auto aspect-square w-full", className)}
    >
      <div
        aria-hidden
        className="absolute inset-[15%] rounded-full bg-[radial-gradient(circle_at_30%_25%,#26262d_0%,#1a1a1f_38%,#111114_72%)] shadow-[inset_0_0_0_1px_rgba(129,140,248,0.1),inset_0_0_40px_rgba(129,140,248,0.16),0_0_56px_-6px_rgba(91,84,245,0.42)]"
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full cursor-grab touch-pan-y" />
      <span
        ref={labelRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 opacity-0 transition-opacity duration-500 will-change-transform"
      >
        <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-white/10 bg-ink-900/95 px-3 py-1.5 font-mono text-[12px] whitespace-nowrap text-neutral-200 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]">
          <span className="size-1.5 rounded-full bg-accent-400" />
          {origin.label}
        </span>
      </span>
    </div>
  );
}
