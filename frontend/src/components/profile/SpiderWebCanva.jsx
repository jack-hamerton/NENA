
import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force-3d';
import { useHistory } from 'react-router-dom';

// --- Configuration for Follower Categories ---
const CATEGORY_COLORS = {
  'Collaborator': 'royalblue',
  'Mentor': 'tomato',
  'Peer': 'teal',
  'DEFAULT': 'orange' // Fallback for nodes without a category
};
const CENTRIC_USER_COLOR = 'gold';

// --- Graph Component: Handles the D3 simulation and Three.js rendering ---
const Graph = ({ data, is3D, onNodeClick, centricId }) => {
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        if (!data) return;

        const allNodes = new Map();
        const allLinks = [];

        function processNode(node, parent = null) {
            if (!node || !node.id) return;
            if (!allNodes.has(node.id)) {
                allNodes.set(node.id, { ...node, x: 0, y: 0, z: 0 });
            }
            if (parent) {
                allLinks.push({ source: parent.id, target: node.id });
            }
            if (node.followers) {
                node.followers.forEach(follower => processNode(follower, node));
            }
        }

        processNode(data);

        const nodesArray = Array.from(allNodes.values());
        setNodes(nodesArray);
        setLinks(allLinks);

        const simulation = forceSimulation(nodesArray, is3D ? 3 : 2)
            .force('link', forceLink(allLinks).id(d => d.id).distance(20))
            .force('charge', forceManyBody().strength(-30))
            .force('center', forceCenter());

        simulation.on('tick', () => setNodes([...nodesArray]));

        return () => simulation.stop();
    }, [data, is3D]);

    if (!nodes.length) return null;

    return (
        <group>
            {/* Render Links */}
            {links.map((link, i) => {
                 const sourceNode = nodes.find(n => n.id === link.source.id);
                 const targetNode = nodes.find(n => n.id === link.target.id);
                 if (!sourceNode || !targetNode) return null;

                 return (
                     <line key={i}>
                         <bufferGeometry attach="geometry">
                             <bufferAttribute
                                 attach='attributes-position'
                                 count={2}
                                 array={new Float32Array([
                                     sourceNode.x, sourceNode.y, is3D ? sourceNode.z : 0,
                                     targetNode.x, targetNode.y, is3D ? targetNode.z : 0,
                                 ])}
                                 itemSize={3}
                             />
                         </bufferGeometry>
                         <lineBasicMaterial attach="material" color="#aaa" transparent opacity={0.4} />
                     </line>
                 );
            })}
            {/* Render Nodes */}
            {nodes.map(node => (
                <mesh
                    key={node.id}
                    position={[node.x, node.y, is3D ? node.z : 0]}
                    onClick={() => onNodeClick(node.id)}
                    onPointerOver={(e) => { e.object.scale.set(1.5, 1.5, 1.5); document.body.style.cursor = 'pointer'; }}
                    onPointerOut={(e) => { e.object.scale.set(1, 1, 1); document.body.style.cursor = 'auto'; }}
                >
                    <sphereGeometry args={[node.id === centricId ? 1.8 : 1.2, 24, 24]} />
                    <meshStandardMaterial color={node.id === centricId ? CENTRIC_USER_COLOR : (CATEGORY_COLORS[node.category] || CATEGORY_COLORS.DEFAULT)} />
                    
                    {/* Username above the node */}
                    <Text position={[0, 2.5, 0]} fontSize={1.2} color="white" anchorX="center" anchorY="middle">
                        {node.name}
                    </Text>

                    {/* Category below the node (only for followers) */}
                    {node.id !== centricId && node.category && (
                        <Text position={[0, -2.5, 0]} fontSize={0.9} color="lightgray" anchorX="center" anchorY="middle">
                            {node.category}
                        </Text>
                    )}
                </mesh>
            ))}
        </group>
    );
};

// --- UI Components ---
const Legend = ({ metrics, userName }) => (
    <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 1, background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '8px', color: 'white', fontFamily: 'sans-serif', minWidth: '150px' }}>
        <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid white', paddingBottom: '10px', fontWeight: 'bold' }}>{userName}'s Web</h4>
        {Object.entries(CATEGORY_COLORS).filter(([key]) => key !== 'DEFAULT').map(([category, color]) => (
            <div key={category} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '14px', height: '14px', backgroundColor: color, marginRight: '10px', borderRadius: '50%' }}></div>
                <span>{category}: <strong>{metrics[category] || 0}</strong></span>
            </div>
        ))}
         <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '14px', height: '14px', backgroundColor: CATEGORY_COLORS.DEFAULT, marginRight: '10px', borderRadius: '50%' }}></div>
            <span>Other: <strong>{metrics['Other'] || 0}</strong></span>
        </div>
    </div>
);


/**
 * A production-ready 3D spider web visualization for user follower networks, categorized by intent.
 * @param {{ user: Object, isLoading: boolean, error: Object, followerIntentMetrics: Object }} props
 * @param {Object} props.user - User data with followers, where each follower MUST have a 'category' property.
 * @param {boolean} props.isLoading - True if data is being fetched.
 * @param {Object} props.error - An error object if the data fetch failed.
 * @param {Object} props.followerIntentMetrics - An object with the count for each category, e.g., { Collaborator: 5, Mentor: 2, Peer: 10 }
 */
const SpiderWebCanva = ({ user, isLoading, error, followerIntentMetrics }) => {
    const history = useHistory();
    const [is3D, setIs3D] = useState(true);
    const controlsRef = useRef();

    const handleNodeClick = (nodeId) => {
        if (nodeId !== user?.id) {
            history.push(`/profile/${nodeId}`);
        }
    };

    const resetCamera = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    const containerStyle = { height: '100vh', width: '100%', background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '1.5em', fontFamily: 'sans-serif' };

    if (isLoading) return <div style={containerStyle}>Loading Follower Web...</div>;
    if (error) return <div style={containerStyle}>Error: {error.message}</div>;
    if (!user) return <div style={containerStyle}>No user data available.</div>;

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%', background: '#111' }}>
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}>
                <button onClick={resetCamera} style={{padding: '8px 12px', cursor: 'pointer', marginRight: '10px'}}>Reset View</button>
                <button onClick={() => setIs3D(!is3D)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                    View: {is3D ? '3D' : '2D'}
                </button>
            </div>
            <Canvas camera={{ position: [0, 0, 70], fov: 60 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={0.6} />
                <Graph data={user} is3D={is3D} onNodeClick={handleNodeClick} centricId={user.id} />
                <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
            <Legend metrics={followerIntentMetrics || {}} userName={user.name || 'User'} />
        </div>
    );
};

export default SpiderWebCanva;
