"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import type { Agent, Task } from "@/lib/mock-data";

// ── Config ──────────────────────────────────────────

const PARTICLE_COUNT = 12000;
const CONNECTION_COUNT = 80;

// Agent region centers on the brain (normalized -1..1)
const AGENT_REGIONS: Record<string, THREE.Vector3> = {
  ula: new THREE.Vector3(-0.6, 0.3, 0.2),    // Left frontal — PM / coordination
  "0xcat": new THREE.Vector3(0.0, 0.5, -0.1), // Top central — engineering core
  kawa: new THREE.Vector3(0.6, 0.2, 0.3),     // Right frontal — support
};

const AGENT_COLORS: Record<string, string> = {
  ula: "#00D9FF",
  "0xcat": "#00E676",
  kawa: "#FFB800",
};

const STATUS_COLORS: Record<string, string> = {
  running: "#00D9FF",
  completed: "#00E676",
  pending: "#FFB800",
  error: "#FF3366",
};

// ── Brain shape generator ───────────────────────────

function generateBrainPoints(count: number): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Spherical sampling with brain-like deformation
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.8 + Math.random() * 0.2;

    // Base sphere
    let x = r * Math.sin(phi) * Math.cos(theta);
    let y = r * Math.sin(phi) * Math.sin(theta);
    let z = r * Math.cos(phi);

    // Ellipsoid stretch (wider than tall, brain-like)
    x *= 1.3;
    y *= 1.0;
    z *= 1.1;

    // Central fissure (groove down the middle)
    const fissureDepth = Math.exp(-x * x * 8) * 0.15;
    y -= fissureDepth;

    // Sulci (brain wrinkle noise)
    const freq = 4.0;
    const noise =
      Math.sin(x * freq + z * freq * 0.7) *
      Math.cos(y * freq * 1.3 + x * freq * 0.5) *
      0.08;
    x += noise * Math.cos(theta);
    y += noise * Math.sin(theta);
    z += noise * Math.cos(phi);

    // Flatten bottom slightly
    if (y < -0.6) {
      y = -0.6 + (y + 0.6) * 0.3;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

// ── Particle colors based on agent proximity ────────

function generateColors(positions: Float32Array, agents: Agent[]): Float32Array {
  const colors = new Float32Array((positions.length / 3) * 3);
  const baseColor = new THREE.Color("#6B21A8"); // Purple base
  const tmpVec = new THREE.Vector3();

  for (let i = 0; i < positions.length / 3; i++) {
    tmpVec.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);

    let closestDist = Infinity;
    let closestColor = baseColor;

    for (const agent of agents) {
      const region = AGENT_REGIONS[agent.id];
      if (!region) continue;
      const dist = tmpVec.distanceTo(region);
      if (dist < closestDist) {
        closestDist = dist;
        closestColor = new THREE.Color(AGENT_COLORS[agent.id] ?? "#6B21A8");
      }
    }

    // Blend: closer to agent region = more agent color, further = purple base
    const influence = Math.max(0, 1 - closestDist / 1.2);
    const blended = baseColor.clone().lerp(closestColor, influence * 0.7);

    colors[i * 3] = blended.r;
    colors[i * 3 + 1] = blended.g;
    colors[i * 3 + 2] = blended.b;
  }

  return colors;
}

// ── Connection lines between agents based on tasks ──

interface ConnectionData {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: THREE.Color;
  speed: number;
  offset: number;
}

function generateConnections(tasks: Task[]): ConnectionData[] {
  const connections: ConnectionData[] = [];

  // Agent-to-agent connections based on task relationships
  const agentIds = Object.keys(AGENT_REGIONS);

  for (const task of tasks) {
    const fromRegion = AGENT_REGIONS[task.agentId];
    if (!fromRegion) continue;

    // Connect to other agents (simulating collaboration)
    for (const otherId of agentIds) {
      if (otherId === task.agentId) continue;
      const toRegion = AGENT_REGIONS[otherId];
      if (!toRegion) continue;

      // Only some tasks create cross-agent connections
      if (Math.random() > 0.4) continue;

      const color = new THREE.Color(STATUS_COLORS[task.status] ?? "#6B21A8");
      connections.push({
        start: fromRegion.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
        )),
        end: toRegion.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
        )),
        color,
        speed: 0.3 + Math.random() * 0.7,
        offset: Math.random() * Math.PI * 2,
      });
    }
  }

  // Add some ambient neural connections
  for (let i = 0; i < CONNECTION_COUNT - connections.length; i++) {
    const fromIdx = Math.floor(Math.random() * agentIds.length);
    const toIdx = (fromIdx + 1 + Math.floor(Math.random() * (agentIds.length - 1))) % agentIds.length;
    const from = AGENT_REGIONS[agentIds[fromIdx]];
    const to = AGENT_REGIONS[agentIds[toIdx]];
    if (!from || !to) continue;

    connections.push({
      start: from.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
      )),
      end: to.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
      )),
      color: new THREE.Color("#6B21A8").lerp(new THREE.Color("#00D9FF"), Math.random() * 0.3),
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    });
  }

  return connections.slice(0, CONNECTION_COUNT);
}

