
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars, OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Agent, Task } from '../types';
import { STATUS_COLORS } from '../data/agents';

// ── Brain shape generator with agent-aware coloring ─

const generateBrainPoints = (count: number, agents: Agent[], scale = 1) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const baseColor = new THREE.Color('#6B21A8'); // Purple base
  const tmpVec = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const isLeftLobe = Math.random() > 0.5;
    const lobeX = isLeftLobe ? -0.4 : 0.4;

    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    // Brain wrinkle noise
    const noise = (Math.sin(theta * 6) * Math.cos(phi * 4)) * 0.15;

    const rx = (1.3 + noise) * scale;
    const ry = (1.9 + noise) * scale;
    const rz = (1.4 + noise) * scale;

    const x = (lobeX + rx * Math.sin(phi) * Math.cos(theta)) * 0.8;
    const y = (ry * Math.sin(phi) * Math.sin(theta)) * 0.7;
    const z = (rz * Math.cos(phi)) * 0.9;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Color: blend between purple base and nearest agent color
    tmpVec.set(x, y, z);
    let closestDist = Infinity;
    let closestColor = baseColor;

    for (const agent of agents) {
      const regionVec = new THREE.Vector3(...agent.region);
      const dist = tmpVec.distanceTo(regionVec);
      if (dist < closestDist) {
        closestDist = dist;
        closestColor = new THREE.Color(agent.color);
      }
    }

    const influence = Math.max(0, 1 - closestDist / 1.4);
    const blended = baseColor.clone().lerp(closestColor, influence * 0.65);

    colors[i * 3] = blended.r;
    colors[i * 3 + 1] = blended.g;
    colors[i * 3 + 2] = blended.b;
  }

  return { positions, colors };
};

// ── Neural impulses traveling between points ────────

const NeuralImpulses = ({ count = 35, positions }: { count: number; positions: Float32Array }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const impulses = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const startIdx = Math.floor(Math.random() * (positions.length / 3)) * 3;
      const endIdx = Math.floor(Math.random() * (positions.length / 3)) * 3;
      return {
        start: new THREE.Vector3(positions[startIdx], positions[startIdx + 1], positions[startIdx + 2]),
        end: new THREE.Vector3(positions[endIdx], positions[endIdx + 1], positions[endIdx + 2]),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.015,
      };
    });
  }, [count, positions]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const imp = impulses[i];
      imp.progress += imp.speed;
      if (imp.progress > 1) {
        imp.progress = 0;
        const nextIdx = Math.floor(Math.random() * (positions.length / 3)) * 3;
        imp.start.copy(imp.end);
        imp.end.set(positions[nextIdx], positions[nextIdx + 1], positions[nextIdx + 2]);
      }
      child.position.lerpVectors(imp.start, imp.end, imp.progress);
      child.scale.setScalar(0.8 + Math.sin(Date.now() * 0.01) * 0.2);
    });
  });

  return (
    <group ref={groupRef}>
      {impulses.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// ── Mist layer for depth ────────────────────────────

const MistLayer = ({ count, color, size, speed, agents }: {
  count: number; color: string; size: number; speed: number; agents: Agent[];
}) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const { positions } = useMemo(() => generateBrainPoints(count, agents, 1.2), [count, agents]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * speed;
      pointsRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.12}
      />
    </Points>
  );
};

// ── Task connection lines (Bezier curves) ───────────

