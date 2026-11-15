import { Component, Suspense, useEffect, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';

export type Focus = 'overview' | 'simulation' | 'vision' | 'banking' | 'mosaic';
type Position = readonly [number, number, number];
const oxide = '#A94438';
const shots: Record<Focus, { eye: Position; target: Position }> = {
  overview: { eye: [5.6, 3.95, 8.7], target: [0, 0.97, 0] },
  simulation: { eye: [2.3, 4.1, 7.6], target: [-1.3, 0.8, 0.2] },
  vision: { eye: [5.2, 3.6, 7], target: [2.1, 1.9, -0.9] },
  banking: { eye: [-3.2, 2.9, 6.4], target: [-1.9, 0.7, 2.05] },
  mosaic: { eye: [5.7, 3.0, 6.7], target: [2.25, 0.65, 1.45] },
} as const;

function Camera({ focus, reduced }: { focus: Focus; reduced: boolean }) {
  const { camera, invalidate } = useThree();
  const target = useRef(new THREE.Vector3(...shots.overview.target));
  const destination = shots[focus];
  const eye = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  useEffect(() => { invalidate(); }, [destination, invalidate]);

  useFrame((_, delta) => {
    eye.current.set(...destination.eye);
    look.current.set(...destination.target);
    const blend = reduced ? 1 : 1 - Math.exp(-5 * Math.min(delta, 0.04));
    camera.position.lerp(eye.current, blend);
    target.current.lerp(look.current, blend);
    camera.lookAt(target.current);
    if (camera.position.distanceToSquared(eye.current) + target.current.distanceToSquared(look.current) > 0.00002) invalidate();
  });
  return null;
}

function Block({ position, size, color, metal = 0 }: {
  position: [number, number, number]; size: [number, number, number]; color: string; metal?: number;
}) {
  return <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} metalness={metal} roughness={0.82} />
  </mesh>;
}

const blocks = [
  [-2.9, -0.72, 0.78], [-2.25, -1.16, 1.1], [-1.57, -1.15, 0.56], [-0.91, -1.23, 1.35],
  [-2.95, 0.08, 0.52], [-2.19, -0.27, 0.69], [-1.46, -0.32, 0.8], [-0.57, -0.38, 0.64],
  [-2.83, 0.97, 0.69], [-2.02, 1.02, 0.35], [-1.31, 0.82, 0.53], [-0.49, 0.64, 0.97],
  [-2.78, 1.69, 0.31], [-1.94, 1.78, 0.55], [-1.15, 1.68, 0.39], [-0.4, 1.49, 0.63],
] as const;

function Façades() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const object = new THREE.Object3D();
    let index = 0;
    for (const [x, z, height] of blocks) {
      for (let floor = 0; floor < Math.floor(height / 0.13); floor++) {
        for (const offset of [-0.11, 0, 0.11]) {
          const y = 0.59 + floor * 0.13;
          object.position.set(x + offset, y, z + 0.237);
          object.rotation.y = 0;
          object.updateMatrix();
          mesh.current!.setMatrixAt(index++, object.matrix);
          object.position.set(x + 0.233, y, z + offset);
          object.rotation.y = Math.PI / 2;
          object.updateMatrix();
          mesh.current!.setMatrixAt(index++, object.matrix);
        }
      }
    }
    mesh.current!.count = index;
    mesh.current!.instanceMatrix.needsUpdate = true;
    mesh.current!.computeBoundingSphere();
  }, []);
  return <instancedMesh ref={mesh} args={[undefined, undefined, 900]} receiveShadow>
    <boxGeometry args={[0.054, 0.069, 0.009]} />
    <meshStandardMaterial color="#3e3934" metalness={0.28} roughness={0.56} />
  </instancedMesh>;
}

