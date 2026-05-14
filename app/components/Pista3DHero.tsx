"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Sparkles, Text } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// === Venue config: relative positions in the 3D world ===
// Coordinates roughly map to real-world layout of the 3 venues
type VenueId = "glories" | "nau" | "rambleta";

type Venue = {
  id: VenueId;
  name: string;
  shortName: string;
  position: [number, number, number];
  color: string;
  emissive: string;
  description: string;
  href: string;
};

const VENUES: Venue[] = [
  {
    id: "glories",
    name: "Westfield Glòries",
    shortName: "Glòries",
    position: [-6, 0, 4],
    color: "#ff375f",
    emissive: "#ff1f4f",
    description: "Seu principal · Pàrquing 2h gratis · Inscripcions",
    href: "/seu/westfield-glories",
  },
  {
    id: "nau",
    name: "La Nau del Clot",
    shortName: "Nau Clot",
    position: [0, 0, -2],
    color: "#f5b841",
    emissive: "#d99a1f",
    description: "Pavelló cobert oficial · Categories formatives",
    href: "/seu/nau-del-clot",
  },
  {
    id: "rambleta",
    name: "Rambleta del Clot",
    shortName: "Rambleta",
    position: [6, 0, 4],
    color: "#21c7a8",
    emissive: "#0f9f70",
    description: "Pista exterior · Bàsquet de carrer",
    href: "/seu/rambleta-del-clot",
  },
];

// === Court: a 3D basketball court ===
function Court({
  venue,
  selected,
  onSelect,
}: {
  venue: Venue;
  selected: boolean;
  onSelect: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5 + venue.position[0]) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * (selected ? 1.2 : 0.4);
      const scale = 1 + Math.sin(t * 2) * 0.05 + (selected ? 0.15 : 0);
      ringRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} position={venue.position}>
      {/* Court floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <planeGeometry args={[3.8, 3.8]} />
        <meshStandardMaterial
          color={venue.color}
          emissive={venue.emissive}
          emissiveIntensity={selected ? 1.8 : hovered ? 1.4 : 1.0}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Court line — center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.6, 0.7, 32]} />
        <meshBasicMaterial color="#fff7ef" transparent opacity={0.85} />
      </mesh>

      {/* Court line — three-point arc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.6]}>
        <ringGeometry args={[1.1, 1.18, 32, 1, Math.PI * 0.2, Math.PI * 0.6]} />
        <meshBasicMaterial color="#fff7ef" transparent opacity={0.7} />
      </mesh>

      {/* Pulsing ring around the court */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[1.7, 1.9, 64]} />
        <meshBasicMaterial color={venue.color} transparent opacity={0.45} />
      </mesh>

      {/* Hoop pole */}
      <mesh position={[0, 0.9, -1.4]}>
        <cylinderGeometry args={[0.04, 0.05, 1.8, 8]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Backboard */}
      <mesh position={[0, 1.6, -1.3]}>
        <boxGeometry args={[0.9, 0.55, 0.04]} />
        <meshStandardMaterial color="#fff7ef" emissive="#fff7ef" emissiveIntensity={0.15} />
      </mesh>

      {/* Hoop ring */}
      <mesh position={[0, 1.45, -1.18]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.025, 12, 24]} />
        <meshStandardMaterial color="#ff6a3d" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Floating label */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.38}
          color="#fff7ef"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000"
        >
          {venue.shortName.toUpperCase()}
        </Text>
      </Float>

      {/* Sparkles when selected */}
      {selected && (
        <Sparkles count={40} scale={4} size={3} speed={0.6} color={venue.color} />
      )}

      {/* Spotlight from above */}
      <pointLight
        position={[0, 4, 0]}
        intensity={selected ? 6 : 2.5}
        color={venue.color}
        distance={6}
        decay={1.8}
      />
    </group>
  );
}

