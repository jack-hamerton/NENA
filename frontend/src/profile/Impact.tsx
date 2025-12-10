
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SpiderWeb3D } from './SpiderWeb3D';

const Impact = ({ userId }) => {
  // Fetch impact data for the user

  return (
    <div style={{ height: '500px' }}>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <SpiderWeb3D />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Impact;
