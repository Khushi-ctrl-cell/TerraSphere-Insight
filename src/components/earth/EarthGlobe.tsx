import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Stars, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { indianLocations, type LocationData } from "@/data/mockData";

interface EarthMeshProps {
  onLocationClick: (loc: LocationData) => void;
  timeYear: number;
}

function EarthMesh({ onLocationClick, timeYear }: EarthMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y += delta * 0.03;
  });

  // Generate a procedural earth-like texture with vertex colors
  const earthGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(2, 64, 64);
    const colors = new Float32Array(geo.attributes.position.count * 3);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const lat = Math.asin(y / 2) * (180 / Math.PI);
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const lon = Math.atan2(x, z) * (180 / Math.PI);

      // Simple procedural coloring
      const noise = Math.sin(lat * 0.1) * Math.cos(lon * 0.15) * 0.5 + 0.5;
      const isOcean = noise < 0.45;
      const isPolar = Math.abs(lat) > 65;

      if (isPolar) {
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0;
      } else if (isOcean) {
        colors[i * 3] = 0.05; colors[i * 3 + 1] = 0.15 + noise * 0.15; colors[i * 3 + 2] = 0.35 + noise * 0.2;
      } else {
        const degradation = Math.max(0, (timeYear - 2020) * 0.015);
        colors[i * 3] = 0.12 + degradation * 0.3;
        colors[i * 3 + 1] = 0.4 - degradation * 0.1;
        colors[i * 3 + 2] = 0.08;
      }
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [timeYear]);

  // Convert lat/lon to 3D position
  const latLonToVec3 = (lat: number, lon: number, r: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  };

  return (
    <group>
      {/* Earth */}
      <mesh ref={meshRef} geometry={earthGeometry}>
        <meshPhongMaterial vertexColors shininess={15} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.08, 64, 64]} />
        <meshPhongMaterial color="#00aaff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {/* Location markers */}
      {indianLocations.map((loc) => {
        const pos = latLonToVec3(loc.lat, loc.lon, 2.05);
        const color = loc.riskLevel === "critical" ? "#ff3333" : loc.riskLevel === "high" ? "#ff8800" : "#00ddaa";
        return (
          <mesh
            key={loc.name}
            position={pos}
            onClick={(e) => { e.stopPropagation(); onLocationClick(loc); }}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={color} />
            <Html distanceFactor={8} style={{ pointerEvents: "none" }}>
              <div className="font-mono text-[9px] neon-text-blue whitespace-nowrap bg-background/60 px-1 rounded">
                {loc.name}
              </div>
            </Html>
          </mesh>
        );
      })}

      {/* Satellites */}
      <Satellite speed={1} radius={3} tilt={0.3} />
      <Satellite speed={0.7} radius={3.3} tilt={-0.5} />
      <Satellite speed={1.3} radius={2.8} tilt={0.8} />
    </group>
  );
}

function Satellite({ speed, radius, tilt }: { speed: number; radius: number; tilt: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 0.5) * tilt;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.04, 0.02, 0.04]} />
        <meshBasicMaterial color="#00ddff" />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0.06, 0, 0]}>
        <boxGeometry args={[0.06, 0.005, 0.03]} />
        <meshBasicMaterial color="#3366ff" />
      </mesh>
      <mesh position={[-0.06, 0, 0]}>
        <boxGeometry args={[0.06, 0.005, 0.03]} />
        <meshBasicMaterial color="#3366ff" />
      </mesh>
    </group>
  );
}

interface EarthGlobeProps {
  onLocationClick: (loc: LocationData) => void;
  timeYear: number;
}

export default function EarthGlobe({ onLocationClick, timeYear }: EarthGlobeProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4466ff" />
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0.2} />
        <EarthMesh onLocationClick={onLocationClick} timeYear={timeYear} />
        <OrbitControls enableZoom enablePan={false} minDistance={3.5} maxDistance={8} autoRotate={false} />
      </Canvas>
    </div>
  );
}