// === Path connecting venues with animated dashes ===
function VenuePath() {
  const lineRef = useRef<THREE.Line>(null);
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...VENUES[0].position).add(new THREE.Vector3(0, 0.05, 0)),
      new THREE.Vector3(-3, 0.05, 1),
      new THREE.Vector3(...VENUES[1].position).add(new THREE.Vector3(0, 0.05, 0)),
      new THREE.Vector3(3, 0.05, 1),
      new THREE.Vector3(...VENUES[2].position).add(new THREE.Vector3(0, 0.05, 0)),
    ]);
    return curve.getPoints(80);
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineDashedMaterial;
      material.dashSize = 0.3;
      material.gapSize = 0.2;
      // Animate the offset to create a "flowing" feel
      // (Three.js doesn't have built-in offset for LineDashedMaterial, simulate via dashOffset hack)
    }
  });

  return (
    // @ts-expect-error r3f line element
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#ff375f" linewidth={2} transparent opacity={0.55} />
    </line>
  );
}

// === Ball running between courts ===
function FlowingBall() {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(...VENUES[0].position),
        new THREE.Vector3(-3, 0.6, 1),
        new THREE.Vector3(...VENUES[1].position),
        new THREE.Vector3(3, 0.6, 1),
        new THREE.Vector3(...VENUES[2].position),
        new THREE.Vector3(3, 0.6, 1),
        new THREE.Vector3(...VENUES[1].position),
        new THREE.Vector3(-3, 0.6, 1),
      ],
      true,
    );
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = (state.clock.elapsedTime / 14) % 1;
    const pos = curve.getPoint(t);
    const bounce = Math.abs(Math.sin(state.clock.elapsedTime * 6)) * 0.5;
    meshRef.current.position.set(pos.x, pos.y + bounce + 0.4, pos.z);
    meshRef.current.rotation.x += 0.18;
    meshRef.current.rotation.y += 0.12;

    if (trailRef.current) {
      trailRef.current.position.copy(meshRef.current.position);
      trailRef.current.position.y = 0.02;
      trailRef.current.scale.setScalar(0.6 - bounce * 0.4);
    }
  });

  return (
    <>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#f5b841"
          emissive="#d99a1f"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      {/* Shadow ring */}
      <mesh ref={trailRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.4} />
      </mesh>
    </>
  );
}

// === Buildings around for context ===
function BuildingCluster() {
  const buildings = useMemo(() => {
    const items: Array<{ pos: [number, number, number]; size: [number, number, number] }> = [];
    const rng = mulberry32(42);
    for (let i = 0; i < 26; i++) {
      const radius = 10 + rng() * 8;
      const angle = rng() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const h = 1 + rng() * 5;
      const w = 1 + rng() * 1.6;
      const d = 1 + rng() * 1.6;
      // Avoid placing too close to venues
      const tooClose = VENUES.some((v) => {
        const dx = v.position[0] - x;
        const dz = v.position[2] - z;
        return Math.sqrt(dx * dx + dz * dz) < 4;
      });
      if (!tooClose) items.push({ pos: [x, h / 2, z], size: [w, h, d] });
    }
    return items;
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.pos} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial
            color="#1a1d24"
            emissive="#3a2a32"
            emissiveIntensity={0.08}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}
      {/* Streetlights */}
      {buildings.slice(0, 8).map((b, i) => (
        <pointLight
          key={`l${i}`}
          position={[b.pos[0], b.pos[1] + b.size[1] / 2, b.pos[2]]}
          intensity={0.4}
          color="#f5b841"
          distance={5}
          decay={2}
        />
      ))}
    </group>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// === Ground plane ===
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[80, 80, 32, 32]} />
      <meshStandardMaterial
        color="#07080a"
        emissive="#0a0c12"
        emissiveIntensity={0.4}
        metalness={0.4}
        roughness={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// === Grid overlay on the ground (subtle, neon) ===
function NeonGrid() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      const material = ref.current.material as THREE.Material;
      if ("opacity" in material) {
        (material as THREE.LineBasicMaterial).opacity = 0.18 + Math.sin(t) * 0.05;
      }
    }
  });
  return (
    <gridHelper
      ref={ref}
      args={[60, 60, "#ff375f", "#171a22"]}
      position={[0, 0.001, 0]}
    />
  );
}

// === Camera fly-to controller — only active when a venue is selected ===
function CameraController({ targetVenue }: { targetVenue: Venue | null }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());
  const animating = useRef(false);
  const progress = useRef(0);

  useEffect(() => {
    if (targetVenue) {
      targetPos.current.set(
        targetVenue.position[0] * 0.6,
        4.5,
        targetVenue.position[2] + 5,
      );
      lookAt.current.set(...targetVenue.position);
      animating.current = true;
      progress.current = 0;
    } else {
      animating.current = false;
    }
  }, [targetVenue]);

  useFrame(() => {
    if (!animating.current) return;
    camera.position.lerp(targetPos.current, 0.06);
    camera.lookAt(lookAt.current);
    progress.current += 0.06;
    if (progress.current > 1.5) animating.current = false;
  });

  return null;
}