// ── Brain Particles Component ───────────────────────

function BrainParticles({ agents }: { agents: Agent[] }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = generateBrainPoints(PARTICLE_COUNT);
    const col = generateColors(pos, agents);
    return { positions: pos, colors: col };
  }, [agents]);

  const sizes = useMemo(() => {
    const s = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      s[i] = 0.008 + Math.random() * 0.012;
    }
    return s;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle breathing animation
    pointsRef.current.rotation.y = t * 0.05;

    // Pulse particle sizes
    const sizeAttr = pointsRef.current.geometry.getAttribute("size") as THREE.BufferAttribute;
    if (sizeAttr) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const base = sizes[i];
        const pulse = Math.sin(t * 2 + i * 0.01) * 0.003;
        sizeAttr.setX(i, base + pulse);
      }
      sizeAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.85}
        size={0.015}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Neural Connections Component ────────────────────

function NeuralConnections({ tasks }: { tasks: Task[] }) {
  const groupRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => generateConnections(tasks), [tasks]);

  const lineObjects = useMemo(() => {
    return connections.map((conn) => {
      // Bezier curve for organic look
      const mid = conn.start.clone().add(conn.end).multiplyScalar(0.5);
      mid.y += 0.2 + Math.random() * 0.3; // Arc upward

      const curve = new THREE.QuadraticBezierCurve3(conn.start, mid, conn.end);
      const points = curve.getPoints(20);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color: conn.color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const line = new THREE.Line(geometry, material);
      return { object: line, speed: conn.speed, offset: conn.offset };
    });
  }, [connections]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    lineObjects.forEach((entry, i) => {
      const child = groupRef.current!.children[i];
      if (child instanceof THREE.Line) {
        const mat = child.material as THREE.LineBasicMaterial;
        mat.opacity = 0.15 + Math.sin(t * entry.speed * 3 + entry.offset) * 0.15;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {lineObjects.map((entry, i) => (
        <primitive key={i} object={entry.object} />
      ))}
    </group>
  );
}

// ── Agent Node Labels ───────────────────────────────

function AgentNodes({ agents }: { agents: Agent[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle float
    groupRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(t * 0.8 + i * 2) * 0.0003;
    });
  });

  return (
    <group ref={groupRef}>
      {agents.map((agent) => {
        const pos = AGENT_REGIONS[agent.id];
        if (!pos) return null;
        const color = AGENT_COLORS[agent.id] ?? "#FFFFFF";

        return (
          <group key={agent.id} position={[pos.x, pos.y, pos.z]}>
            {/* Glowing sphere */}
            <mesh>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* Outer glow */}
            <mesh>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.2}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            {/* Label */}
            <Text
              position={[0, -0.18, 0]}
              fontSize={0.08}
              color={color}
              anchorX="center"
              anchorY="top"
              font="/fonts/inter.woff"
              outlineWidth={0.003}
              outlineColor="#000000"
            >
              {agent.name}
            </Text>
            {/* Status indicator */}
            <Text
              position={[0, -0.27, 0]}
              fontSize={0.05}
              color={agent.status === "online" ? "#00E676" : agent.status === "idle" ? "#FFB800" : "#6B6B80"}
              anchorX="center"
              anchorY="top"
            >
              {agent.status === "online" ? "● ONLINE" : agent.status === "idle" ? "● IDLE" : "● OFFLINE"}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// ── Main Scene ──────────────────────────────────────

function BrainScene({ agents, tasks }: { agents: Agent[]; tasks: Task[] }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#00D9FF" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#6B21A8" />

      <BrainParticles agents={agents} />
      <NeuralConnections tasks={tasks} />
      <AgentNodes agents={agents} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 3 / 4}
      />
    </>
  );
}

// ── Exported Component ──────────────────────────────

interface BrainVisualizationProps {
  agents: Agent[];
  tasks: Task[];
}

export function BrainVisualization({ agents, tasks }: BrainVisualizationProps) {
  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    gl.setClearColor("#000000", 0);
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, []);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-border"
      style={{ height: "500px" }}
      role="img"
      aria-label="3D brain visualization showing AI agent neural network connections"
    >
      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      {/* Title overlay */}
      <div className="absolute top-4 left-5 z-10 pointer-events-none">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Neural Network
        </h2>
        <p className="text-xs text-text-muted mt-1">Agent collaboration topology</p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-5 z-10 pointer-events-none flex flex-col gap-1.5">
        {agents.map((a) => (
          <div key={a.id} className="flex items-center gap-1.5 text-[10px]">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: AGENT_COLORS[a.id] }}
            />
            <span className="text-text-muted">{a.name}</span>
          </div>
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        onCreated={handleCreated}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <BrainScene agents={agents} tasks={tasks} />
      </Canvas>
    </div>
  );
}