const TaskConnections = ({ tasks, agents }: { tasks: Task[]; agents: Agent[] }) => {
  const groupRef = useRef<THREE.Group>(null!);

  const lineObjects = useMemo(() => {
    const agentMap = new Map(agents.map(a => [a.id, a]));
    const lines: { object: THREE.Line; speed: number; offset: number }[] = [];
    const agentIds = agents.map(a => a.id);

    // Task-based connections
    for (const task of tasks) {
      const fromAgent = agentMap.get(task.agentId);
      if (!fromAgent) continue;

      for (const otherId of agentIds) {
        if (otherId === task.agentId) continue;
        if (Math.random() > 0.45) continue;

        const toAgent = agentMap.get(otherId);
        if (!toAgent) continue;

        const start = new THREE.Vector3(...fromAgent.region).add(
          new THREE.Vector3((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3)
        );
        const end = new THREE.Vector3(...toAgent.region).add(
          new THREE.Vector3((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3)
        );
        const mid = start.clone().add(end).multiplyScalar(0.5);
        mid.y += 0.2 + Math.random() * 0.4;

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
        const color = new THREE.Color(STATUS_COLORS[task.status] ?? '#6B21A8');

        const material = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        lines.push({
          object: new THREE.Line(geometry, material),
          speed: 0.3 + Math.random() * 0.7,
          offset: Math.random() * Math.PI * 2,
        });
      }
    }

    // Ambient neural connections to fill up to ~80
    const target = 80;
    while (lines.length < target) {
      const fromIdx = Math.floor(Math.random() * agentIds.length);
      const toIdx = (fromIdx + 1 + Math.floor(Math.random() * (agentIds.length - 1))) % agentIds.length;
      const from = agentMap.get(agentIds[fromIdx]);
      const to = agentMap.get(agentIds[toIdx]);
      if (!from || !to) continue;

      const start = new THREE.Vector3(...from.region).add(
        new THREE.Vector3((Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7)
      );
      const end = new THREE.Vector3(...to.region).add(
        new THREE.Vector3((Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7)
      );
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.y += 0.15 + Math.random() * 0.3;

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
      const color = new THREE.Color('#6B21A8').lerp(new THREE.Color('#00D9FF'), Math.random() * 0.3);

      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      lines.push({
        object: new THREE.Line(geometry, material),
        speed: 0.1 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
      });
    }

    return lines.slice(0, target);
  }, [tasks, agents]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    lineObjects.forEach((entry, i) => {
      const child = groupRef.current.children[i];
      if (child instanceof THREE.Line) {
        const mat = child.material as THREE.LineBasicMaterial;
        mat.opacity = 0.12 + Math.sin(t * entry.speed * 3 + entry.offset) * 0.18;
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
};

// ── Agent node markers with labels ──────────────────

const AgentNodes = ({ agents }: { agents: Agent[] }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y += Math.sin(t * 0.8 + i * 2.1) * 0.0004;
    });
  });

  return (
    <group ref={groupRef}>
      {agents.map((agent) => (
        <group key={agent.id} position={agent.region}>
          {/* Core sphere */}
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={agent.color} transparent opacity={0.95} />
          </mesh>
          {/* Outer glow */}
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial
              color={agent.color}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Name label */}
          <Text
            position={[0, -0.22, 0]}
            fontSize={0.09}
            color={agent.color}
            anchorX="center"
            anchorY="top"
            outlineWidth={0.004}
            outlineColor="#000000"
          >
            {agent.name}
          </Text>
          {/* Status */}
          <Text
            position={[0, -0.33, 0]}
            fontSize={0.055}
            color={agent.status === 'online' ? '#00E676' : agent.status === 'idle' ? '#FFB800' : '#6B6B80'}
            anchorX="center"
            anchorY="top"
          >
            {agent.status === 'online' ? '● ONLINE' : agent.status === 'idle' ? '● IDLE' : '● OFFLINE'}
          </Text>
        </group>
      ))}
    </group>
  );
};

// ── Core neural mesh (main brain) ───────────────────

const CoreNeuralMesh = ({ agents, tasks }: { agents: Agent[]; tasks: Task[] }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => generateBrainPoints(12000, agents), [agents]);

  // Internal short-range synaptic lines
  const linePositions = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 400; i++) {
      const idx1 = Math.floor(Math.random() * (positions.length / 3)) * 3;
      const idx2 = Math.floor(Math.random() * (positions.length / 3)) * 3;
      const d2 =
        (positions[idx1] - positions[idx2]) ** 2 +
        (positions[idx1 + 1] - positions[idx2 + 1]) ** 2 +
        (positions[idx1 + 2] - positions[idx2 + 2]) ** 2;
      if (d2 < 0.6) {
        arr.push(
          positions[idx1], positions[idx1 + 1], positions[idx1 + 2],
          positions[idx2], positions[idx2 + 1], positions[idx2 + 2]
        );
      }
    }
    return new Float32Array(arr);
  }, [positions]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rot = time * 0.1;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = rot;
      const s = 1 + Math.sin(time * 0.4) * 0.03;
      pointsRef.current.scale.set(s, s, s);
    }
  });

  // We need a separate ref for the line segments to sync rotation
  const lineRef = useRef<THREE.LineSegments>(null!);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lineRef.current) {
      lineRef.current.rotation.y = time * 0.1;
      const s = 1 + Math.sin(time * 0.4) * 0.03;
      lineRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Main particle cloud */}
      <Points ref={pointsRef} positions={positions} colors={colors}>
        <PointMaterial
          transparent
          vertexColors
          size={0.028}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Short-range synaptic lines */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00f2ff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Mist layers */}
      <MistLayer count={2500} color="#06b6d4" size={0.15} speed={0.04} agents={agents} />

      {/* Neural impulses */}
      <NeuralImpulses positions={positions} count={35} />

      {/* Task connection bezier curves */}
      <TaskConnections tasks={tasks} agents={agents} />

      {/* Agent node markers */}
      <AgentNodes agents={agents} />
    </group>
  );
};

// ── Exported BrainCloud component ───────────────────

interface BrainCloudProps {
  agents: Agent[];
  tasks: Task[];
}

export const BrainCloud: React.FC<BrainCloudProps> = ({ agents, tasks }) => {
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={32} />
        <color attach="background" args={['#0a0b0d']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#00f2ff" />
        <pointLight position={[-5, 3, -5]} intensity={1.0} color="#6B21A8" />

        <Stars radius={60} depth={50} count={3000} factor={4} saturation={0} fade speed={0.6} />

        <Float speed={2} rotationIntensity={0.25} floatIntensity={0.4}>
          <CoreNeuralMesh agents={agents} tasks={tasks} />
        </Float>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={14}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};