// === Main scene ===
function Scene({
  selectedVenue,
  onSelect,
}: {
  selectedVenue: VenueId | null;
  onSelect: (id: VenueId | null) => void;
}) {
  const selectedVenueObj = VENUES.find((v) => v.id === selectedVenue) || null;

  return (
    <>
      <fog attach="fog" args={["#020308", 28, 60]} />
      <color attach="background" args={["#040510"]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 12, 8]} intensity={1.0} castShadow color="#fff7ef" />
      <pointLight position={[0, 8, 0]} intensity={1.2} color="#ff375f" distance={25} />
      <pointLight position={[-8, 6, 4]} intensity={0.8} color="#21c7a8" distance={18} />
      <pointLight position={[8, 6, 4]} intensity={0.8} color="#f5b841" distance={18} />

      <Stars radius={60} depth={20} count={1200} factor={3} fade speed={0.5} />

      <NeonGrid />
      <Ground />

      <BuildingCluster />

      <VenuePath />
      <FlowingBall />

      {VENUES.map((v) => (
        <Court
          key={v.id}
          venue={v}
          selected={selectedVenue === v.id}
          onSelect={() => onSelect(selectedVenue === v.id ? null : v.id)}
        />
      ))}

      <CameraController targetVenue={selectedVenueObj} />

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={22}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.4}
        autoRotate={!selectedVenue}
        autoRotateSpeed={0.6}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

// === Main exported component ===
export default function Pista3DHero() {
  const [selected, setSelected] = useState<VenueId | null>(null);
  const selectedVenue = VENUES.find((v) => v.id === selected) || null;

  return (
    <div className="pista3d-shell">
      <Canvas
        shadows
        camera={{ position: [8, 8, 12], fov: 55 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene selectedVenue={selected} onSelect={setSelected} />
        </Suspense>
      </Canvas>

      {/* Overlay UI */}
      <div className="pista3d-overlay">
        <div className="pista3d-kicker">CB GRUP BARNA × TIME CHAMBER × EIX CLOT</div>
        <h1 className="pista3d-headline">
          Així es <em>viu</em> el 3×3
        </h1>
        <p className="pista3d-sub">
          Tres pistes al barri del Clot-Glòries. Una mateixa pilota. <strong>6-7 juny 2026.</strong>
        </p>

        <div className="pista3d-actions">
          <a href="/inscripcion" className="pista3d-cta-primary">
            Inscriu el teu equip →
          </a>
          <a href="/porta-un-rival" className="pista3d-cta-secondary">
            Porta un rival · −5 €
          </a>
        </div>
      </div>

      {/* Venue selector dock */}
      <div className="pista3d-dock">
        {VENUES.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`pista3d-dock-btn${selected === v.id ? " pista3d-dock-btn-active" : ""}`}
            style={{ ["--venue-color" as string]: v.color }}
            onClick={() => setSelected(selected === v.id ? null : v.id)}
          >
            <span className="pista3d-dock-dot" />
            <span>{v.shortName}</span>
          </button>
        ))}
      </div>

      {/* Detail panel — appears when a venue is selected */}
      {selectedVenue && (
        <div className="pista3d-detail" style={{ borderColor: selectedVenue.color }}>
          <button
            type="button"
            className="pista3d-detail-close"
            onClick={() => setSelected(null)}
            aria-label="Tancar"
          >
            ×
          </button>
          <span
            className="pista3d-detail-tag"
            style={{ color: selectedVenue.color, borderColor: selectedVenue.color }}
          >
            Seu
          </span>
          <strong>{selectedVenue.name}</strong>
          <p>{selectedVenue.description}</p>
          <a href={selectedVenue.href} className="pista3d-detail-cta">
            Veure detalls →
          </a>
        </div>
      )}

      {/* Hint */}
      <div className="pista3d-hint">
        <span>↻ Arrossega per girar · clica una pista per descobrir-la</span>
      </div>
    </div>
  );
}