function City({ active, detailed, select }: { active: boolean; detailed: boolean; select: () => void }) {
  const curve = new THREE.CatmullRomCurve3([
    [-3.2, 0.83, 1.76], [-2.55, 1.1, 1.12], [-1.92, 1.28, 0.45], [-1.88, 1.48, -0.42], [-0.62, 1.74, -1.23],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  return <group onClick={event => { event.stopPropagation(); select(); }}>
    <Block position={[-1.7, 0.24, 0.3]} size={[3.9, 0.47, 3.7]} color="#9a8f80" />
    <Block position={[-1.7, 0.48, 0.3]} size={[3.75, 0.06, 3.52]} color="#6b6359" />
    {blocks.map(([x, z, height], index) => (
      <group key={index}>
        <Block position={[x, 0.51 + height / 2, z]} size={[0.46, height, 0.47]} color={['#988b78', '#c1b4a0', '#696561'][index % 3]} />
        <Block position={[x, 0.52 + height, z]} size={[0.32, 0.035, 0.31]} color="#d5cabc" />
        {!detailed && Array.from({ length: Math.floor(height / 0.21) }, (_, floor) => (
          <Block key={floor} position={[x, 0.65 + floor * 0.2, z + 0.237]} size={[0.32, 0.055, 0.012]} color="#413e3a" />
        ))}
      </group>
    ))}
    {detailed && <Façades />}
    <mesh>
      <tubeGeometry args={[curve, 36, active ? 0.036 : 0.024, 6, false]} />
      <meshStandardMaterial color={oxide} emissive={oxide} emissiveIntensity={active ? 0.75 : 0.2} />
    </mesh>
    {[curve.getPoint(0), curve.getPoint(0.55), curve.getPoint(1)].map((point, index) => (
      <mesh key={index} position={point}>
        <sphereGeometry args={[0.073, 12, 8]} />
        <meshBasicMaterial color="#f0a78c" />
      </mesh>
    ))}
    <group position={[-1.56, 2.12, -0.33]} rotation={[0.08, -0.25, -0.08]}>
      <Block position={[0, 0, 0]} size={[0.68, 0.23, 0.43]} color="#393636" metal={0.36} />
      <Block position={[0, -0.055, 0.24]} size={[0.23, 0.16, 0.13]} color="#191919" />
      {detailed && <mesh position={[0, -0.05, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.056, 0.056, 0.043, 20]} />
        <meshStandardMaterial color="#353e48" metalness={0.6} roughness={0.22} />
      </mesh>}
      {[[-0.6, -0.39], [-0.6, 0.39], [0.6, -0.39], [0.6, 0.39]].map(([x, z], index) => (
        <group key={index}>
          <mesh position={[x / 2, 0, z / 2]} rotation={[0, -Math.atan2(z, x), 0]} castShadow>
            <boxGeometry args={[0.75, 0.065, 0.085]} />
            <meshStandardMaterial color="#393636" metalness={0.35} />
          </mesh>
          <mesh position={[x, 0.056, z]} castShadow>
            <cylinderGeometry args={[0.105, 0.105, 0.132, 12]} />
            <meshStandardMaterial color="#383532" />
          </mesh>
          <Block position={[x, 0.122, z]} size={[0.51, 0.025, 0.079]} color="#242121" />
          <Block position={[x, 0.03, z + 0.105]} size={[0.1, 0.03, 0.01]} color={oxide} />
        </group>
      ))}
    </group>
  </group>;
}

function Display({ src, active, select, ready }: { src: string; active: boolean; select: () => void; ready: () => void }) {
  const texture = useLoader(THREE.TextureLoader, src);
  texture.colorSpace = THREE.SRGBColorSpace;
  useEffect(ready, [ready]);
  return <group position={[1.98, 1.92, -0.95]} rotation={[0, -0.24, -0.063]}
    onClick={event => { event.stopPropagation(); select(); }}>
    <Block position={[0, 0, 0]} size={[3.18, 2.29, 0.16]} color="#282725" metal={0.38} />
    <mesh position={[0, 0.025, 0.086]}>
      <planeGeometry args={[2.98, 2.07]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
    <Block position={[0, -1.081, 0.09]} size={[3.04, active ? 0.056 : 0.026, 0.015]} color={oxide} />
  </group>;
}

function DataPlate({ src, active, select }: { src: string; active: boolean; select: () => void }) {
  const texture = useLoader(THREE.TextureLoader, src);
  texture.colorSpace = THREE.SRGBColorSpace;
  return <group position={[-2.05, 0.75, 2.42]} rotation={[-0.23, 0.22, 0.07]} onClick={event => { event.stopPropagation(); select(); }}>
    <Block position={[0, 0, 0]} size={[2.05, 1.42, 0.11]} color="#282523" metal={0.3} />
    <mesh position={[0, 0, 0.06]}>
      <planeGeometry args={[1.92, 1.33]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
    <Block position={[0, -0.68, 0.068]} size={[1.9, active ? 0.046 : 0.017, 0.013]} color={oxide} />
  </group>;
}

function RequestStack({ active, select }: { active: boolean; select: () => void }) {
  return <group position={[2.25, 0.1, 1.52]} onClick={event => { event.stopPropagation(); select(); }}>
    {[0, 1, 2].map(index => (
      <group key={index} position={[index * 0.34, index * 0.27, index * -0.16]}>
        <Block position={[0, 0.18, 0]} size={[1.34, 0.22, 0.76]} color="#3d3630" metal={0.32} />
        <Block position={[0, 0.18, 0.386]} size={[1.2, active ? 0.034 : 0.018, 0.012]} color={oxide} />
        <mesh position={[0, 0.52, -0.06]} rotation={[-0.23, 0.1, 0]}>
          <planeGeometry args={[1.03, 0.52]} />
          <meshStandardMaterial color="#e3d4ba" transparent opacity={0.56} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    ))}
  </group>;
}

class SceneBoundary extends Component<{ failed: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.failed(); }
  render() { return this.state.failed ? null : this.props.children; }
}

interface SceneOptions {
  src: string;
  reduced: boolean;
  select: (focus: Focus) => void;
  ready: () => void;
  failed: () => void;
  bankingTexture?: string;
  initialFocus?: Focus;
}

export function mountScene(host: HTMLElement, options: SceneOptions) {
  const root = createRoot(host);
  const render = (focus: Focus, reduced = options.reduced) => root.render(
    <SceneBoundary failed={options.failed}>
      <Canvas dpr={[1, 1.5]} shadows frameloop="demand" camera={{ position: [...shots.overview.eye], fov: 39, near: 0.1, far: 55 }}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', options.failed, { once: true })}>
        <color attach="background" args={['#e3d7c6']} />
        <fog attach="fog" args={['#e3d7c6', 16, 33]} />
        <ambientLight color="#e3d1bf" intensity={1.15} />
        <directionalLight position={[-4, 7, 4]} color="#ffe2bc" intensity={3.15} castShadow
          shadow-mapSize={[1024, 1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={6}
          shadow-camera-bottom={-6} shadow-normalBias={0.025} />
        <directionalLight position={[3, 2, -4]} color="#f3e5db" intensity={1.05} />
        <Camera focus={focus} reduced={reduced} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial color="#b3a594" roughness={0.98} />
        </mesh>
        <Block position={[0, -0.14, 0.18]} size={[8.6, 0.32, 4.9]} color="#88786a" />
        <Block position={[0.33, 0.03, 2.15]} size={[6.7, 0.24, 0.34]} color={oxide} />
        <Block position={[2.16, 0.2, -0.83]} size={[2.05, 0.36, 1.8]} color="#a69682" />
        <Block position={[2.16, 0.56, -1.05]} size={[1.27, 0.56, 0.85]} color="#82776b" />
        <group position={[-2.1, 1.17, -2.1]} rotation={[0, -0.22, -0.74]}>
          <Block position={[0, 0, 0]} size={[0.33, 5.2, 0.23]} color={oxide} />
        </group>
        <Block position={[2.9, 0.66, -2.28]} size={[2.3, 1.37, 0.23]} color="#bbae9d" />
        {options.bankingTexture && <>
          {[-3.9, -0.9, 1.95, 4.6].map((x, index) => (
            <Block key={x} position={[x, 1.14 + index * 0.12, -2.8 - index * 0.025]}
              size={[2.52, 2.55 + index * 0.26, 0.14]} color={index % 2 === 0 ? '#c2b6a8' : '#a89b8d'} />
          ))}
          <Block position={[0.7, -0.09, 2.76]} size={[8.05, 0.14, 0.31]} color="#a79a86" />
        </>}
        <Suspense fallback={null}>
          <City active={focus === 'simulation'} detailed={Boolean(options.bankingTexture)} select={() => options.select('simulation')} />
          {options.bankingTexture && <>
            <DataPlate src={options.bankingTexture} active={focus === 'banking'} select={() => options.select('banking')} />
            <RequestStack active={focus === 'mosaic'} select={() => options.select('mosaic')} />
          </>}
          <Display src={options.src} active={focus === 'vision'} select={() => options.select('vision')} ready={options.ready} />
        </Suspense>
      </Canvas>
    </SceneBoundary>,
  );
  render(options.initialFocus ?? 'overview');
  return { render, dispose: () => root.unmount() };
}
