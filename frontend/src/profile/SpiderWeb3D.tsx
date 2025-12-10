
import { useMemo } from 'react';
import * as THREE from 'three';

const nodes = [
  { id: 'user1', name: 'User 1', impact: 0.8 },
  { id: 'user2', name: 'User 2', impact: 0.6 },
  { id: 'user3', name: 'User 3', impact: 0.9 },
  { id: 'user4', name: 'User 4', impact: 0.4 },
  { id: 'user5', name: 'User 5', impact: 0.7 },
];

const links = [
  { source: 'user1', target: 'user2' },
  { source: 'user1', target: 'user3' },
  { source: 'user2', target: 'user4' },
  { source: 'user3', target: 'user5' },
];

export const SpiderWeb3D = () => {
  const { positions, lineSegments } = useMemo(() => {
    const positions = new Float32Array(nodes.length * 3);
    const nodeMap = new Map();
    nodes.forEach((node, i) => {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      nodeMap.set(node.id, new THREE.Vector3(x, y, z));
    });

    const lineSegments = new THREE.BufferGeometry();
    const linePositions = [];
    links.forEach(link => {
      const start = nodeMap.get(link.source);
      const end = nodeMap.get(link.target);
      if (start && end) {
        linePositions.push(start.x, start.y, start.z);
        linePositions.push(end.x, end.y, end.z);
      }
    });
    lineSegments.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    return { positions, lineSegments };
  }, []);

  return (
    <>
      {nodes.map((node, i) => (
        <mesh key={node.id} position={[positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={new THREE.Color().setHSL(node.impact, 0.5, 0.5)} />
        </mesh>
      ))}
      <lineSegments geometry={lineSegments}>
        <lineBasicMaterial color="white" />
      </lineSegments>
    </>
  );
};
